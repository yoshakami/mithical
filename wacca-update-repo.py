import os
import sys
import repo
import stat
import traceback
import requests
import datetime


SERVER_IP = repo.ENV_CONFIG.get('server_ip')
WACCA = repo.ENV_CONFIG.get('wacca')
BRANCH = repo.ENV_CONFIG.get('branch')
simulate = False
ignore_txtp = False
ignore_bak = False
ignore_usm = False
ignore_awb = False
ignore_NotOnServer = False
for arg in sys.argv[1:]:
    if arg == '-s':
        simulate = True
    elif arg == '-t':
        ignore_txtp = True
    elif arg == '-b':
        ignore_bak = True
    elif arg == '-u':
        ignore_usm = True
    elif arg == '-a':
        ignore_awb = True
    elif arg == '-n':
        ignore_NotOnServer = True
    else:
        BRANCH = arg

try:
    if BRANCH == None or SERVER_IP == None or WACCA == None:
        raise("You didn't setup .env correctly! look at the example")
    os.chdir(WACCA)

    # create local snapshot
    if os.path.exists(repo.FILE_NAME):
        os.remove(repo.FILE_NAME)
    repo.snapshot("./", repo.FILE_NAME)

    # send repo.gz to server
    with open(repo.FILE_NAME, "rb") as f:
        r = requests.post(f"{SERVER_IP}/upload_snapshot/{BRANCH}", files={"file": f})
    print(r)
    if r.status_code == 500:
        print("❌ Server Error (500)")
        print(r.text)
        exit()
    elif r.status_code == 503:
        print("⚠️ The server is down (503), please try again later")
        exit()
    elif r.status_code != 200:
        print(f"⚠️ HTTP Error {r.status_code}")
        print(r.text)
        

    changes = r.json()

    # download added and modified files
    for change in changes:
        action = change.get("action")
        relpath = change.get("path")
        ext = os.path.splitext(relpath)[-1]
        if ignore_txtp and ext == '.txtp':
            continue
        if ignore_bak and ext == '.bak':
            continue
        if ignore_usm and ext == '.usm':
            continue
        if ignore_awb and ext == '.awb':
            continue

        if action in ("+", "~"):
            if simulate:
                print(f"{action} Update: {relpath}")
                continue
            url = f"{SERVER_IP}/download_file/{BRANCH}?path={relpath}"
            resp = requests.get(url)
            if resp.status_code == 200:
                dirpath = os.path.dirname(relpath)
                if dirpath:
                    os.makedirs(dirpath, exist_ok=True)
                if relpath == "repo.gz":
                    continue

                # Always replace file (breaks hardlinks)
                if os.path.exists(relpath):
                    try:
                        os.chmod(relpath, stat.S_IWRITE)
                    except Exception:
                        pass
                    os.remove(relpath)

                with open(relpath, "wb") as out:
                    out.write(resp.content)

                # Restore mtime
                mtime_str = change.get("mtime")
                if mtime_str:
                    dt = datetime.datetime.fromisoformat(mtime_str.replace("Z", "+00:00"))
                    ts = dt.timestamp()
                    os.utime(relpath, (ts, ts))
                    print(f"[OK] mtime restored {dt}")
                else:
                    print(f"[ERROR] No mtime for {relpath}")

                print(f"{action} Update: {relpath}")

        elif action == "-" and not ignore_NotOnServer:
            print("Not on server =>", relpath)
            # os.chmod(relpath, stat.S_IWRITE)  # removes read-only attribute
            # os.remove(relpath)
            # print("To delete (local):", relpath)

except requests.exceptions.ConnectionError as e:
    input(f"Cannot connect to {SERVER_IP}, check your internet connection\npress enter to exit")
except Exception as e:
    traceback.print_exception(e)
    input("press enter to exit")

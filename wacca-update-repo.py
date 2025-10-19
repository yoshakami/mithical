import os
import repo
import stat
import traceback
import requests
import datetime

# SERVER_IP = "192.168.1.11:5000"
SERVER_IP = repo.ENV_CONFIG.get('server_ip')
WACCA = repo.ENV_CONFIG.get('wacca')

try:
    os.chdir(WACCA)

    # create local snapshot
    if os.path.exists(repo.FILE_NAME):
        os.remove(repo.FILE_NAME)
    repo.snapshot("./", repo.FILE_NAME)

    # send repo.gz to server
    with open(repo.FILE_NAME, "rb") as f:
        r = requests.post(f"{SERVER_IP}/upload_snapshot", files={"file": f})
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

        if action in ("+", "~"):
            url = f"{SERVER_IP}/download_file?path={relpath}"
            resp = requests.get(url)
            if resp.status_code == 200:
                dirpath = os.path.dirname(relpath)
                if dirpath:
                    os.makedirs(dirpath, exist_ok=True)

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

        elif action == "-":
            print("Not on server =>", relpath)
            # os.chmod(relpath, stat.S_IWRITE)  # removes read-only attribute
            # os.remove(relpath)
            # print("To delete (local):", relpath)


except Exception as e:
    traceback.print_exception(e)
    input("press enter to exit")

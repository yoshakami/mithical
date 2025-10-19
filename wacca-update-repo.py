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

    # (Re)créer le snapshot local
    if os.path.exists(repo.FILE_NAME):
        os.remove(repo.FILE_NAME)
    repo.snapshot("./", repo.FILE_NAME)

    # 1. Envoyer snapshot.gz au serveur
    with open(repo.FILE_NAME, "rb") as f:
        r = requests.post(f"{SERVER_IP}/upload_snapshot", files={"file": f})
    print(r)
    # Vérification des erreurs serveur
    if r.status_code == 500:
        print("❌ Erreur côté serveur (500)")
        print(r.text)
        exit()
    elif r.status_code == 503:
        print("⚠️ Le serveur est éteint (503), veuillez réessayer plus tard")
        exit()
    elif r.status_code != 200:
        print(f"⚠️ Erreur HTTP {r.status_code}")
        print(r.text)
        

    changes = r.json()

    # 2. Télécharger les fichiers modifiés ou ajoutés
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
                    print(f"[OK] mtime restauré {dt}")
                else:
                    print("[ERREUR] Pas de mtime pour", relpath)

                print(f"{action} Mise à jour: {relpath}")

        elif action == "-":
            print("Not on server =>", relpath)
            # os.chmod(relpath, stat.S_IWRITE)  # removes read-only attribute
            # os.remove(relpath)
            # print("À supprimer (local):", relpath)


except Exception as e:
    traceback.print_exception(e)
    input("press enter to exit")

# coding: utf-8
import os
import sys
import gzip
import datetime
from operator import itemgetter
from collections import OrderedDict
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
FILE_NAME = "repo.gz"

def snapshot(root_path, out_file_gz):
    with gzip.open(out_file_gz, 'wt', encoding='utf-8') as f:
        now = datetime.datetime.now().isoformat()
        f.write(f"# snapshot: {now}\n")
        for dirpath, _, filenames in os.walk(root_path):
            for file in filenames:
                path = os.path.join(dirpath, file)
                if path == root_path + out_file_gz:
                    continue
                rel_path = os.path.relpath(path, root_path)
                try:
                    stat = os.stat(path)
                    size = stat.st_size
                    mtime = datetime.datetime.fromtimestamp(stat.st_mtime).isoformat()
                    f.write(f"{rel_path}|{size}|{mtime}\n")
                except FileNotFoundError:
                    # Fichier supprimé entre-temps
                    continue

def load_snapshot(snapshot_path):
    snapshot = {}
    with gzip.open(snapshot_path, 'rt', encoding='utf-8') as f:
        for line in f:
            if line.startswith('#'):
                continue
            try:
                path, size, mtime = line.strip().split('|')
                snapshot[path] = (int(size), mtime)
            except ValueError:
                continue
    return snapshot

def scan_current_state(root_path):
    state = {}
    for dirpath, _, filenames in os.walk(root_path):
        for file in filenames:
            full = os.path.join(dirpath, file)
            if full == root_path + FILE_NAME:
                continue
            rel = os.path.relpath(full, root_path)
            try:
                stat = os.stat(full)
                size = stat.st_size
                mtime = datetime.datetime.fromtimestamp(stat.st_mtime).isoformat()
                state[rel] = (size, mtime)
            except FileNotFoundError:
                continue
    return state

def diff_snapshot_vs_disk(root_path, snapshot_path):
    snapshot = load_snapshot(snapshot_path)
    current = scan_current_state(root_path)

    all_paths = set(snapshot) | set(current)

    for path in sorted(all_paths):
        in_snap = path in snapshot
        in_curr = path in current
        p = path.replace('\\', '/')
        if in_snap and not in_curr:
            print(f"- {p}")  # supprimé
        elif not in_snap and in_curr:
            print(f"+ {p}")  # ajouté
        elif in_snap and in_curr:
            snap_size, snap_mtime = snapshot[path]
            curr_size, curr_mtime = current[path]

            if snap_size != curr_size or snap_mtime != curr_mtime:
                s = print_size(curr_size-snap_size)
                if s[0] != "-":
                    s = '+' + s
                elif s == "0B":
                    s = ""
                if snap_mtime != curr_mtime:
                    dt = datetime.datetime.fromisoformat(curr_mtime)
                    s += dt.strftime(" %d/%m/%Y %H:%M:%S") # Exemple : 02/06/2025 18:34:12

                print(f"~ {p} {s}")  # modifié
            # else:
            #     print(f"= {path}")  # inchangé (optionnel)

def print_size(value):
    if value > 1_073_741_824: # 1GB
        return f"{bytes_to_gb(value)}GB"
    elif value > 1_048_576: # 1MB
        return f"{bytes_to_mb(value)}MB"
    elif value > 1024: # 1KB
        return f"{bytes_to_kb(value)}KB"
    else:
        return f"{value}B"

def bytes_to_kb(bytes_num):
    return bytes_num >> 10

def bytes_to_mb(bytes_num):
    return bytes_num >> 20


def bytes_to_gb(bytes_num):
    return bytes_num >> 30

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4 or sys.argv[1] != "diff":
        print("CLI Usage: python repo.py diff <ROOT_PATH> <SNAPSHOT_PATH>")
        if not os.path.exists('./' + FILE_NAME):
            print(f"./{FILE_NAME} doesn't exist.\ncreating snapshot...")
            snapshot("./", FILE_NAME)
            print('done!')
        else:
            print(f"./{FILE_NAME} found! comparing...")
            diff_snapshot_vs_disk('./', FILE_NAME)
    else:
        root = sys.argv[2]
        snap = sys.argv[3]
        diff_snapshot_vs_disk(root, snap)

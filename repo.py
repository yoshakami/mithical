# coding: utf-8
import os
import sys
import gzip
import json
import datetime

ENV_CONFIG = {}
if os.path.exists('.env'):
    with open('.env', 'r') as txt:
        a = txt.readlines()
    for line in a:
        if '=' in line:
            ENV_CONFIG[line.lsplit('=', 1)[0].lower()] = line.lsplit('=', 1)[1]

FILE_NAME = "repo.gz"

def format_utc(ts: float) -> str:
    """Retourne un timestamp UTC ISO8601 (finissant par Z), sans décalage local."""
    return (
        datetime.datetime.utcfromtimestamp(ts)
        .replace(tzinfo=datetime.timezone.utc, microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )


def mtimes_equal(m1, m2, tolerance=5):
    """Compare deux timestamps ISO8601 avec une tolérance de 5 secondes."""
    try:
        t1 = datetime.datetime.fromisoformat(m1.replace("Z", "+00:00")).timestamp()
        t2 = datetime.datetime.fromisoformat(m2.replace("Z", "+00:00")).timestamp()
        return abs(t1 - t2) <= tolerance
    except Exception:
        return False

def snapshot(root_path, out_file_gz):
    """Crée un snapshot compressé de l’état du répertoire."""
    with gzip.open(out_file_gz, 'wt', encoding='utf-8') as f:
        now = format_utc(datetime.datetime.now(datetime.timezone.utc).timestamp())
        f.write(f"# snapshot: {now}\n")
        for dirpath, _, filenames in os.walk(root_path):
            for file in filenames:
                path = os.path.join(dirpath, file)
                if path == root_path + out_file_gz:
                    continue
                rel_path = os.path.relpath(path, root_path).replace("\\", "/")
                try:
                    stat = os.stat(path)
                    size = stat.st_size
                    mtime = format_utc(stat.st_mtime)
                    f.write(f"{rel_path}|{size}|{mtime}\n")
                except FileNotFoundError:
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
            rel = os.path.relpath(full, root_path).replace("\\", "/")
            try:
                stat = os.stat(full)
                size = stat.st_size
                mtime = format_utc(stat.st_mtime)
                state[rel] = (size, mtime)
            except FileNotFoundError:
                continue
    return state

def diff_snapshot_vs_disk(root_path, snapshot_path):
    snapshot = load_snapshot(snapshot_path)
    current = scan_current_state(root_path)

    all_paths = set(snapshot) | set(current)
    changes = []
    for path in sorted(all_paths):
        in_snap = path in snapshot
        in_curr = path in current
        p = path.replace('\\', '/')
        if in_snap and not in_curr:
            changes.append({"action": "-", "path": p})
        elif not in_snap and in_curr:
            size, mtime = current[path]
            changes.append({"action": "+", "path": p, "size": size, "mtime": mtime})
        elif in_snap and in_curr:
            snap_size, snap_mtime = snapshot[path]
            curr_size, curr_mtime = current[path]
            if snap_size != curr_size or not mtimes_equal(snap_mtime, curr_mtime):
                changes.append({
                    "action": "~",
                    "path": p,
                    "size": curr_size,
                    "mtime": curr_mtime
                })
    return changes

def print_size(value):
    if value > 1_073_741_824: # 1GB
        return f"{bytes_to_gb(value)}GB"
    elif value > 1_048_576: # 1MB
        return f"{bytes_to_mb(value)}MB"
    elif value > 1024: # 1KB
        return f"{bytes_to_kb(value)}KB"
    else:
        return f"{value}B"

def bytes_to_kb(bytes_num): return bytes_num >> 10
def bytes_to_mb(bytes_num): return bytes_num >> 20
def bytes_to_gb(bytes_num): return bytes_num >> 30

if __name__ == "__main__":
    if len(sys.argv) != 4 or sys.argv[1] != "diff":
        print("CLI Usage: python repo.py diff <ROOT_PATH> <SNAPSHOT_PATH>")
        if not os.path.exists('./' + FILE_NAME):
            print(f"./{FILE_NAME} doesn't exist.\ncreating snapshot...")
            snapshot("./", FILE_NAME)
            print('done!')
        else:
            print(f"./{FILE_NAME} found! comparing...")
            changes = diff_snapshot_vs_disk('./', FILE_NAME)
            print(json.dumps(changes, ensure_ascii=False, indent=2))
    else:
        root = sys.argv[2]
        snap = sys.argv[3]
        changes = diff_snapshot_vs_disk(root, snap)
        print(json.dumps(changes, ensure_ascii=False, indent=2))

# coding: utf-8
import os
import sys
import gzip
import json
import datetime
import hashlib

def md5_of_file(path, chunk_size=65536):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()

ENV_CONFIG = {}
if os.path.exists('.env'):
    with open('.env', 'r') as txt:
        a = txt.readlines()
    for line in a:
        if '=' in line:
            ENV_CONFIG[line.strip().split('=', 1)[0].lower()] = line.strip().split('=', 1)[1]

FILE_NAME = "repo.gz"

def format_utc(ts: float) -> str:
    """Return timestamp UTC ISO8601 (ending with Z), no local diff."""
    return (
        datetime.datetime.utcfromtimestamp(ts)
        .replace(tzinfo=datetime.timezone.utc, microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )


def mtimes_equal(m1, m2, tolerance=5):
    """Compare two timestamps ISO8601 with 5 seconds tolerance."""
    try:
        t1 = datetime.datetime.fromisoformat(m1.replace("Z", "+00:00")).timestamp()
        t2 = datetime.datetime.fromisoformat(m2.replace("Z", "+00:00")).timestamp()
        return abs(t1 - t2) <= tolerance
    except Exception:
        return False

def snapshot(root_path, out_file_gz, use_md5=0):
    """Create a compressed snapshot of the root path file structure."""
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
                    if use_md5:
                        digest = md5_of_file(path)
                        f.write(f"{rel_path}|{size}|{mtime}|{digest}\n")
                    else:
                        f.write(f"{rel_path}|{size}|{mtime}\n")
                except FileNotFoundError:
                    continue

def load_snapshot(snapshot_path):
    snapshot = {}
    with gzip.open(snapshot_path, 'rt', encoding='utf-8') as f:
        for line in f:
            if line.startswith('#'):
                continue
            parts = line.strip().split('|')
            if len(parts) == 3:
                path, size, mtime = parts
                snapshot[path] = (int(size), mtime, None)   # md5 missing
            elif len(parts) == 4:
                path, size, mtime, digest = parts
                snapshot[path] = (int(size), mtime, digest)
    return snapshot

def scan_current_state(root_path, use_md5=False):
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
                digest = md5_of_file(full) if use_md5 else None
                state[rel] = (size, mtime, digest)
            except FileNotFoundError:
                continue
    return state
def diff_snapshot_vs_disk(root_path, snapshot_path, use_md5=False):
    snapshot = load_snapshot(snapshot_path)
    current = scan_current_state(root_path, use_md5)

    all_paths = set(snapshot) | set(current)
    changes = []

    for path in sorted(all_paths):
        p = path.replace('\\', '/')
        in_snap = path in snapshot
        in_curr = path in current

        if in_snap and not in_curr:
            changes.append({"action": "-", "path": p})
            continue

        if not in_snap and in_curr:
            size, mtime, digest = current[path]
            entry = {
                "action": "+",
                "path": p,
                "size": size,
                "mtime": mtime
            }
            if use_md5:
                entry["md5"] = digest
            changes.append(entry)
            continue

        # both present
        ss, sm, sd = snapshot[path]
        cs, cm, cd = current[path]

        replaced = False
        if not use_md5:
            changed = (ss != cs) or (not mtimes_equal(sm, cm))
        else:
            changed = (sd != cd)

        if changed:
            entry = {
                "action": "~",
                "path": p,
                "size": cs,
                "mtime": cm
            }
            if use_md5:
                entry["md5"] = cd
            changes.append(entry)

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
    if len(sys.argv) != 5 or sys.argv[1] != "diff":
        print("CLI Usage: python repo.py diff <ROOT_PATH> <SNAPSHOT_PATH> <0|1:use_md5>")
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
        md5 = sys.argv[4] == "1"
        changes = diff_snapshot_vs_disk(root, snap, md5)
        print(json.dumps(changes, ensure_ascii=False, indent=2))

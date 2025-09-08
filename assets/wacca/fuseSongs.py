import json
import re
import os

# Paths
songs_js_path = "WaccaSongs.js"
export_json_path = "C:\\Wacca\\Nana+T\\WindowsNoEditor\\Mercury\\Content\\Table - Copy\\new2.js"
output_js_path = "WaccaSongs_updated.js"
music_table_optional = "C:\\Wacca\\Wacca\\Nana+\\WindowsNoEditor\\Mercury\\Content\\Table\\MusicParameterTable" # optional

ScoreGenre = ["アニメ／ＰＯＰ", "ボカロ", "東方アレンジ", "2.5次元", "バラエティ", "オリジナル", "TANO*C"]
if not os.path.exists(export_json_path): # optional
    print('extracting Table....')
    os.system(f'wacky unpack --json --output "{export_json_path}" "{music_table_optional}.uasset" "{music_table_optional}.uexp"')
    
# Load waccaExport.json
with open(export_json_path, "r", encoding="utf-8") as f:
    export_data = json.load(f)

# Extract rows from export
rows = export_data[0]["rows"]

# Load WaccaSongs.js as text
with open(songs_js_path, "r", encoding="utf-8") as f:
    js_text = f.read()

# Extract existing IDs with regex
existing_ids = set(map(int, re.findall(r"id:\s*(\d+)", js_text)))
# Sheets (Normal / Hard / Extreme [/ Inferno])
# Map export fields to charter fields
chart_fields = [
    ("DifficultyNormalLv",  "NotesDesignerNormal"),
    ("DifficultyHardLv",    "NotesDesignerHard"),
    ("DifficultyExtremeLv", "NotesDesignerExpert"),
    ("DifficultyInfernoLv", "NotesDesignerInferno"),
]
# --- Helpers ---
def js_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')

def parse_number(x):
    try:
        v = float(x)
        return v
    except Exception:
        return None
    
def fmt_num_compact(v: float) -> str:
    """Print integers without .0, otherwise a plain float."""
    if v is None:
        return "null"
    if abs(v - int(v)) < 1e-9:
        return str(int(v))
    return str(v)

def fmt_diff_one_decimal(v: float) -> str:
    """WACCA diffs look best at 1 decimal place (e.g., 9.7)."""
    if v is None:
        return "null"
    y = round(float(v) + 1e-9, 1)
    if abs(y - int(y)) < 1e-9:
        return str(int(y))
    return f"{y:.1f}"

def clean_designer(s):
    """Normalize designer names; treat '-' or '' as null."""
    if not isinstance(s, str):
        return None
    t = s.strip()
    if not t or t == "-":
        return None
    return t

new_entries = []
for song_id, song in rows.items():
    song_id = int(song_id)
    if song_id not in existing_ids:
        sheets_js_blocks = []
        for idx, (diff_key, designer_key) in enumerate(chart_fields):
            diff_val = parse_number(song.get(diff_key, 0))
            # Skip absent or zero difficulties; specifically omit Inferno if 0.0
            if not diff_val or diff_val <= 0.0:
                continue
            charter = clean_designer(song.get(designer_key))
            charter_js = "null" if charter is None else f'"{js_escape(charter)}"'

            sheet_block = (
    f"""      {{
            difficulty: {fmt_diff_one_decimal(diff_val)},
            gameVersion: 400,
            charter: {charter_js},
        }}"""
            )
            sheets_js_blocks.append(sheet_block)
        a = (",\n").join(sheets_js_blocks)
        category = ScoreGenre[0]
        if 0 < song["ScoreGenre"] < len(ScoreGenre):
            category = ScoreGenre[song["ScoreGenre"]]
        # Build a new JS object for this song
        new_entry = {
            "id": song_id,
            "title": js_escape(song["MusicMessage"]),  # before ｜ as JP title
            "titleEnglish": js_escape(song["MusicMessage"].split("｜")[-1].strip()) if "｜" in song["MusicMessage"] else None,
            "artist": js_escape(song["ArtistMessage"]),
            "dateAdded": 0,
            "dateRemoved": 0,
            "gameVersion": 400,
            "bpm": js_escape(song["Bpm"]),
            "imageName": song["JacketAssetName"] + ".png",
            "category": category, 
            "releaseDate": "2025-07-07",  # not in export
            "sheets": [
                {a}
            ]
        }
        new_entries.append(new_entry)
        
# If new entries exist, inject them before closing "];"
if new_entries:
    # Convert to JS object strings
    entry_strs = []
    for e in new_entries:
        # Format as JS (not JSON)
        sheets_str = "[\n    ]"
        a = next(iter(e['sheets'][0])).replace('\\n', '\n')
        entry_str = f"""  {{
    id: {e['id']},
    title: "{e['title']}",
    titleEnglish: {"null" if e['titleEnglish'] is None else '"' + e['titleEnglish'] + '"'},
    artist: "{e['artist']}",
    dateAdded: 0,
    dateRemoved: 0,
    gameVersion: 400,
    bpm: "{e['bpm']}",
    imageName: "{e['imageName']}",
    category: "{e['category']}",
    releaseDate: "2025-07-07",
    sheets: [{a}],
  }}"""
        entry_strs.append(entry_str)

    injection = ",\n".join(entry_strs)
    js_text = js_text.replace("];", injection + "\n];")

# Save updated file
with open(output_js_path, "w", encoding="utf-8") as f:
    f.write(js_text)

print(f"Added {len(new_entries)} new entries → {output_js_path}")

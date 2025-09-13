from mysql.connector import pooling
from flask_cors import CORS
from backend_utils import *
import mysql.connector
import datetime
from flask import Flask, request, jsonify, send_file
import os
import json
import subprocess
import tempfile

ROOT_PATH = "C:\\Wacca\\Nana+\\WindowsNoEditor"   # only used with WaccaCircle (tool by yosh)
REPO_SCRIPT = "repo.py"       # only used with WaccaCircle (tool by yosh)

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    host="127.0.0.1",
    database="aime",
    user="aime",
    password="ro",
    connection_timeout=9600,
    autocommit=True
)


app = Flask(__name__)
CORS(app)  # allow all origins (localhost:3000 included)

"""
conn = mysql.connector.connect(
    host="192.168.1.22",
    database="aime",
    user="aime",
    password="ro",
    connection_timeout=9600
)"""

global_data = {}

@app.route("/wacca/user/<int:cardID>/<int:stuff>", methods=["GET"])
def get_user(cardID, stuff):
    data = global_data.get(cardID)
    if data is None:
        try:
            data = get_info(cardID, pool)
            global_data[cardID] = data
            return jsonify(data)
        except mysql.connector.Error as err:
            print(f"\nERROR - {err}")
    return jsonify(data)

@app.route("/card/<string:cardID>", methods=["GET"])
def card_lookup(cardID):
    data = get_card_info(cardID, pool)
    if not data or "user_name" not in data:
        # frontend expects "failedapi" on missing user_name
        return jsonify({}), 404
    return jsonify(data)


@app.route("/wacca/user/leaderboards/<int:stuff>", methods=["GET"])
def leaderboard(stuff):
    data = global_data.get("leaderboard")
    if data is None:
        data = get_leaderboard(pool)
        global_data["leaderboard"] = data
    return jsonify(data)

@app.route("/wacca/music/<int:songid>/highscores/<int:diff>", methods=["GET"])
def score(songid,diff):
    data = global_data.get(songid)
    if data is None:
        data = get_highscores(songid, diff, pool)
        global_data["score"] = data
    return jsonify(data)

@app.route("/wacca/music/<int:songid>/histogram", methods=["GET"])
def histogram(songid):
    data = global_data.get(f"{songid}h")
    if data is None:
        data = get_histogram(songid, pool)
        global_data[f"{songid}h"] = data
    return jsonify(data)

@app.route("/wacca/user/<string:cardID>/music/<int:songid>", methods=["GET"])
def music(cardID, songid):
    data = global_data.get(f"{cardID}{songid}")
    if data is None:
        data = get_music_playlog(cardID, songid, pool)
        global_data[f"{cardID}{songid}"] = data
    return jsonify(data)

@app.route("/wacca/user/<string:cardID>/favorites/<int:songid>/toggle", methods=["POST"])
def favorite(cardID, songid):
    data = global_data.get(songid)
    if data is None:
        data = change_fav(cardID, songid, pool)
        global_data["leaderboard"] = data
    return jsonify(data)

@app.route("/wacca/user/<string:cardID>/gacha/<int:box>", methods=["POST"])
def gamba(cardID, box):
    return {"item":{"kind":11,"id":205008,"rarity":4},"points":88480}
"""
ITEM_TYPES = {
  :xp => 1,
  :wp => 2,
  :music_unlock => 3,
  :music_difficulty_unlock => 4,
  :title => 5,
  :icon => 6,
  :trophy => 7,
  :skill => 8,
  :ticket => 9,
  :console_color => 10,
  :note_sound => 11,
  :title_part => 12,
  :boost_badge => 13,
  :gate_point => 14,
  :navigator => 15,
  :plate => 16,
  :touch_effect => 17
}"""

@app.route("/upload_snapshot", methods=["POST"])
def upload_snapshot():
    """Reçoit repo.gz depuis le laptop et calcule les différences."""
    if "file" not in request.files:
        return "No file uploaded", 400
    
    snapshot_file = request.files["file"]
    temp_path = os.path.join(tempfile.gettempdir(), "repo.gz")
    snapshot_file.save(temp_path)

    # Lancer repo.py et capturer sa sortie JSON
    cmd = ["python", REPO_SCRIPT, "diff", ROOT_PATH, temp_path]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        return f"Error: {result.stderr}", 500

    try:
        changes = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        return f"Invalid JSON from repo.py: {e}", 500

    return jsonify(changes)


@app.route("/download_file", methods=["GET"])
def download_file():
    """Permet au laptop de télécharger un fichier modifié."""
    relpath = request.args.get("path")
    if not relpath:
        return "Missing path", 400

    abs_path = os.path.join(ROOT_PATH, relpath)
    if not os.path.exists(abs_path):
        return "File not found", 404

    return send_file(abs_path, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

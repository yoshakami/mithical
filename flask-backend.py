from mysql.connector import pooling
from backend_utils import *
import mysql.connector
from flask import Flask, request, jsonify, send_file
import os
import subprocess
import tempfile
import datetime
import sys
import json
import repo

SERVER_BRANCH = {} 
if os.path.exists('server_branch.json'):
    with open('server_branch.json', 'r') as file:
        SERVER_BRANCH = json.load(file)
else:
    print('server_branch.json not found! if you need the auto updater, look at server_branch.json.example')

REPO_SCRIPT = "repo.py"       # only used with WaccaCircle (tool by yosh)

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    host="127.0.0.1",
    database=repo.ENV_CONFIG.get('database'),
    user=repo.ENV_CONFIG.get('user'),
    password=repo.ENV_CONFIG.get('password'),
    connection_timeout=9600,
    autocommit=True
)


app = Flask(__name__)

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

@app.route("/upload_snapshot/<string:branch>", methods=["POST"])
def upload_snapshot(branch):
    """Reçoit repo.gz depuis le laptop et calcule les différences."""
    if "file" not in request.files:
        return "No file uploaded", 400
    
    snapshot_file = request.files["file"]
    temp_path = os.path.join(tempfile.gettempdir(), "repo.gz")
    snapshot_file.save(temp_path)
    selected_branch = SERVER_BRANCH.get(branch)
    if not selected_branch:
        return f"Error: Not authorized", 403
    cmd = [sys.executable, REPO_SCRIPT, "diff", selected_branch, temp_path]
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        return f"Error: {result.stderr}", 500

    try:
        changes = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        return f"Invalid JSON from repo.py: {e}", 500
    change2 = jsonify(changes)
    print(change2)
    return change2


@app.route("/download_file/<string:branch>", methods=["GET"])
def download_file(branch):
    """Permet au laptop de télécharger un fichier modifié."""
    selected_branch = SERVER_BRANCH.get(branch)
    if not selected_branch:
        return f"Error: Not authorized", 403
    relpath = request.args.get("path")
    if not relpath:
        return "Missing path", 400

    abs_path = os.path.join(selected_branch, relpath)
    if not os.path.exists(abs_path):
        return "File not found", 404

    return send_file(abs_path, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=repo.ENV_CONFIG.get('flask_port'))

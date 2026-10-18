from mysql.connector import pooling
from backend_utils import *
import mysql.connector
from flask import Flask, request, jsonify, send_file, render_template, send_from_directory
from flask_cors import CORS
import os
import subprocess
import tempfile
import sys
import json
import repo

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

def page_context():
    return {
        "api_url": request.url_root.rstrip("/"),
        "flask_port": repo.ENV_CONFIG.get("flask_port", 5000),
    }


# --- Web UI routes ---

@app.route("/")
def page_index():
    return render_template("index.html", **page_context())


@app.route("/cards")
def page_cards():
    return render_template("cards.html", **page_context())


@app.route("/wacca")
@app.route("/wacca/")
def page_wacca_index():
    return render_template("wacca/index.html", **page_context())


@app.route("/wacca/recent")
def page_wacca_recent():
    return render_template("wacca/recent.html", **page_context())


@app.route("/wacca/rating")
def page_wacca_rating():
    return render_template("wacca/rating.html", **page_context())


@app.route("/wacca/leaderboards")
def page_wacca_leaderboards():
    return render_template("wacca/leaderboards.html", **page_context())


@app.route("/wacca/gacha")
def page_wacca_gacha():
    return render_template("wacca/gacha.html", **page_context())


@app.route("/wacca/inventory")
def page_wacca_inventory():
    return render_template("wacca/inventory.html", **page_context())


@app.route("/wacca/settings")
def page_wacca_settings():
    return render_template("wacca/settings.html", **page_context())


@app.route("/wacca/songs")
def page_wacca_songs():
    return render_template("wacca/songs.html", **page_context())


@app.route("/wacca/songs/<int:song_id>")
def page_wacca_song_detail(song_id):
    return render_template("wacca/song_detail.html", song_id=song_id, **page_context())


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(BASE_DIR, "public"), "favicon.ico")


@app.route("/static/favicon.ico")
def static_favicon():
    return send_from_directory(os.path.join(BASE_DIR, "public"), "favicon.ico")


@app.route("/wacca/<path:filename>")
def wacca_public(filename):
    return send_from_directory(os.path.join(BASE_DIR, "public", "wacca"), filename)


@app.route("/assets/wacca/<path:filename>")
def wacca_data(filename):
    directory = os.path.join(BASE_DIR, "assets", "wacca")
    # Windows may store the songs file as WaccaSongs.js
    requested = os.path.join(directory, filename)
    if not os.path.exists(requested):
        alt = os.path.join(directory, filename[0].upper() + filename[1:] if filename else filename)
        if os.path.exists(alt):
            filename = os.path.basename(alt)
    return send_from_directory(directory, filename)


@app.route("/assets/font/<path:filename>")
def font_assets(filename):
    return send_from_directory(os.path.join(BASE_DIR, "assets", "font"), filename)


# --- API routes ---
@app.route("/wacca/user/<int:cardID>/<int:stuff>", methods=["GET"])
def get_user(cardID, stuff):
    try:
        data = get_info(cardID, pool)
        return jsonify(data)
    except mysql.connector.Error as err:
        print(f"\nERROR - {err}")
        return jsonify({"error": "Database error"}), 500

@app.route("/card/<string:cardID>", methods=["GET"])
def card_lookup(cardID):
    data = get_card_info(cardID, pool)
    if not data or "user_name" not in data:
        # frontend expects "failedapi" on missing user_name
        return jsonify({}), 404
    return jsonify(data)

@app.route("/wacca/user/leaderboards/<int:stuff>", methods=["GET"])
def leaderboard(stuff):
    data = get_leaderboard(pool)
    return jsonify(data)

@app.route("/wacca/music/<int:songid>/highscores/<int:diff>", methods=["GET"])
def score(songid, diff):
    data = get_highscores(songid, diff, pool)
    return jsonify(data)

@app.route("/wacca/music/<int:songid>/histogram", methods=["GET"])
def histogram(songid):
    data = get_histogram(songid, pool)
    return jsonify(data)

@app.route("/wacca/user/<string:cardID>/music/<int:songid>", methods=["GET"])
def music(cardID, songid):
    data = get_music_playlog(cardID, songid, pool)
    return jsonify(data)

@app.route("/wacca/user/<string:cardID>/favorites/<int:songid>/toggle", methods=["POST"])
def favorite(cardID, songid):
    data = change_fav(cardID, songid, pool)
    return jsonify(data)

@app.route("/wacca/user/<string:cardID>/gacha/<int:box>", methods=["POST"])
def gamba(cardID, box):
    return {"item":{"kind":11,"id":205008,"rarity":4},"points":88480}

@app.route("/upload_snapshot/<string:branch>/<int:md5>", methods=["POST"])
def upload_snapshot(branch, md5=0):
    """used by auto-updater. Get repo.gz then calculates differences."""
    if "file" not in request.files:
        return "No file uploaded", 400
    
    snapshot_file = request.files["file"]
    temp_path = os.path.join(tempfile.gettempdir(), "repo.gz")
    snapshot_file.save(temp_path)
    selected_branch = SERVER_BRANCH.get(branch)
    if not selected_branch:
        return "Error: Not authorized", 403
    cmd = [sys.executable, REPO_SCRIPT, "diff", selected_branch, temp_path, str(md5)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        return f"Error: {result.stderr}", 500

    try:
        changes = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        return f"Invalid JSON from repo.py: {e}", 500

    return jsonify(changes)

@app.route("/download_file/<string:branch>")
def download_file(branch):
    selected_branch = SERVER_BRANCH.get(branch)
    if not selected_branch:
        return "Error: Not authorized", 403

    relpath = request.args.get("path")
    if not relpath:
        return "Missing path", 400

    abs_path = os.path.join(selected_branch, relpath)
    if not os.path.exists(abs_path):
        return "File not found", 404

    return send_file(
        abs_path,
        as_attachment=True,
        download_name=os.path.basename(abs_path),
        mimetype="application/octet-stream",
        conditional=True,   # allows resume / range requests
        max_age=0,
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=repo.ENV_CONFIG.get('flask_port'))
    
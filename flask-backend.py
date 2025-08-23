from mysql.connector import pooling
from flask import Flask, jsonify
from flask_cors import CORS
from backend_utils import *
import mysql.connector
import datetime

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    host="192.168.1.22",
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

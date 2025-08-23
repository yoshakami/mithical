import datetime

tables = [
    "wacca_bingo",
    "wacca_favorite_song",
    "wacca_friend",
    "wacca_gate",
    "wacca_item",
    "wacca_option",
    "wacca_profile",
    "wacca_score_best",
    "wacca_score_playlog",
    "wacca_score_stageup",
    "wacca_song_unlock",
    "wacca_static_music",
    "wacca_ticket",
    "wacca_trophy",
]

def format_date(dt):
    if isinstance(dt, datetime.datetime):
        return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "+00:00"
    return dt


def get_info(cardID, pool):
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM aime_card WHERE access_code = %s;", (cardID,))
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        userid = row[1]
    favourites = []
    items = []
    music = []
    playlog = []
    options = {}
    iddif_score = {}
    for table in tables:
        conn = pool.get_connection()
        with conn.cursor() as cur:
                cur.execute(f"SELECT * FROM {table};")
                rows = cur.fetchall()
        conn.close()
        for row in rows:   # now iterate over all rows
            # yes I know this is horrible but row[number] is actually column number of that row
            if table == "wacca_favorite_song":
                if row[1] == userid:
                    favourites.append(row[2])
            elif table == "wacca_profile":
                if row[1] == userid:
                    rank = row[9]
                    dan_rank = row[8]
                    rating = row[13]
                    music_id = row[-7]
                    music_difficulty = row[-6]
                    last_song_sort = row[-5]
                    last_folder = row[-4]
                    last_folder_sort = row[-3]
                    last_browsed_song_list = format_date(row[-2])  # date
                    user_name = row[3]
                    exp = row[4]
                    points = row[5]
            elif table == "wacca_item":
                if row[1] == userid:
                    new_item = {
                        "item_kind": row[3],
                        "item_id": row[2],
                        "unlock_date": format_date(row[4])  # date
                    }
                    items.append(new_item)
            elif table == "wacca_option":
                if row[1] == userid:
                    options[str(row[2])] = row[3]
            elif table == "wacca_score_best":
                if row[1] == userid:
                    new_table = {
                        "music_id": row[2],
                        "music_difficulty": row[3],
                        "score": row[4],
                        "combo": row[23],
                        "miss_count": row[24],
                        "skill_points": 0,
                        "play_count": row[5],
                        "clear_count": row[6],
                        "missless_count": row[7],
                        "full_combo_count": row[8],
                        "all_marvelous_count": row[9],
                        "grade_d_count": row[10],
                        "grade_c_count": row[11],
                        "grade_b_count": row[12],
                        "grade_a_count": row[13],
                        "grade_aa_count": row[14],
                        "grade_aaa_count": row[15],
                        "grade_s_count": row[16],
                        "grade_s_plus_count": row[20],
                        "grade_ss_count": row[17],
                        "grade_ss_plus_count": row[21],
                        "grade_sss_count": row[18],
                        "grade_sss_plus_count": row[22],
                        "grade_master_count": row[19],
                        "rating": row[25],
                    }
                    iddif_score[f'{row[2]}{row[3]}'] = row[4]
                    music.append(new_table)
        else:
            print("  (empty)")
    
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM wacca_score_playlog ORDER BY date_scored DESC LIMIT 200;")
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        if row[1] == userid:
            new_play = {
                "playlog_api_id": "",
                "info": {
                    "music_id": row[2],
                    "music_difficulty": row[3],
                    "score": row[4],
                    "grade": row[6],
                    "judge": {
                        "marvelous": row[8],
                        "great": row[9],
                        "good": row[10],
                        "miss": row[11],
                    },
                    "clear_status": {
                        "is_clear": row[5] >= 1,
                        "is_missless": row[5] >= 2,
                        "is_full_combo": row[5] >= 3,
                        "is_all_marvelous": row[5] >= 4,
                        "is_give_up": False
                    },
                    "is_new_record": iddif_score.get(f'{row[2]}{row[3]}') == row[4],
                    "combo": row[7],
                    "skill_points": 0,
                    "fast": row[12],
                    "late": row[13],
                    "user_play_mode": 0,
                    "track": 2,
                    "user_play_date": format_date(row[15])  # date
                }
            }
            playlog.append(new_play)
    stuff = {
            "title_part_ids": [
                0,
                0,
                0
            ],
            "tutorial_state": {
                "1": True,
                "2": True,
                "3": True,
                "4": True,
                "5": True
            },
            "rank": rank,
            "dan_rank": dan_rank,
            "rating": rating,
            "last_app_version": "4.01.76.26938",
            "last_song": {
                "music_id": music_id,
                "music_difficulty": music_difficulty
            },
            "last_song_sort": last_song_sort,
            "last_folder": last_folder,
            "last_folder_sort": last_folder_sort,
            "last_browsed_song_list": last_browsed_song_list
        }
    json_data = {
        "favorite_music_entries": favourites,
        "version_data": {
        "300": stuff,
        "400": stuff
    },
        "user_name": user_name,
        "exp": exp,
        "points": points,
        "music": music,
        "options": sorted(options),
        "playlog": playlog,
        "items": items
    }

    return json_data   # rename "json" -> "json_data" to avoid clashing with module


def get_card_info(cardID: str, pool):
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM aime_card WHERE access_code = %s;", (cardID,))
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        userid = row[1]
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM wacca_profile WHERE user = %s LIMIT 100;", (userid,))
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        user_name = row[3]
    return {
        "user_name": user_name,   # frontend expects at least this
        "luid": userid
    }


def get_leaderboard(pool):
    j = {}
    user_icon = {}
    # get all user icon id
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM wacca_option WHERE opt_id = 1003;")
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        user_icon[row[1]] = row[3]
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM wacca_profile ORDER BY rating DESC LIMIT 100;")
        rows = cur.fetchall()
    conn.close()
    i = 0
    for row in rows:   # now iterate over all rows
        j[i] = {
		"api_id": "",
		"user_name": row[3],
		"user_icon_id": user_icon.get(row[1]) or 102001,
		"version": 400,
		"rating": row[13]
	    }
        i += 1
    return j

def get_highscores(songid, diff, pool):
    scores = []
    user_icon = {}
    user_name = {}
    # get all user icon id
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM wacca_option WHERE opt_id = 1003;")
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        user_icon[row[1]] = row[3]
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute(f"SELECT * FROM wacca_profile ORDER BY rating DESC;")
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        user_name[row[1]] = row[3]
        
    sql = """
    SELECT p.*
    FROM wacca_score_playlog p
    JOIN (
        SELECT user, MAX(score) AS best_score
        FROM wacca_score_playlog
        WHERE song_id = %s AND chart_id = %s
        GROUP BY user
    ) m ON p.user = m.user AND p.score = m.best_score
    WHERE p.song_id = %s AND chart_id = %s
    ORDER BY p.score DESC
    LIMIT 100;
    """
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute(sql, (songid, diff, songid, diff))
        rows = cur.fetchall()
    conn.close()
    users = {}
    for row in rows:   # now iterate over all rows
        if users.get(row[1]) != None:
            continue
        scores.append({
        "api_id": "",
        "user_name": user_name.get(row[1]),
        "user_icon_id": user_icon.get(row[1]),
        "score": row[4],
        "grade": row[6],
        "judge": {
            "marvelous": row[8],
            "great": row[9],
            "good": row[10],
            "miss": row[11]
        },
        "clear_status": {
            "is_clear": row[5] >= 1,
            "is_missless": row[5] >= 2,
            "is_full_combo": row[5] >= 3,
            "is_all_marvelous": row[5] >= 4,
            "is_give_up": False
        },
        "combo": row[7],
        "fast": row[12],
        "late": row[13],
        "user_play_date": format_date(row[15])
        })
    return scores
    """for row in rows:   # now iterate over all rows
        count = score_count.get(row[0])
        if count is None:
            score_count[row[0]] = 1
        else:
            score_count[row[0]] = count + 1
    [
            {
                "score": 343429,
                "count": "1"
            },
            {
                "score": 393714,
                "count": "1"
            },
            {
                "score": 407429,
                "count": "1"
            },
            """
def get_histogram(songid, pool):
    normal = []
    hard = []
    expert = []
    inferno = []

    i = 0
    for x in (normal, hard, expert, inferno):
        i += 1
        # query all scores for chart i
        conn = pool.get_connection()
        with conn.cursor() as cur:
            cur.execute(
                    "SELECT score FROM wacca_score_playlog WHERE song_id = %s AND chart_id = %s ORDER BY score;",
                    (songid,i)
                )
            rows = cur.fetchall()
        conn.close()
        score_count = {}
        for row in rows:
            score = row[0]
            score_count[score] = score_count.get(score, 0) + 1

        # turn dict into sorted list of dicts
        for score in sorted(score_count.keys()):
            x.append({
                "score": score,
                "count": score_count[score]
            })
    if inferno == []:
        return [{"score_entries": normal, "music_difficulty": 1},
            {"score_entries": hard, "music_difficulty": 2},
            {"score_entries": expert, "music_difficulty": 3}]
    return [{"score_entries": normal, "music_difficulty": 1},
            {"score_entries": hard, "music_difficulty": 2},
            {"score_entries": expert, "music_difficulty": 3},
            {"score_entries": inferno, "music_difficulty": 4}]

def get_music_playlog(cardID, songid, pool):
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM aime_card WHERE access_code = %s;", (cardID,))
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        userid = row[1]
    iddif_score = {}
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT score,chart_id FROM wacca_score_best WHERE song_id = %s AND user = %s;", (songid,userid))
        rows = cur.fetchall()
    conn.close()
    for row in rows:   # now iterate over all rows
        iddif_score[f'{songid}{row[1]}'] = row[0]
    conn = pool.get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM wacca_score_playlog WHERE song_id = %s AND user = %s ORDER BY date_scored DESC LIMIT 200;", (songid,userid))
        rows = cur.fetchall()
    conn.close()
    playlog = []
    for row in rows:   # now iterate over all rows
        new_play = {
                "playlog_api_id": "",
                "info": {
                    "music_id": row[2],
                    "music_difficulty": row[3],
                    "score": row[4],
                    "grade": row[6],
                    "judge": {
                        "marvelous": row[8],
                        "great": row[9],
                        "good": row[10],
                        "miss": row[11],
                    },
                    "clear_status": {
                        "is_clear": row[5] >= 1,
                        "is_missless": row[5] >= 2,
                        "is_full_combo": row[5] >= 3,
                        "is_all_marvelous": row[5] >= 4,
                        "is_give_up": False
                    },
                    "is_new_record": iddif_score.get(f'{row[2]}{row[3]}') == row[4],
                    "combo": row[7],
                    "skill_points": 0,
                    "fast": row[12],
                    "late": row[13],
                    "user_play_mode": 0,
                    "track": 2,
                    "user_play_date": format_date(row[15])  # date
                }
            }
        playlog.append(new_play)
    return playlog

def change_fav(cardID, songid, pool):
    return

def roll_gamba(cardID, box, pool):
    return
    
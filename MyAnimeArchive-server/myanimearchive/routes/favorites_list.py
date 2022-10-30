from flask import Blueprint, jsonify, request
from decouple import config
import json
import mysql.connector

route_favorites_list = Blueprint('route_favorites_list', __name__)

@route_favorites_list.route('/add_to_favorite', methods=['POST'], strict_slashes=False)
def add_to_favorite():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except Exception as e:
        print(e, flush=True)
        return jsonify({'Error': 'No Bearer'}), 401

    mydb = mysql.connector.connect(
        host=config("HOST_NAME"),
        user=config("SQL_USER"),
        password=config("SQL_PASSWORD"),
        database=config("SQL_DATABASE")
    )

    mycursor = mydb.cursor(buffered=True)

    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("username") is None or req.get("anime") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    sql = "SELECT * FROM sessions WHERE session_id = %s"
    session_select_sql = (SESSION_ID,)
    mycursor.execute(sql, session_select_sql)
    try:
        query_result = mycursor.fetchall()[0]
    except:
        return "Unauthorized access"

    if query_result[0] != req.get("username"):
        return "Unauthorized access"

    sql = "SELECT * FROM anime_database WHERE anime_name ='" + req.get("anime") + "'"
    mycursor.execute(sql)
    try:
        anime_result = mycursor.fetchall()[0]
    except:
        return "Not in database"

    sql = "SELECT * FROM users WHERE username ='" + req.get("username") + "'"
    mycursor.execute(sql)
    users_anime_list = mycursor.fetchall()[0][6]
    users_anime_list = json.loads(users_anime_list)
    users_anime_list[req.get("anime")] = {"thumbnail": anime_result[6]}

    sql = "UPDATE users SET favorites_list = '" + json.dumps(users_anime_list) + "' WHERE username = '" + req.get("username") + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()

    return jsonify({'result': 'Favorite Added'})
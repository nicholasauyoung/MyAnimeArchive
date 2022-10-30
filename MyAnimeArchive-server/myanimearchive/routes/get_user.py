from flask import Blueprint, jsonify, request
from decouple import config
import json
import mysql.connector

route_user = Blueprint('route_user', __name__)

@route_user.route('/user', methods=['GET'], strict_slashes=False)
def get_user():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except Exception as e:
        print(e, flush=True)
        return jsonify({'Error': 'No Bearer'}), 401
    print(SESSION_ID, flush=True)
    mydb = mysql.connector.connect(
        host=config("HOST_NAME"),
        user=config("SQL_USER"),
        password=config("SQL_PASSWORD"),
        database=config("SQL_DATABASE")
    )
    mycursor = mydb.cursor()
    sql = "SELECT * FROM sessions WHERE session_id = %s"
    session_select_sql = (SESSION_ID,)
    mycursor.execute(sql, session_select_sql)
    try:
        query_result = mycursor.fetchall()
        print(query_result, flush=True)
        query_result = query_result[0]
    except Exception as e:
        print(e,flush=True)
        return jsonify({'Error': "Unauthorized access"})

    return jsonify({'user': query_result[0]})

@route_user.route('/list', methods=['POST'], strict_slashes=False)
def get_list():
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

    if req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    sql = "SELECT * FROM users WHERE username ='" + req.get("username") + "'"
    mycursor.execute(sql)
    mycursor.close()
    try:
        users_anime_list = mycursor.fetchall()[0][2]
    except:
        return jsonify({'anime_list': {}})
    users_anime_list = json.loads(users_anime_list)
    return jsonify({'anime_list': users_anime_list})


@route_user.route('/user_data', methods=['POST'], strict_slashes=False)
def get_user_data():
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

    if req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    sql = "SELECT * FROM users WHERE username ='" + req.get("username") + "'"
    mycursor.execute(sql)
    mycursor.close()
    try:
        user_details = mycursor.fetchall()[0]
    except:
        return jsonify({'result': {}})
    return jsonify({'result': {"bio": user_details[3], "recent": json.loads(user_details[4]), "favorites": json.loads(user_details[6]), "friends": json.loads(user_details[5])}})


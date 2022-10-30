from flask import Blueprint, jsonify, request
from decouple import config
import json
import mysql.connector

route_friends_list = Blueprint('route_friends_list', __name__)

@route_friends_list.route('/add_friend', methods=['POST'], strict_slashes=False)
def add_friend():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except Exception as e:
        print(e, flush=True)
        return jsonify({'Error': 'No Bearer'}), 401

    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    mydb = mysql.connector.connect(
        host=config("HOST_NAME"),
        user=config("SQL_USER"),
        password=config("SQL_PASSWORD"),
        database=config("SQL_DATABASE")
    )

    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM sessions WHERE session_id = %s"
    session_select_sql = (SESSION_ID,)
    mycursor.execute(sql, session_select_sql)
    try:
        query_result = mycursor.fetchall()[0]
    except:
        return "Unauthorized access"

    request_username = query_result[0]

    sql = "SELECT * FROM users WHERE username ='" + req.get("username") + "'"
    mycursor.execute(sql)
    users_friends_list = mycursor.fetchall()[0][5]
    users_friends_list = json.loads(users_friends_list)
    users_friends_list[request_username] = False

    sql = "UPDATE users SET friends_list = '" + json.dumps(users_friends_list) + "' WHERE username = '" + req.get("username") + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()

    return jsonify({'result': 'Friend request sent'})


@route_friends_list.route('/remove_friend', methods=['POST'], strict_slashes=False)
def remove_friend():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except Exception as e:
        print(e, flush=True)
        return jsonify({'Error': 'No Bearer'}), 401

    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    mydb = mysql.connector.connect(
        host=config("HOST_NAME"),
        user=config("SQL_USER"),
        password=config("SQL_PASSWORD"),
        database=config("SQL_DATABASE")
    )

    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM sessions WHERE session_id = %s"
    session_select_sql = (SESSION_ID,)
    mycursor.execute(sql, session_select_sql)
    try:
        query_result = mycursor.fetchall()[0]
    except:
        return "Unauthorized access"

    request_username = query_result[0]

    sql = "SELECT * FROM users WHERE username ='" + request_username + "'"
    mycursor.execute(sql)
    users_friends_list = mycursor.fetchall()[0][5]
    users_friends_list = json.loads(users_friends_list)

    try:
        del users_friends_list[req.get("username")]
    except:
        pass

    sql = "UPDATE users SET friends_list = '" + json.dumps(users_friends_list) + "' WHERE username = '" + request_username + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()

    return jsonify({'result': 'Deleted'})


@route_friends_list.route('/accept_friend', methods=['POST'], strict_slashes=False)
def accept_friend():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except Exception as e:
        print(e, flush=True)
        return jsonify({'Error': 'No Bearer'}), 401

    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    mydb = mysql.connector.connect(
        host=config("HOST_NAME"),
        user=config("SQL_USER"),
        password=config("SQL_PASSWORD"),
        database=config("SQL_DATABASE")
    )

    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM sessions WHERE session_id = %s"
    session_select_sql = (SESSION_ID,)
    mycursor.execute(sql, session_select_sql)
    try:
        query_result = mycursor.fetchall()[0]
    except:
        return "Unauthorized access"

    request_username = query_result[0]

    sql = "SELECT * FROM users WHERE username ='" + request_username + "'"
    mycursor.execute(sql)
    users_friends_list = mycursor.fetchall()[0][5]
    users_friends_list = json.loads(users_friends_list)
    if req.get("username") not in users_friends_list.keys():
        return "Unauthorized access"
    users_friends_list[req.get("username")] = True
    sql = "UPDATE users SET friends_list = '" + json.dumps(users_friends_list) + "' WHERE username = '" + request_username + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()

    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM users WHERE username ='" + req.get("username") + "'"
    mycursor.execute(sql)
    users_friends_list = mycursor.fetchall()[0][5]
    users_friends_list = json.loads(users_friends_list)
    users_friends_list[request_username] = True
    sql = "UPDATE users SET friends_list = '" + json.dumps(users_friends_list) + "' WHERE username = '" + req.get("username") + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()

    return jsonify({'result': 'Friend request accepted'})
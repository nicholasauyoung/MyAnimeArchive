from flask import Blueprint, jsonify, request
from decouple import config
import mysql.connector

route_bio = Blueprint('route_bio', __name__)


@route_bio.route('/update_bio', methods=['POST'], strict_slashes=False)
def update_bio():
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

    if req.get("username") is None or req.get("bio") is None:
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

    if query_result[0] != req.get("username"):
        return "Unauthorized access"

    sql = "UPDATE users SET bio = '" + req.get("bio") + "' WHERE username = '" + req.get("username") + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()

    return jsonify({"result": "Updated Bio"})
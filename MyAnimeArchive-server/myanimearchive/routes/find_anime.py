from flask import Blueprint, jsonify, request
from decouple import config
import mysql.connector

route_query = Blueprint('route_query', __name__)

@route_query.route('/find_anime', methods=['POST'], strict_slashes=False)
def find_anime():
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

    query = req.get("query")

    if query is None:
        return jsonify({"Error": "Missing parameters"}), 401

    sql = "SELECT * FROM anime_database WHERE anime_name LIKE '%" + query + "%' LIMIT 10"
    mycursor.execute(sql)
    animes_query = mycursor.fetchall()
    return jsonify({"result": animes_query})

@route_query.route('/find_anime_one', methods=['POST'], strict_slashes=False)
def find_anime_one():
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

    query = req.get("query")

    if query is None:
        return jsonify({"Error": "Missing parameters"}), 401
    sql = "SELECT * FROM anime_database WHERE anime_name ='" + query + "'"
    mycursor.execute(sql)
    mycursor.close()
    try:
        animes_query = mycursor.fetchall()
    except:
        return jsonify({'result': []})
    return jsonify({"result": animes_query})
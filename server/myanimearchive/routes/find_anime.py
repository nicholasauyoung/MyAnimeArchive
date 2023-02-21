from flask import Blueprint, jsonify, request
import re
from util.db import database

route_query = Blueprint('route_query', __name__)


@route_query.route('/find_anime', methods=['POST'], strict_slashes=False)
def find_anime():
    try:
        req = request.get_json()
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'invalid json payload'
        }), 401

    query = req.get("query")
    if query is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    pattern = re.compile(".*" + query + ".*", re.IGNORECASE)

    results = database["anime"].find({"anime_name": {"$regex": pattern}}, {"_id": False}).limit(10)

    return jsonify({"result": list(results)})


@route_query.route('/find_anime_one', methods=['POST'], strict_slashes=False)
def find_anime_one():
    try:
        req = request.get_json()
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'invalid json payload'
        }), 401

    query = req.get("query")
    if query is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    results = database["anime"].find_one({"anime_name": query}, {"_id": False})
    if not results:
        results = []

    return jsonify({"result": results})

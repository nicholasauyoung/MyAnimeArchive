from flask import Blueprint, jsonify, request
from util.db import database
from util.session_check import session_check

route_favorites_list = Blueprint('route_favorites_list', __name__)


@route_favorites_list.route('/add_to_favorite', methods=['POST'], strict_slashes=False)
def add_to_favorite():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'no bearer'
        }), 401

    try:
        req = request.get_json()
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'invalid json payload'
        }), 401

    if req.get("username") is None or req.get("anime") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    session = session_check(SESSION_ID)

    if not session.get("success") or not session.get("username"):
        return jsonify({
            "success": False,
            "message": "unauthorized authentication"
        })

    anime = database["anime"].find_one({"anime_name": req.get("anime")})

    if not anime:
        return jsonify({
            "success": False,
            "message": "invalid anime"
        })

    user = database["users"].find_one({"username": req.get("username")})
    favoritesList = user.get("favorites_list")
    favoritesList[req.get("anime")] = {
        "thumbnail": anime.get("thumbnail")
    }

    database["users"].update_one({"username": session.get("username")}, {"$set": {"favorites_list": favoritesList}})

    return jsonify({
        "success": True,
        'result': 'Favorite Added'
    })

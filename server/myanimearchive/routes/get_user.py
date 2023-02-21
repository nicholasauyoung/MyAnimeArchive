from flask import Blueprint, jsonify, request
from util.db import database
from util.session_check import session_check

route_user = Blueprint('route_user', __name__)


@route_user.route('/user', methods=['GET'], strict_slashes=False)
def get_user():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'no bearer'
        }), 401

    session = session_check(SESSION_ID)

    if session:
        return {
            "success": True,
            "user": session.get("username"),
            "session": session
        }

    return jsonify({
        "success": False,
        "message": "unauthorized authentication"
    })


@route_user.route('/list', methods=['POST'], strict_slashes=False)
def get_list():
    try:
        req = request.get_json()
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'invalid json payload'
        }), 401

    if req.get("username") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    user = database["users"].find_one({"username": req.get("username")})

    if not user:
        return jsonify({
            "success": False,
            "message": "invalid user"
        }), 401

    return jsonify({'anime_list': user.get("anime_list", [])})


@route_user.route('/user_data', methods=['POST'], strict_slashes=False)
def get_user_data():
    try:
        req = request.get_json()
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'invalid json payload'
        }), 401

    if req.get("username") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    user = database["users"].find_one({"username": req.get("username")})

    if not user:
        return jsonify({
            "success": False,
            "message": "invalid user"
        }), 401

    return jsonify({
        "success": True,
        "result": {"bio": user.get("bio", ""),
                   "recent": user.get("recent_updates"),
                   "favorites": user.get("favorites_list"),
                   "friends": user.get("friends_list")
                   }})



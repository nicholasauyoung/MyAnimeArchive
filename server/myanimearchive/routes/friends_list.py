from flask import Blueprint, jsonify, request
from util.db import database
from util.session_check import session_check

route_friends_list = Blueprint('route_friends_list', __name__)


@route_friends_list.route('/add_friend', methods=['POST'], strict_slashes=False)
def add_friend():
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

    if req.get("username") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    session = session_check(SESSION_ID)

    if not session.get("success") or not session.get("username") or session.get("username") == req.get("username"):
        return jsonify({
            "success": False,
            "message": "unauthorized authentication"
        })

    user = database["users"].find_one({"username": req.get("username")})
    friendsList = user.get("friends_list", {})
    friendsList[req.get("username")] = False

    database["users"].update_one({"username": session.get("username")}, {"$set": {"friends_list": friendsList}})

    return jsonify({
        "success": True,
        "result": "Friend request sent"
        })


@route_friends_list.route('/remove_friend', methods=['POST'], strict_slashes=False)
def remove_friend():
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

    if req.get("username") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    session = session_check(SESSION_ID)

    if not session.get("success") or not session.get("username") or session.get("username") == req.get("username"):
        return jsonify({
            "success": False,
            "message": "unauthorized authentication"
        })

    user = database["users"].find_one({"username": req.get("username")})
    friendsList = user.get("friends_list", {})

    try:
        del friendsList[req.get("username")]
    except (Exception,):
        pass

    database["users"].update_one({"username": session.get("username")}, {"$set": {"friends_list": friendsList}})

    return jsonify({
        "success": True,
        "result": "Deleted"
    })


@route_friends_list.route('/accept_friend', methods=['POST'], strict_slashes=False)
def accept_friend():
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

    if req.get("username") is None:
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

    user = database["users"].find_one({"username": session.get("username")})
    friendsList = user.get("friends_list", {})

    if req.get("username") in friendsList.keys():
        friendsList[req.get("username")] = True
        database["users"].update_one({"username": session.get("username")}, {"$set": {"friends_list": friendsList}})

        otherUser = database["users"].find_one({"username": req.get("username")})
        otherUserFriendsList = otherUser.get("friends_list", {})
        otherUserFriendsList[session.get("username")] = True

        database["users"].update_one({"username": req.get("username")},
                                     {"$set": {"friends_list": otherUserFriendsList}})

    return jsonify({
        "success": True,
        'result': 'Friend request accepted'
    })

from flask import Blueprint, jsonify, request
from util.db import database
from util.session_check import session_check

route_bio = Blueprint('route_bio', __name__)


@route_bio.route('/update_bio', methods=['POST'], strict_slashes=False)
def update_bio():
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

    if req.get("username") is None or req.get("bio") is None:
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

    database["users"].update_one({"username": session.get("username")}, {"$set": {"bio": req.get("bio")}})

    return jsonify({
        "success": True,
        "message": "updated bio"
    })

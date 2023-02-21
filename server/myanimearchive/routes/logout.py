from flask import Blueprint, jsonify, request
from util.db import database
from util.session_check import session_check

route_logout = Blueprint('route_logout', __name__)


@route_logout.route('/logout', methods=['POST'], strict_slashes=False)
def logout_user():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'no bearer'
        }), 401

    database["sessions"].delete_one({"session_id": SESSION_ID})

    return jsonify({
        "success": True,
        "result": "Logged out"
    })

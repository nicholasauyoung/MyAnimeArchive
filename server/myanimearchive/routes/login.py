from flask import Blueprint, jsonify, request
from celery import Celery
from decouple import config
import time
import hashlib
from util.db import database
import uuid

route_login = Blueprint('route_login', __name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
celery = Celery('celery', broker=BROKER, backend='rpc://')


@route_login.route('/login', methods=['POST'], strict_slashes=False)
def login_user():
    try:
        req = request.get_json()
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'no bearer'
        }), 401

    if req.get("password") is None or req.get("username") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    user = database["users"].find_one({"username": req.get("username")})

    password_hashed = hashlib.sha256(req.get("password").encode()).hexdigest()

    if password_hashed == user.get("password"):
        session_id = str(uuid.uuid4())
        database["sessions"].insert_one({"session_id": session_id, "username": req.get("username")})

    else:
        return jsonify({
            "success": False,
            "message": "authentication failed"
        }), 401

    return jsonify({"result": session_id, "success": True})

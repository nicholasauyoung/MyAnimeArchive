from flask import Blueprint, jsonify, request
from celery import Celery
from decouple import config
import hashlib
from util.db import database

route_register = Blueprint('register', __name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
celery = Celery('celery', broker=BROKER, backend='rpc://')


@route_register.route('/register_user', methods=['POST'], strict_slashes=False)
def register_user():
    try:
        req = request.get_json()
    except (Exception,):
        return jsonify({
            "success": False,
            'message': 'invalid json payload'
        }), 401

    if req.get("password") is None or req.get("confirm_password") is None or req.get("username") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    if req.get("password") != req.get("confirm_password"):
        return jsonify({
            "success": False,
            "message": "Passwords do not match"
        }), 401

    user = database["users"].find_one({"username": req.get("username")})
    if user:
        return jsonify({
            "success": False,
            "message": "user already registered"
        }), 401

    password_hashed = hashlib.sha256(req.get("password").encode()).hexdigest()

    database["users"].insert_one({
        "username": req.get("username"),
        "password": password_hashed,
        "anime_list": {},
        "bio": "",
        "friends_list": {},
        "favorites_list": {},
        "recent_update": []
    })

    return jsonify({
        "success": True
    })

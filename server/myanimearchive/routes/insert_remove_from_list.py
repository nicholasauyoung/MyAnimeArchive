from flask import Blueprint, jsonify, request
from celery import Celery
from decouple import config
import time

route_list = Blueprint('route_list', __name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
celery = Celery('celery', broker=BROKER, backend='rpc://')


@route_list.route('/insert', methods=['POST'], strict_slashes=False)
def insert_to_list():
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

    if req.get("username") is None or req.get("score") is None \
            or req.get("progress") is None or req.get("anime") is None:
        return jsonify({
            "success": False,
            "message": "missing parameters"
        }), 401

    if type(req.get("score")) is not int or type(req.get("progress")) is not int:
        return jsonify({
            "success": False,
            "message": "invalid parameter format"
        }), 401

    celery.send_task('tasks.insert_to_list', kwargs={'username': req.get("username"), 'session_id': SESSION_ID,
                                                     'anime': req.get("anime"), 'score': req.get("score"),
                                                     'progress': req.get("progress")})

    return jsonify({"success": True})


@route_list.route('/remove', methods=['POST'], strict_slashes=False)
def remove_from_list():
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

    celery.send_task('tasks.insert_to_list', kwargs={'username': req.get("username"), 'session_id': SESSION_ID,
                                                     'anime': req.get("anime")})

    return jsonify({"success": True})

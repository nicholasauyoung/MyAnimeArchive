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
    except Exception as e:
        print(e, flush=True)
        return jsonify({'Error': 'No Bearer'}), 401

    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("username") is None or req.get("score") is None \
            or req.get("progress") is None or req.get("anime") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    if type(req.get("score")) is not int or type(req.get("progress")) is not int:
        return jsonify({"Error": "Invalid parameter format"}), 401

    r = celery.send_task('tasks.insert_to_list', kwargs={'username': req.get("username"), 'session_id': SESSION_ID,
                                                         'anime': req.get("anime"), 'score': req.get("score"),
                                                         'progress': req.get("progress")})

    while not r.ready():
        time.sleep(1)

    return jsonify({"result": str(r.result)})


@route_list.route('/remove', methods=['POST'], strict_slashes=False)
def remove_from_list():
    try:
        SESSION_ID = request.headers.get('Authorization')
    except Exception as e:
        print(e, flush=True)
        return jsonify({'Error': 'No Bearer'}), 401

    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("username") is None or req.get("anime") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    r = celery.send_task('tasks.insert_to_list', kwargs={'username': req.get("username"), 'session_id': SESSION_ID,
                                                         'anime': req.get("anime")})

    while not r.ready():
        time.sleep(1)

    return jsonify({"result": str(r.result)})

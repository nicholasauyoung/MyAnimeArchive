from flask import Blueprint, jsonify, request
from celery import Celery
from decouple import config
import time

route_logout = Blueprint('route_logout', __name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
celery = Celery('celery', broker=BROKER, backend='rpc://')


@route_logout.route('/logout', methods=['POST'], strict_slashes=False)
def logout_user():
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

    if req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    r = celery.send_task('tasks.logout', kwargs={'username': req.get("username"), 'session_id': SESSION_ID})

    while not r.ready():
        time.sleep(1)

    return jsonify({"result": str(r.result)})
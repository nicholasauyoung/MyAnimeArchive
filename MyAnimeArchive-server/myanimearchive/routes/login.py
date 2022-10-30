from flask import Blueprint, jsonify, request
from celery import Celery
from decouple import config
import time

route_login = Blueprint('route_login', __name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
celery = Celery('celery', broker=BROKER, backend='rpc://')


@route_login.route('/login', methods=['POST'], strict_slashes=False)
def login_user():
    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("password") is None or req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    r = celery.send_task('tasks.login', kwargs={'username': req.get("username"),
                                                        'password': req.get("password")})

    while not r.ready():
        time.sleep(1)
    print(r.result, flush=True)
    return jsonify({"result": str(r.result)})
from flask import Blueprint, jsonify, request
from celery import Celery
from decouple import config
import time

route_register = Blueprint('register', __name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
celery = Celery('celery', broker=BROKER, backend='rpc://')


@route_register.route('/register_user', methods=['POST'], strict_slashes=False)
def register_user():
    try:
        req = request.get_json()
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Invalid JSON'}), 401

    if req.get("password") is None or req.get("confirm_password") is None or req.get("username") is None:
        return jsonify({"Error": "Missing parameters"}), 401

    r = celery.send_task('tasks.register_user', kwargs={'username': req.get("username"),
                                                        'password': req.get("password"),
                                                        'confirm_password': req.get("confirm_password")})

    while not r.ready():
        time.sleep(1)

    return jsonify({"result": r.result})

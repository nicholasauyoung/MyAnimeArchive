from flask import Flask
from flask_cors import CORS
from routes.register import route_register
from routes.login import route_login
from routes.logout import route_logout
from routes.insert_remove_from_list import route_list
from routes.get_user import route_user
from routes.find_anime import route_query
from routes.update_bio import route_bio
from routes.friends_list import route_friends_list
from routes.favorites_list import route_favorites_list

app = Flask(__name__)
CORS(app)

app.register_blueprint(route_register)
app.register_blueprint(route_login)
app.register_blueprint(route_logout)
app.register_blueprint(route_list)
app.register_blueprint(route_user)
app.register_blueprint(route_query)
app.register_blueprint(route_bio)
app.register_blueprint(route_friends_list)
app.register_blueprint(route_favorites_list)


@app.route('/', methods=['GET'], strict_slashes=False)
def main():
    return 'MyAnimeArchive'


if __name__ == '__main__':
    app.run(host='0.0.0.0')

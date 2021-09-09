import time
from flask import *
from flaskext.mysql import MySQL

from login import *

app = Flask(__name__)


@app.route('/login_player', methods=["POST"])
def user_login():
    return player_login(request.form['Username'], request.form['Password'])
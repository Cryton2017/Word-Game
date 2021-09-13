import time
from flask import *
from flaskext.mysql import MySQL

from login import *
from game import *

app = Flask(__name__)


@app.route('/login_player', methods=["POST"])
def user_login():
    return player_login(request.form['Username'], request.form['Password'])

@app.route('/start_game', methods=["POST"])
def game_start():
    return start(request.form['id'], request.form['Username'])

@app.route('/get_word_score', methods=["POST"])
def get_word_value():
    return getWordScore(request.form['game_id'], request.form['wordString'], request.form['word'])

@app.route('/restart_game', methods=["POST"])
def restart_game():
    return game_restart(request.form['game_id'])
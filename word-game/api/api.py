import time
from flask import *
from flaskext.mysql import MySQL

from login import *
from game import *

app = Flask(__name__)

#Log the user in:
@app.route('/login_player', methods=["POST"])
def user_login():
    return player_login(request.form['Username'], request.form['Password'])

#Start the game:
@app.route('/start_game', methods=["POST"])
def game_start():
    return start(request.form['id'], request.form['Username'])

#Get the score for a wordL
@app.route('/get_word_score', methods=["POST"])
def get_word_value():
    return getWordScore(request.form['wordString'], request.form['word'])

#Save the total score:
@app.route('/set_game_score', methods=["POST"])
def set_game_Score():
    return setGameScore(request.form['game_id'], request.form['score'])

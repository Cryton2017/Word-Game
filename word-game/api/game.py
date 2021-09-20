from flaskext.mysql import MySQL
from flask import *
import random

app = Flask(__name__)

#Configure the Database connection:
app.config['MYSQL_DATABASE_HOST'] = 'kaiodbd01.c9jstcsli73i.us-east-2.rds.amazonaws.com'
app.config['MYSQL_DATABASE_USER'] = 'wordgame'
app.config['MYSQL_DATABASE_PASSWORD'] = 'wordgameIntelliHR@1234'
app.config['MYSQL_DATABASE_DB'] = 'WordGame'

mysql = MySQL()
mysql.init_app(app)

#Start the game:
def start(id, Username):

    #Add game data to the database:
    try:

        #Execute the query:
        cur = mysql.get_db().cursor()
        cur.execute('INSERT INTO games(user_id, username) VALUES (%s, %s)', (id, Username))
        mysql.get_db().commit()
        return deal_hand(cur.lastrowid, id)

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem creating new game: ' + str(e)})

#Deal a new hand to the user:
def deal_hand(game_id, user_id):

    #Generate the player's hand:
    num_letters = random.randint(5,15)
    letter_id_list = random.choices(range(1, 26), k=num_letters)
    letter_list = []

    #Get the required Letters:
    try:
        for id in letter_id_list:
            cur = mysql.get_db().cursor()
            cur.execute("SELECT letter FROM letters WHERE id = %s", (id))
            for row in cur.fetchall():
                letter_list.append(row[0])
            cur.close()
        
        #Return the letters:
        return jsonify({'status' : 'OK', 'Letters' : letter_list, 'Count' : len(letter_list), 'game_id' : game_id})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem getting letters!: ' + str(e)})

#Get the subbmitted word's score:
def getWordScore(wordString, word):
    
    #Add the hand to the game:
    try:

        #Execute the query:
        cur = mysql.get_db().cursor()
        cur.execute("SELECT * FROM words WHERE word = %s", (wordString))
        count = cur.rowcount
        cur.close()

        #Test variable:
        count = 1

        #Calculate the score:
        if count > 0:
            return calculate_score(word)
        else:
            return jsonify({'status' : 'NO', 'Reason' : 'No Word Found'})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem checking word: ' + str(e)})

#Calculate the score:
def calculate_score(word):

    #Get the required Letters:
    try:

        #Execute the query:
        score = 0
        for letter in word:
            cur = mysql.get_db().cursor()
            cur.execute("SELECT value FROM letters WHERE letter = %s", (letter))
            for row in cur.fetchall():
                score = score + int(row[0])

        cur.close()

        #Send the word score to the client:
        return jsonify({'status' : 'OK', 'Score' : score})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem getting Score!: ' + str(e)})

def setGameScore(game_id, score):
    
    #Add the score to the game:
    try:

        print(score)
        print(game_id)

        #Execute the query:
        cur = mysql.get_db().cursor()
        cur.execute('UPDATE games SET totalPoints = %s WHERE id = %s', (score, game_id))
        mysql.get_db().commit()
        cur.close()

        #Return the response:
        return jsonify({'status' : 'OK'})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem updating score: ' + str(e)})


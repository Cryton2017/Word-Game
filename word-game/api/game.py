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
    letter_id__list = random.choices(range(1, 26), k=num_letters)
    letter_list = []

    #Get the required Letters:
    try:
        for id in letter_id__list:
            cur = mysql.get_db().cursor()
            cur.execute("SELECT letter FROM letters WHERE id = %s", (id))
            for row in cur.fetchall():
                print(row[0])
                letter_list.append(row[0])
            cur.close()

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem getting letters!: ' + str(e)})

    #Add the hand to the game:
    try:
        for letter in letter_list:
            cur = mysql.get_db().cursor()
            cur.execute('INSERT INTO handDelt(game_id, user_id, letter) VALUES (%s, %s, %s)', (game_id, user_id, letter))
            mysql.get_db().commit()
        return display_hand(game_id)

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem creating hand: ' + str(e)})
    
#Display the player's hand:
def display_hand(game_id):

    #Add the hand to the game:
    try:

        cur = mysql.get_db().cursor()
        cur.execute("SELECT * FROM handDelt WHERE game_id = %s", (game_id))
        count = cur.rowcount
        cur.close()

        #If the query returned more than one result:
        if count > 0:

            #Return the JSON object to the client:
            r = [dict((cur.description[i][0], value)
                    for i, value in enumerate(row)) for row in cur.fetchall()]
            return jsonify({'hand' : r, 'Total' : count , 'status' : 'OK', 'game_id' : game_id})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem displaying hand: ' + str(e)})

#Get the subbmitted word's score:
def getWordScore(game_id, wordString, word):
    
    #Add the hand to the game:
    try:

        print("Checking Word...")
        cur = mysql.get_db().cursor()
        cur.execute("SELECT * FROM words WHERE word = %s", (wordString))
        count = cur.rowcount
        cur.close()

        #Test variable:
        #count = 1

        #Calculate the score:
        if count > 0:
            return calculate_score(game_id, word)
        else:
            return jsonify({'status' : 'NO', 'Reason' : 'NoWordFound'})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem checking word: ' + str(e)})

#Calculate the score:
def calculate_score(game_id, word):

    oldScore = 0
    currentScore = 0
    totalScore = 0

    #Get the required Letters:
    try:

        print("Calculating Score...")
        for letter in word:
            cur = mysql.get_db().cursor()
            cur.execute("SELECT value FROM letters WHERE letter = %s", (letter))
            for row in cur.fetchall():
                currentScore = currentScore + int(row[0])

        cur.close()
        print(currentScore)

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem getting Score!: ' + str(e)})

    #Get the current score in the database:
    try:

        print("Getting the points already scored...")
        cur = mysql.get_db().cursor()
        cur.execute('SELECT totalPoints FROM games WHERE id=%s', (game_id))
        for row in cur.fetchall():
            if(row[0] is None):
                oldScore = 0
            else:
                oldScore = int(row[0])
            
        cur.close()

        totalScore = currentScore + oldScore
        print(totalScore)

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem updating score: ' + str(e)})

    #Add the points to the game:
    try:

        print("Adding the new total...")
        cur = mysql.get_db().cursor()
        cur.execute('UPDATE games SET totalPoints = %s WHERE id = %s', (totalScore, game_id))
        mysql.get_db().commit()

        print(currentScore)
        print(totalScore)

        return jsonify({'status' : 'OK', 'CurrentScore' : currentScore, 'TotalScore' : totalScore})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem updating score: ' + str(e)})

#Restart the game:
def game_restart(game_id):

    #Reset the points for the game:
    try:

        cur = mysql.get_db().cursor()
        cur.execute('UPDATE games SET totalPoints = 0 WHERE id = %s', (game_id))
        mysql.get_db().commit()

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem restarting the game: ' + str(e)})

    #Get the size of the hand:
    try:

        cur = mysql.get_db().cursor()
        cur.execute("SELECT * FROM handDelt WHERE game_id = %s", (game_id))
        count = cur.rowcount
        cur.close()
        return jsonify({'Total' : count , 'status' : 'OK'})

    #Throw an error:
    except Exception as e:
        return jsonify({'status' : 'NO', 'Reason' : 'Problem displaying hand: ' + str(e)})
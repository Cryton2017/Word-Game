from flaskext.mysql import MySQL
from flask import *

app = Flask(__name__)

#Configure the Database connection:
app.config['MYSQL_DATABASE_HOST'] = 'kaiodbd01.c9jstcsli73i.us-east-2.rds.amazonaws.com'
app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'hJUkRcTVo9mkRNHf9dSk'
app.config['MYSQL_DATABASE_DB'] = 'WordGame'

mysql = MySQL()
mysql.init_app(app)

#Log the Player in:
def player_login(Username, Password):

    #Construct the query and get results:
    cur = mysql.get_db().cursor()
    cur.execute("SELECT * FROM players WHERE username = %s AND password = %s", (Username, Password))
    count = cur.rowcount
    cur.close()

    #If the query returned more than one result:
    if count > 0:

        #Return the JSON object to the client:
        r = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
        return jsonify({'user' : r, 'status' : 'OK'})

    #If no result was returned:
    elif count == 0:

        #Return an error message to the client:
        return jsonify({'status' : 'NO', 'Reason' : 'IncorrectLogin'})
    else:
        return jsonify({'status' : 'NO', 'Reason' : 'UnknownError'})
        

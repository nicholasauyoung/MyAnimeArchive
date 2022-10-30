from celery import Celery
from celery.utils.log import get_task_logger
import mysql.connector
from decouple import config
import hashlib
import json
import uuid

try:
    mydb = mysql.connector.connect(
        host=config("HOST_NAME"),
        user=config("SQL_USER"),
        password=config("SQL_PASSWORD")
    )
except:
    mydb = mysql.connector.connect(
        host=config("HOST_NAME"),
        user="root",
        password=""
    )

mycursor = mydb.cursor(buffered=True)
try:
    mycursor.execute("CREATE DATABASE myanimearchive")
except:
    pass

mydb = mysql.connector.connect(
    host=config("HOST_NAME"),
    user=config("SQL_USER"),
    password=config("SQL_PASSWORD"),
    database=config("SQL_DATABASE")
)

logger = get_task_logger(__name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
app = Celery('tasks', broker=BROKER, backend='rpc://')


@app.task()
def register_user(username, password, confirm_password):
    mycursor = mydb.cursor(buffered=True)
    try:
        mycursor.execute("CREATE TABLE users (username VARCHAR(255), password VARCHAR(255), anime_list JSON, bio VARCHAR(2555), recentupdates JSON, friends_list JSON, favorites_list JSON)")
    except Exception as e:
        print(e)
        pass

    if password != confirm_password:
        return "Passwords do not match"

    password_hashed = hashlib.sha256(password.encode()).hexdigest()

    sql = "SELECT * FROM users WHERE username = %s"
    username_select_sql = (username,)
    mycursor.execute(sql, username_select_sql)
    query_result = mycursor.fetchall()
    if len(query_result) == 0:
        sql = "INSERT INTO users (username, password, anime_list, bio, recentupdates, friends_list, favorites_list) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        val = (username, password_hashed, json.dumps({}), "", json.dumps([]), json.dumps({}), json.dumps({}))
        mycursor.execute(sql, val)
        mydb.commit()
        mycursor.close()
        return "User registered"
    else:
        return "Already registered"


@app.task()
def login(username, password):
    mycursor = mydb.cursor(buffered=True)
    try:
        mycursor.execute("CREATE TABLE sessions (username VARCHAR(255), session_id VARCHAR(255))")
    except Exception as e:
        pass

    sql = "SELECT * FROM users WHERE username ='" + username + "'"
    mycursor.execute(sql)
    user_result = mycursor.fetchall()[0]

    password_hashed = hashlib.sha256(password.encode()).hexdigest()

    if password_hashed == user_result[1]:
        session_id = str(uuid.uuid4())
        sql = "INSERT INTO sessions (username, session_id) VALUES (%s, %s)"
        val = (username, session_id)
        mycursor.execute(sql, val)
        mydb.commit()
        mycursor.close()
        return session_id

    return "Invalid credentials"


@app.task()
def logout(username, session_id):
    mycursor = mydb.cursor(buffered=True)
    sql = "DELETE FROM sessions WHERE session_id = '" + session_id + "' AND username = '" + username + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()
    return "Logged out"


@app.task()
def insert_to_list(username, session_id, anime, score, progress):
    mycursor = mydb.cursor(buffered=True)
    try:
        mycursor.execute(
            "CREATE TABLE anime_database (anime_name VARCHAR(255), episodes INT(255), season VARCHAR(255), year INT(255), tags JSON, thumbnail VARCHAR(2555))")
    except Exception as e:
        pass

    sql = "SELECT * FROM sessions WHERE session_id = %s"
    session_select_sql = (session_id,)
    mycursor.execute(sql, session_select_sql)
    try:
        query_result = mycursor.fetchall()[0]
    except:
        return "Unauthorized access"

    if query_result[0] != username:
        return "Unauthorized access"

    sql = "SELECT * FROM anime_database WHERE anime_name ='" + anime + "'"
    mycursor.execute(sql)
    try:
        anime_result = mycursor.fetchall()[0]
    except:
        return "Not in database"

    if progress < 0 or progress > anime_result[1]:
        return "Progress exceeds number of episodes"

    sql = "SELECT * FROM users WHERE username ='" + username + "'"
    mycursor.execute(sql)
    users_anime_list = mycursor.fetchall()[0][2]
    users_anime_list = json.loads(users_anime_list)
    users_anime_list[anime] = {"Progress": progress, "Score": score, "Number_Episodes": anime_result[1],
                               "Season": anime_result[2], "Year": anime_result[3], "thumbnail": anime_result[6]}

    sql = "UPDATE users SET anime_list = '" + json.dumps(users_anime_list) + "' WHERE username = '" + username + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()

    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM users WHERE username ='" + username + "'"
    mycursor.execute(sql)
    user_recent_updates = mycursor.fetchall()[0][4]
    user_recent_updates = json.loads(user_recent_updates)
    if user_recent_updates == None:
        user_recent_updates = []
    newObj = {"Progress": progress, "Score": score, "Number_Episodes": anime_result[1], "Season": anime_result[2], "Year": anime_result[3], "thumbnail": anime_result[6], "Anime_Name": anime}
    user_recent_updates.append(newObj)
    sql = "UPDATE users SET recentupdates = '" + json.dumps(user_recent_updates) + "' WHERE username = '" + username + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()
    return "Inserted"

@app.task()
def remove_from_list(username, session_id, anime):
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM sessions WHERE session_id = %s"
    session_select_sql = (session_id,)
    mycursor.execute(sql, session_select_sql)
    try:
        query_result = mycursor.fetchall()[0]
    except:
        return "Unauthorized access"

    if query_result[0] != username:
        return "Unauthorized access"
    sql = "SELECT * FROM users WHERE username ='" + username + "'"
    mycursor.execute(sql)
    users_anime_list = mycursor.fetchall()[0][2]
    users_anime_list = json.loads(users_anime_list)
    try:
        del users_anime_list[anime]
    except:
        pass

    sql = "UPDATE users SET anime_list = '" + json.dumps(users_anime_list) + "' WHERE username = '" + username + "'"
    mycursor.execute(sql)
    mydb.commit()
    mycursor.close()
    return "Deleted"

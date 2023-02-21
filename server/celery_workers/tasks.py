from celery import Celery
from celery.utils.log import get_task_logger
import pymongo
from decouple import config

try:
    client = pymongo.MongoClient(config('MONGODB'))
    database = client['MyAnimeArchive']
except Exception as err:
    print(err)
    client = None

logger = get_task_logger(__name__)

BROKER = 'amqp://' + config("CELERY_USER") + ':' + config("CELERY_PASSWORD") + '@rabbit:5672'
app = Celery('tasks', broker=BROKER, backend='rpc://')


def session_check(session_id):
    session = database["sessions"].find_one({"session_id": session_id})
    if session:
        return {
            "username": session.get("username"),
            "success": True
        }
    return {
        "success": False
    }


@app.task()
def insert_to_list(username, session_id, anime, score, progress):
    session = session_check(session_id)

    if not session.get("success") or not session.get("username"):
        return "Unauthorized access"

    animeData = database["anime"].find_one({"anime_name": anime}, {"_id": False})
    if not animeData:
        return "Not in database"
    if progress < 0 or progress > animeData.get("episodes"):
        return "Progress exceeds number of episodes"

    user = database["users"].find_one({"username": username})
    animeList = user.get("anime_list", {})
    animeList[anime] = {"Progress": progress, "Score": score, "Number_Episodes": animeData.get("episodes"),
                        "Season": animeData.get("season"), "Year": animeData.get("year"),
                        "thumbnail": animeData.get("thumbnail")}
    recentUpdates = user.get("recent_updates", [])
    recentUpdates.append(
        {"Progress": progress, "Score": score, "Number_Episodes": animeData.get("episodes"),
         "Season": animeData.get("season"),
         "Year": animeData.get("year"), "thumbnail": animeData.get("thumbnail"),
         "Anime_Name": animeData.get("anime_name")}
    )
    database["users"].update_one({"username": session.get("username")}, {"$set": {"anime_list": animeList,
                                                                                  "recent_updates": recentUpdates}})
    return "Inserted"


@app.task()
def remove_from_list(username, session_id, anime):
    session = session_check(session_id)
    if not session.get("success") or not session.get("username"):
        return "Unauthorized access"

    user = database["users"].find_one({"username": username})
    animeList = user.get("anime_list", {})
    try:
        del animeList[anime]
    except (Exception,):
        pass

    database["users"].update_one({"username": session.get("username")}, {"$set": {"anime_list": animeList}})

    return "Deleted"

from util.db import database


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

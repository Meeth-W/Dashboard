from pymongo import MongoClient
from typing import List, Dict

class Database:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["dashboard"]

class Users(Database):
    def __init__(self):
        super().__init__()
        self.collection = self.db["users"]
        self.collection.create_index("username", unique=True)

    def add_user(self, username: str, password: str, data: dict) -> dict:
        if self.collection.find_one({"username": username}):
            return {"status": False, "message": "User already exists"}
        self.collection.insert_one({"username": username, "password": password, "data": data})
        return {"status": True, "message": "User added successfully"}

    def remove_user(self, username: str, password: str) -> dict:
        result = self.collection.delete_one({"username": username, "password": password})
        if result.deleted_count == 0:
            return {"status": False, "message": "User does not exist or incorrect password"}
        return {"status": True, "message": "User removed successfully"}

    def verify(self, username: str, password: str) -> dict:
        if self.collection.find_one({"username": username, "password": password}):
            return {"status": True, "message": "User verified successfully"}
        return {"status": False, "message": "User does not exist or incorrect password"}

    def get_user(self, username: str, password: str) -> dict:
        user = self.collection.find_one({"username": username, "password": password}, {"_id": 0, "data": 1})
        if not user:
            return {"status": False, "message": "User does not exist or incorrect password"}
        return {"status": True, "message": "User data retrieved successfully", "data": user["data"]}


class Conversations(Database):
    def __init__(self):
        super().__init__()
        self.collection = self.db["conversations"]

    def get_history(self) -> List[Dict[str, str]]:
        return list(self.collection.find({}, {"_id": 0}))

    def add_dialogue(self, user: str, text: str) -> Dict[str, str]:
        self.collection.insert_one({"user": user, "text": text})
        return {"status": "success", "message": "Dialogue added successfully"}

    def clear_history(self) -> Dict[str, str]:
        self.collection.delete_many({})
        return {"status": "success", "message": "Conversation history cleared"}


class Notes(Database):
    def __init__(self):
        super().__init__()
        self.collection = self.db["notes"]

    def get_notes(self) -> Dict[str, List[str]]:
        notes = list(self.collection.find({}, {"_id": 0}))
        return {"status": True, "message": "User notes retrieved successfully", "notes": notes}

    def add_note(self, name: str, note: str) -> Dict[str, str]:
        self.collection.insert_one({"name": name, "note": note})
        return {"status": True, "message": "Note added successfully"}

    def remove_note(self, name: str) -> Dict[str, str]:
        result = self.collection.delete_one({"name": name})
        if result.deleted_count == 0:
            return {"status": False, "message": "Note does not exist"}
        return {"status": True, "message": "Note removed successfully"}


class ResearchHistory(Database):
    def __init__(self):
        super().__init__()
        self.collection = self.db["scraping"]

    def add_site(self, url: str, content: str, summary: str = None) -> dict:
        if self.collection.find_one({"url": url}):
            return {"status": False, "message": "Website already exists"}
        self.collection.insert_one({"url": url, "content": content, "summary": summary})
        return {"status": True, "message": "Website data added successfully"}

    def get_site_data(self, url: str) -> dict:
        site = self.collection.find_one({"url": url}, {"_id": 0})
        if site:
            return {"status": True, "data": site}
        return {"status": False, "message": "Website not found"}

    def get_stored_sites(self) -> dict:
        sites = self.collection.find({}, {"_id": 0, "url": 1})
        return {"status": True, "sites": [site["url"] for site in sites]}

    def delete_site(self, url: str) -> dict:
        result = self.collection.delete_one({"url": url})
        if result.deleted_count > 0:
            return {"status": True, "message": "Website data deleted successfully"}
        return {"status": False, "message": "Website not found"}
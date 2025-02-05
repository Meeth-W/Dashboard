import os
import json

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

    
# Not migrating this shit yet cuz fuck this shit 
class ResearchHistory:
    """Handles storing and retrieving research queries and results."""
    
    def __init__(self) -> None:
        self.path = os.path.join(os.path.dirname(__file__), 'data')
        self.file_path = os.path.join(self.path, 'research_history.json')
        
        if not os.path.exists(self.path):
            os.makedirs(self.path)
        
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump({}, f, indent=4)
    
    def add_research_entry(self, username: str, query: str, results: List[str]) -> dict:
        """Adds a research query and its results to the history."""
        with open(self.file_path, 'r') as f:
            history: dict = json.load(f)
        
        if username not in history:
            history[username] = []
        
        history[username].append({"query": query, "results": results})
        
        with open(self.file_path, 'w') as f:
            json.dump(history, f, indent=4)
        
        return {"status": True, "message": "Research entry added successfully"}
    
    def get_research_history(self, username: str) -> dict:
        """Retrieves the research history for a given user."""
        with open(self.file_path, 'r') as f:
            history: dict = json.load(f)
        
        if username not in history:
            return {"status": False, "message": "No research history found for this user."}
        
        return {"status": True, "message": "Research history retrieved successfully", "history": history[username]}
    
    def clear_research_history(self, username: str) -> dict:
        """Clears the research history for a given user."""
        with open(self.file_path, 'r') as f:
            history: dict = json.load(f)
        
        if username not in history:
            return {"status": False, "message": "No research history found to clear."}
        
        history[username] = []
        
        with open(self.file_path, 'w') as f:
            json.dump(history, f, indent=4)
        
        return {"status": True, "message": "Research history cleared successfully"}
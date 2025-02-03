import os
import json
from typing import List, Dict

def get_session() -> int:
    return 0

class Users:
    """Handles the `data/users.json` file."""

    def __init__(self) -> None:
        self.path = os.path.join(os.path.dirname(__file__), 'data')
        self.file_path = os.path.join(self.path, 'users.json')
        
        if not os.path.exists(self.path): os.makedirs(self.path)
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f: json.dump({}, f)
        
    def add_user(self, username: str, password: str, data: dict) -> dict:
        """Adds a user into the `data/users.json` file along with additional data."""
        with open(self.file_path, 'r') as f: users: dict = json.load(f)
        if username in users: return {"status": False, "message": "User already exists"}

        users[username] = {"password": password, "data": data}
        with open(self.file_path, 'w') as f: json.dump(users, f, indent=4)
        
        return {"status": True, "message": "User added successfully"}

    def remove_user(self, username: str, password: str) -> dict:
        """Removes a user from the `data/users.json` file."""
        with open(self.file_path, 'r') as f: users: dict = json.load(f)
        
        if username not in users: return {"status": False, "message": "User does not exist"}
        if users[username]["password"] != password: return {"status": False, "message": "Incorrect password"}
        
        del users[username]
        with open(self.file_path, 'w') as f: json.dump(users, f, indent=4)
        
        return {"status": True, "message": "User removed successfully"}

    def verify(self, username: str, password: str) -> dict:
        """Checks if a user exists in the `data/users.json` file and verifies the credentials."""
        with open(self.file_path, 'r') as f: users: dict = json.load(f)
        
        if username not in users: return {"status": False, "message": "User does not exist"}
        if users[username]["password"] != password: return {"status": False, "message": "Incorrect password"}
        
        return {"status": True, "message": "User verified successfully"}
    
    def get_user(self, username: str, password: str) -> dict:
        """Verifies the user's credentials and retrieves their data."""
        with open(self.file_path, 'r') as f: users: dict = json.load(f)
        
        if username not in users: return {"status": False, "message": "User does not exist"}
        if users[username]["password"] != password: return {"status": False, "message": "Incorrect password"}
        
        user_data = users[username]["data"]
        return {"status": True, "message": "User data retrieved successfully", "data": user_data}


class Conversations:
    """Handles the `data/conversations.json` file."""
    
    def __init__(self) -> None:
        self.path = os.path.join(os.path.dirname(__file__), 'data')
        self.file_path = os.path.join(self.path, 'conversations.json')

        self.SESSION = get_session

        if not os.path.exists(self.path): os.makedirs(self.path)
        
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f: json.dump({"current": [], "history": {}}, f, indent=4)
        else:
            try:
                with open(self.file_path, 'r') as f: json.load(f)
            except (json.JSONDecodeError, ValueError):
                with open(self.file_path, 'w') as f: json.dump({"current": [], "history": {}}, f, indent=4)

    def get_history(self) -> Dict[str, List[Dict[str, str]]]:
        """Fetches the history from the `conversations.json` file."""
        with open(self.file_path, 'r') as f: data: dict = json.load(f)
        return data.get("current", {})

    def add_dialogue(self, user: str, text: str) -> Dict[str, str]:
        """Adds a dialogue to the `current` conversation list."""
        with open(self.file_path, 'r') as f: data: dict = json.load(f)
        
        dialogue = {"user": user, "text": text}
        data["current"].append(dialogue)

        with open(self.file_path, 'w') as f: json.dump(data, f, indent=4)
        return {"status": "success", "message": "Dialogue added successfully"}

    def remove_dialogue(self, amount: int) -> bool:
        """
        Moves the last `amount` dialogues from `current` to `history`.
        Each purge is assigned a unique key based on the session id.
        """
        with open(self.file_path, 'r') as f: data = json.load(f)
        if len(data["current"]) < amount: return {"status": "failed", "content": None, "message": f"Purge failed. Not enough messages to remove (current length: {len(data['current'])}, requested: {amount})."}
        
        to_archive = data["current"][-amount:]
        data["current"] = data["current"][:-amount]

        session_key = str(self.SESSION())
        if session_key not in data["history"]: data["history"][session_key] = []
        data["history"][session_key].extend([msg for msg in to_archive if msg not in data["history"][session_key]])

        with open(self.file_path, 'w') as f: json.dump(data, f, indent=4)
        return {"status": "success", "content": to_archive, "message": f"{amount} messages purged successfully and archived under session {session_key}."}
    

class Notes:
    """Handles the `data/notes.json` file."""
    
    def __init__(self) -> None:
        self.path = os.path.join(os.path.dirname(__file__), 'data')
        self.file_path = os.path.join(self.path, 'notes.json')

        if not os.path.exists(self.path): os.makedirs(self.path)
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f: json.dump({}, f, indent=4)
        
    def get_notes(self) -> Dict[str, List[str]]:
        """Fetches the notes from the `notes.json` file."""
        with open(self.file_path, 'r') as f: notes: dict = json.load(f)
        
        return {"status": True, "message": "User notes retrieved successfully", "notes": notes["notes"]}

    def add_note(self, note: str, name: str) -> Dict[str, str]:
        """Adds a note to the `notes.json` file."""
        with open(self.file_path, 'r') as f: notes: dict = json.load(f)

        notes["notes"][name] = note
        with open(self.file_path, 'w') as f: json.dump(notes, f, indent=4)
        return {"status": True, "message": "Note added successfully"}

    def remove_note(self, name: str) -> Dict[str, str]:
        """Removes a note from the `notes.json` file."""
        with open(self.file_path, 'r') as f: notes: dict = json.load(f)
        if name not in notes["notes"]: return {"status": False, "message": "Note does not exist"}
        del notes["notes"][name]
        with open(self.file_path, 'w') as f: json.dump(notes, f, indent=4)
        return {"status": True, "message": "Note removed successfully"}
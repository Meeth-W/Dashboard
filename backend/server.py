from fastapi import FastAPI
from functions.ai import HandleRequests
from database import Users, Notes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Authentication
users = Users()
@app.get('/api/v1/create_account')
def create_account(username: str, password: str, name: str, context: str):
    """
    Creates a new user account with additional character details.
    Args:
        username (str): The username for the account.
        password (str): The password for the account.
        name (str): The character name associated with the user.
        context (str): A context of the character.
    Returns:
        dict: Status message indicating success or failure.
    """
    return users.add_user(username, password, {
        "name": name,
        "context": context
    })
# Test Script: http://127.0.0.1:8000/api/v1/create_account?username=Ghostyy&password=Secure123&name=Meeth&context=Meeth%20is%20a%20college%20student%20studying%20engineering%20at%20TCET.%20He%20is%20also%20a%20full%20stack%20developer.

@app.get('/api/v1/delete_account')
def delete_account(username: str, password: str):
    """
    Deletes a users aaccount from the database.
    Args: 
        username (str): The username for the account.
        password (str): The password for the account.
    Returns: 
        dict: Status message indiciated sucess of failiure.
    """
    return users.remove_user(username, password)
# Test Script: http://127.0.0.1:8000/api/v1/delete_account?username=Ghostyy&password=Secure123

@app.get('/api/v1/verify_account')
def verify_account(username: str, password: str):
    """
    Verifies the user's account.
    Args:
        username (str): The username for the account.
        password (str): The password for the account.
    Returns:
        dict: Status message indicating success or failure.
    """
    return users.verify(username, password)

@app.get('/api/v1/get_account')
def get_account(username: str, password: str):
    """
    Retrieves the user's account details.
    Args:
        username (str): The username for the account.
        password (str): The password for the account.
    Returns:
        dict: The user's account details.
    """
    return users.get_user(username, password)

notes = Notes()
@app.get('/api/v1/notes/add')
def add_note(username: str, password: str, title: str, content: str):
    """
    Adds a note to the user's account.
    Args:
        username (str): The username of the user.
        password (str): The user's password.
        title (str): The title of the note.
        content (str): The content of the note.
    Returns:
        dict: A status message indicating success or failure.
    """
    status = users.verify(username, password)
    if status["status"] == True:
        return notes.add_note(content, title)
    return status
# Test Script: http://127.0.0.1:8000/api/v1/notes/add?username=Ghostyy&password=Secure123&title=test&content=hi

@app.get('/api/v1/notes/fetch')
def get_notes(username: str, password: str):
    """
    Retrieves the notes of the user.
    Args:
        username (str): The username of the user.
        password (str): The user's password.
    Returns:
        dict: A response containing the user's notes.
    """
    status = users.verify(username, password)
    if status["status"] == True:
        return notes.get_notes()
    return status
# Test Script: http://127.0.0.1:8000/api/v1/notes/fetch?username=Ghostyy&password=Secure123

@app.get('/api/v1/notes/delete')
def delete_note(username: str, password: str, title: str):
    """
    Deletes a note from the user's account.
    Args:
        username (str): The username of the user.
        password (str): The user's password.
        title (str): The title of the note.
    Returns:
        dict: A status message indicating success or failure.
    """
    status = users.verify(username, password)
    if status["status"] == True:
        return notes.remove_note(title)
    return status
# Test Script: http://127.0.0.1:8000/api/v1/notes/delete?username=Ghostyy&password=Secure123&title=hi


handler = HandleRequests()
@app.get("/api/v1/ai/interact")
def ai_interact(username: str, password: str, message: str):
    """
    Sends a message to the Ollama model and handles user and conversation data.

    Args:
        username (str): The username of the user.
        password (str): The user's password.
        message (str): The user's input message.

    Returns:
        dict: A response containing the bot's reply and updated chat history.
    
        http://127.0.0.1:8000/send_message?username=ghostyy&password=secure123&message=A%20hello%20there
    """
    return handler.send_message(username, password, message)
# Test Script: http://127.0.0.1:8000/api/v1/ai/interact?username=Ghostyy&password=Secure123&message=can%20you%20tell%20me%20how%20to%20create%20a%20reactvite%20project%20through%20terminal%20on%20windows    

@app.get("/api/v1/ai/get-history")
def get_history(username: str, password: str):
    """
    Returns the chat history of the user.
    Args:
        username (str): The username of the user.
        password (str): The user's password.
    Returns:
        dict: A response containing the chat history.
    """
    status = users.verify(username, password)
    if status["status"] == True:
        return handler.conversations.get_history()
    return status
# Test Script: http://127.0.0.1:8000/api/v1/ai/get-history?username=Ghostyy&password=Secure123

@app.get('/api/v1/ai/clear')
def clear_history(username: str, password: str):
    """
    Clears the conversation history of the user.

    Args:
        username (str): The username of the user.
        password (str): The user's password.

    Returns:
        dict: A status message indicating success or failure.
    """
    status = users.verify(username, password)
    if status["status"] == True:
        return handler.clear_history()
    return status
# Test Script: http://127.0.0.1:8000/api/v1/ai/clear?username=Ghostyy&password=Secure123


origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173", 
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],  
    allow_headers = ["*"], 
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
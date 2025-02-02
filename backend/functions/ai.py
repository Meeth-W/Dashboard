from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

from database import Users, Conversations

MODEL_NAME: str = 'llama3.1:8b'
TEMPLATE: str = """
You are an AI assistant. Your goal is to help the user with their tasks by providing accurate and helpful information. Please respond to the user's questions and requests to the best of your ability.

### User Details: 
Name: {user_name}
Context: {user_context}

### Chat History:
{chat_history}

User: {user_input}
AI: 
"""

class HandleRequests:
    def __init__(self):
        self.model = OllamaLLM(model = MODEL_NAME)
        self.promt = ChatPromptTemplate.from_template(TEMPLATE)
        self.chain = self.promt | self.model

        self.users = Users()
        self.conversations = Conversations()

    def send_message(self, username: str, password: str, message: str) -> dict:
        """
        Sends a message to the Ollama model and handles user and conversation data.

        Args:
            username (str): The username of the user.
            password (str): The user's password.
            message (str): The user's input message.

        Returns:
            dict: A response containing the bot's reply.
        """
        user_verification: dict = self.users.verify(username, password)
        if not user_verification['status']: return user_verification

        user_data: dict = self.users.get_user(username, password)
        if not user_data['status']: return user_data

        input_data: dict = {
            "user_name": user_data['data'].get("name", username),
            "user_context": user_data["data"].get("context", "No Context provided."),

            "chat_history": "\n".join([
                f"{entry['user']}: {entry['text']}" for entry in self.conversations.get_history()
            ]),
            "user_input": message
        }
        try:
            response = self.chain.invoke(input_data)

            self.conversations.add_dialogue(user_data['data'].get("character_name", username), f"{message}")
            self.conversations.add_dialogue('AI', f"{response}")

            return {"status": True, "response": response}
        except Exception as e:
            return {"status": False, "message": f"Error generating response: {str(e)}"}
        
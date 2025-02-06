import requests, ollama
from bs4 import BeautifulSoup
from database import Users, ResearchHistory

class WebScraper:
    def __init__(self):
        self.users = Users()
        self.history = ResearchHistory()

    def scrape(self, username: str, password: str, url: str) -> dict:
        """
        Scrapes the content of a webpage and stores the results in the user's research history.

        Args:
            username (str): The username of the user.
            password (str): The user's password.
            url (str): The URL of the webpage to scrape.

        Returns:
            dict: A response containing the status of the scraping process.
        """
        user_verification: dict = self.users.verify(username, password)
        if not user_verification['status']: return user_verification

        user_data: dict = self.users.get_user(username, password)
        if not user_data['status']: return user_data

        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            content = soup.find_all('p')
            content = ' '.join([c.text for c in content])
            
            return {"status": True, "message": "Webpage scraped successfully", "content": content}
        except Exception as e:
            return {"status": False, "message": f"An error occurred: {str(e)}", "content": None}
    

    def summerize(self, username: str, password: str, url: str) -> dict:
        """
        Summarizes the content of a webpage and stores the results in the user's research history.
        
        Args:
            username (str): The username of the user.
            password (str): The user's password.
            url (str): The URL of the webpage to summarize.
        
        Returns:
            dict: A response containing the status of the summarization process.
        """
        print('request recieved...')
        data = self.scrape(username, password, url)['content']
        if not data: return {"status": False, "message": "No content to summarize", "summary": None, "original": None}

        stored = self.history.get_site_data(url)
        if stored['status']: return {"status": True, "message": "Found scraped data!", "summary": stored["data"]['summary'], "original": stored['data']['content']}

        try:
            response = ollama.chat(
                model = 'deepseek-r1:14b',
                # model = 'llama2-uncensored:7b'
                messages = [{'role': 'user', 'content': 
                            f"Summarize the following content within 150 words: \n\n{data}"
                }],
            )
            self.history.add_site(url, data, response["message"]["content"])

            return {"status": True, "message": "Content summarized successfully", "summary": response["message"]["content"], "original": data}
        except Exception as e:
            return {"status": False, "message": f"An error occurred: {str(e)}", "summary": None, "original": None}
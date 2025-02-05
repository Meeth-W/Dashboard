import requests
from bs4 import BeautifulSoup
from database import Users, ResearchHistory

class WebScraper:
    def __init__(self):
        self.users = Users()
        self.history = ResearchHistory()

    def scrape_url(self, username: str, password: str, url: str) -> dict:
        """
        Scrapes the content of a web page after user authentication.

        Args:
            username (str): The username of the user.
            password (str): The user's password.
            url (str): The URL to scrape.

        Returns:
            dict: The extracted text and links or an error message.
        """
        user_verification = self.users.verify(username, password)
        if not user_verification['status']:
            return user_verification

        return self._fetch_page_content(url)

    def scrape_with_keywords(self, username: str, password: str, url: str, keywords: list) -> dict:
        """
        Scrapes the content of a web page and filters it based on keywords.

        Args:
            username (str): The username of the user.
            password (str): The user's password.
            url (str): The URL to scrape.
            keywords (list): Keywords to filter the content.

        Returns:
            dict: Filtered content based on the keywords.
        """
        user_verification = self.users.verify(username, password)
        if not user_verification['status']:
            return user_verification

        scraped_data = self._fetch_page_content(url)
        if not scraped_data["status"]:
            return scraped_data

        filtered_text = " ".join([word for word in scraped_data["text"].split() if any(kw.lower() in word.lower() for kw in keywords)])
        
        return {
            "status": True,
            "filtered_text": filtered_text if filtered_text else "No matching content found.",
            "links": scraped_data["links"]
        }

    def scrape_multiple(self, username: str, password: str, urls: list) -> dict:
        """
        Scrapes multiple web pages.

        Args:
            username (str): The username of the user.
            password (str): The user's password.
            urls (list): List of URLs to scrape.

        Returns:
            dict: Extracted content and links from multiple pages.
        """
        user_verification = self.users.verify(username, password)
        if not user_verification['status']:
            return user_verification

        results = {}
        for url in urls:
            results[url] = self._fetch_page_content(url)

        return {"status": True, "results": results}

    def _fetch_page_content(self, url: str) -> dict:
        """
        Helper method to fetch the content of a web page.

        Args:
            url (str): The URL of the web page.

        Returns:
            dict: The extracted text and links.
        """
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            text_content = " ".join([p.get_text() for p in soup.find_all('p')])
            links = [a['href'] for a in soup.find_all('a', href=True)]

            return {"status": True, "text": text_content, "links": links}
        except requests.exceptions.RequestException as e:
            return {"status": False, "message": str(e)}

    def research_query(self, username: str, password: str, query: str) -> dict:
        """
        Conducts a research query and stores results.

        Args:
            username (str): The username of the user.
            password (str): The user's password.
            query (str): The research query.

        Returns:
            dict: Search results or an error message.
        """
        user_verification = self.users.verify(username, password)
        if not user_verification['status']:
            return user_verification

        search_url = f"https://www.google.com/search?q={query}"
        search_results = self._fetch_page_content(search_url)

        if search_results["status"]:
            self.history.add_research_entry(username, query, search_results["text"])

        return search_results

    def get_research_history(self, username: str, password: str) -> dict:
        """
        Retrieves the research history of the user.

        Args:
            username (str): The username of the user.
            password (str): The user's password.

        Returns:
            dict: The research history data.
        """
        user_verification = self.users.verify(username, password)
        if not user_verification['status']:
            return user_verification

        return self.history.get_research_history(username)

# === backend/services/news_service.py ===
import requests
from config import NEWSAPI_KEY, GNEWS_API_KEY

def fetch_newsapi_data(query: str):
    params = {
        "q": query,
        "apiKey": NEWSAPI_KEY,
        "pageSize": 20,
        "sortBy": "publishedAt",
        "language": "en"
    }
    response = requests.get("https://newsapi.org/v2/everything", params=params)
    if response.status_code == 200:
        articles = response.json().get("articles", [])

        return {"source": "NewsAPI", "results": articles}
    else:
        return {"source": "NewsAPI", "error": response.status_code}

def fetch_gnews_data(query: str):
    params = {
        "q": query,
        "token": GNEWS_API_KEY,
        "lang": "en",
        "max": 20
    }
    response = requests.get("https://gnews.io/api/v4/search", params=params)
    if response.status_code == 200:
        articles = response.json().get("articles", [])

        return {"source": "GNews", "results": articles}
    else:
        return {"source": "GNews", "error": response.status_code}


from fastapi import FastAPI, Request
from services.twitter_service import fetch_tweets
from services.news_service import fetch_gnews_data, fetch_newsapi_data
#from analyzers.gpt_sentiment import analyze_sentiment
from analyzers.deepseek_sentiment import analyze_sentiment

app = FastAPI()

@app.post("/analyze")
async def analyze(request: Request):
    body = await request.json()
    query = body.get("query")

    # Fetch data from all sources
    #tweets = fetch_tweets(query)
    gnews = fetch_gnews_data(query).get("results", [])
    newsapi = fetch_newsapi_data(query).get("results", [])

    # Combine all texts for analysis
    combined_texts = []

    #combined_texts.extend(tweet["text"] for tweet in tweets if "text" in tweet)
    combined_texts.extend(article["title"] + ". " + article.get("description", "")
                          for article in gnews)
    combined_texts.extend(article["title"] + ". " + article.get("description", "")
                          for article in newsapi)

    # Pass all data to GPT
    print("Combined: ", combined_texts)
    result = analyze_sentiment(combined_texts)

    return {"result": result}

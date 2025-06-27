from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.twitter_service import fetch_tweets
from services.news_service import fetch_gnews_data, fetch_newsapi_data
from analyzers.openrouter_sentiment import analyze_sentiment

from database import company_collection  # ✅ Use your DB connection

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(request: Request):
    body = await request.json()
    
    # Extract all company information from the frontend
    company_data = {
        "companyName": body.get("companyName", ""),
        "ceo": body.get("ceo", ""),
        "country": body.get("country", ""),
        "sector": body.get("sector", ""),
        "revenue": body.get("revenue", ""),
        "employees": body.get("employees", ""),
        "year": body.get("year", ""),
        "ticker": body.get("ticker", ""),
        "links": body.get("links", ""),
        "isPublic": body.get("isPublic", False),
        "isStartup": body.get("isStartup", False)
    }
    
    # Use company name as the primary query
    query = company_data["companyName"]
    
    if not query:
        return {"error": "Company name is required"}

    try:
        # Fetch data from all sources
        # tweets = fetch_tweets(query)  # Uncomment when Twitter API is ready
        if company_data["isStartup"]:
            existing = company_collection.find_one({"companyName": query})
            if not existing:
                company_collection.insert_one(company_data)
                print(f"Inserted startup company '{query}' into DB.")
            else:
                print(f"Startup '{query}' already exists in DB.")

        gnews = fetch_gnews_data(query).get("results", [])
        newsapi = fetch_newsapi_data(query).get("results", [])

        # Combine all texts for analysis
        combined_texts = []

        # Add CEO name to search if provided
        if company_data["ceo"]:
            ceo_gnews = fetch_gnews_data(company_data["ceo"]).get("results", [])
            ceo_newsapi = fetch_newsapi_data(company_data["ceo"]).get("results", [])
            gnews.extend(ceo_gnews)
            newsapi.extend(ceo_newsapi)

        # Process news articles with proper null handling
        for article in gnews:
            title = article.get("title", "") or ""
            description = article.get("description", "") or ""
            if title:  # Only add if title exists
                combined_texts.append(title + ". " + description)
        
        for article in newsapi:
            title = article.get("title", "") or ""
            description = article.get("description", "") or ""
            if title:  # Only add if title exists
                combined_texts.append(title + ". " + description)

        # Filter out irrelevant content by checking if it mentions the company
        # Also filter out empty texts
        relevant_texts = []
        company_name_lower = query.lower()
        ceo_name_lower = company_data["ceo"].lower() if company_data["ceo"] else ""
        
        for text in combined_texts:
            if text and text.strip():  # Check if text is not empty
                text_lower = text.lower()
                if (company_name_lower in text_lower or 
                    (ceo_name_lower and ceo_name_lower in text_lower)):
                    relevant_texts.append(text)

        if not relevant_texts:
            relevant_texts = combined_texts  # Fallback to all texts if no specific matches

        print("Combined relevant texts: ", len(relevant_texts))
        
        # Pass company data and texts to sentiment analysis
        result = analyze_sentiment(relevant_texts, company_data)

        print("RESULT:", result)

        

        return {"result": result, "company_info": company_data}
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return {"error": f"Analysis failed: {str(e)}"}

@app.get("/")
async def root():
    return {"message": "Company Reputation Analysis API is running"}

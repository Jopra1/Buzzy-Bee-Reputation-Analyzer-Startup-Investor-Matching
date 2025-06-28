from fastapi import FastAPI, Form, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from services.twitter_service import fetch_tweets
from services.news_service import fetch_gnews_data, fetch_newsapi_data
from analyzers.openrouter_sentiment import analyze_sentiment
from database import company_collection
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_company(request: Request):
    try:
        data = await request.json()
        
        # Extract company data
        company_data = {
            "companyName": data.get("companyName", "").strip(),
            "ceo": data.get("ceo", "").strip(),
            "country": data.get("country", "").strip(),  
            "sector": data.get("sector", "").strip(),
            "revenue": data.get("revenue", ""),
            "employees": data.get("employees", ""),
            "year": data.get("year", ""),
            "ticker": data.get("ticker", ""),
            "links": data.get("links", ""),
            "funding_range": data.get("fundingRange", "").strip(),
            "isPublic": data.get("isPublic", False),
            "isStartup": data.get("isStartup", False),
            "email": data.get("contactInfo", ""),
            "pitchDeck": data.get("pitchDeck", "")
        }
        
        if not company_data["companyName"]:
            raise HTTPException(status_code=400, detail="Company name is required")

        # Store startup data
        if company_data["isStartup"]:
            try:
                existing = company_collection.find_one({"companyName": company_data["companyName"]})
                if not existing:
                    company_collection.insert_one(company_data)
                    print(f"✅ Stored startup: {company_data['companyName']}")
            except Exception as e:
                print(f"DB error: {e}")

        #uncomment to add to database
        #return "success"

        # Fetch data from all sources concurrently
        combined_texts = []
        
        try:
            # Create search queries
            company_query = company_data["companyName"]
            ceo_query = company_data["ceo"] if company_data["ceo"] else None
            
            # Fetch news data
            print(f"📰 Fetching news for: {company_query}")
            gnews_company = fetch_gnews_data(company_query).get("results", [])
            newsapi_company = fetch_newsapi_data(company_query).get("results", [])
            
            # Fetch CEO news if available
            gnews_ceo = []
            newsapi_ceo = []
            if ceo_query:
                print(f"👔 Fetching CEO news for: {ceo_query}")
                gnews_ceo = fetch_gnews_data(ceo_query).get("results", [])
                newsapi_ceo = fetch_newsapi_data(ceo_query).get("results", [])
            
            # Fetch Twitter data
            print(f"🐦 Fetching tweets for: {company_query}")
            tweets = fetch_tweets(company_query, max_results=10)
            
            # Process news articles
            all_news = gnews_company + newsapi_company + gnews_ceo + newsapi_ceo
            for article in all_news:
                title = article.get("title", "")
                description = article.get("description", "")
                content = article.get("content", "")
                
                # Combine title and description/content
                text = f"{title}. {description or content}".strip()
                if text and len(text) > 20:  # Filter out very short texts
                    combined_texts.append({
                        "text": text,
                        "source": "news",
                        "timestamp": article.get("publishedAt") or article.get("published_at")
                    })
            
            # Process tweets
            for tweet in tweets:
                tweet_text = tweet.get("text", "")
                if tweet_text and not tweet_text.startswith("RT @"):  # Skip retweets
                    combined_texts.append({
                        "text": tweet_text,
                        "source": "twitter",
                        "timestamp": tweet.get("created_at")
                    })
                        
        except Exception as e:
            print(f"❌ Data fetch error: {e}")

        # Filter and deduplicate content
        final_texts = filter_relevant_content(combined_texts, company_data)
        
        print(f"📊 Processing {len(final_texts)} relevant texts from news and social media")
        
        # Analyze sentiment
        result = analyze_sentiment(final_texts, company_data)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        return {"error": f"Analysis failed: {str(e)}"}

def filter_relevant_content(texts_data, company_data):
    """Filter and deduplicate content based on relevance"""
    if not texts_data:
        return []
    
    company_lower = company_data["companyName"].lower()
    ceo_lower = company_data["ceo"].lower() if company_data["ceo"] else ""
    sector_keywords = get_sector_keywords(company_data.get("sector", ""))
    
    relevant_texts = []
    seen_texts = set()
    
    for item in texts_data:
        text = item["text"]
        text_lower = text.lower()
        
        # Skip duplicates
        text_hash = hash(text_lower[:100])  # Hash first 100 chars to check similarity
        if text_hash in seen_texts:
            continue
        seen_texts.add(text_hash)
        
        # Relevance scoring
        relevance_score = 0
        
        # Direct company name match
        if company_lower in text_lower:
            relevance_score += 10
        
        # CEO name match
        if ceo_lower and ceo_lower in text_lower:
            relevance_score += 8
        
        # Sector keywords
        for keyword in sector_keywords:
            if keyword in text_lower:
                relevance_score += 3
                break
        
        # Prioritize recent content and longer texts
        if len(text) > 100:
            relevance_score += 2
        
        # Only include if relevant
        if relevance_score >= 5:
            relevant_texts.append(text)
    
    # Limit to top 25 most relevant texts
    return relevant_texts[:25]

def get_sector_keywords(sector):
    """Get relevant keywords based on sector"""
    sector_map = {
        "technology": ["tech", "software", "ai", "digital", "innovation"],
        "aviation": ["airline", "flight", "aircraft", "airport", "aviation"],
        "finance": ["bank", "financial", "money", "investment", "credit"],
        "healthcare": ["health", "medical", "hospital", "pharma", "medicine"],
        "retail": ["store", "shopping", "customer", "sales", "retail"],
        "energy": ["energy", "oil", "gas", "renewable", "power"],
        "automotive": ["car", "vehicle", "auto", "transport", "mobility"]
    }
    return sector_map.get(sector.lower(), [])

@app.get("/")
async def root():
    return {"message": "Company Analysis API - Ready", "status": "running"}

@app.post("/search-investment-opportunities")
async def search_investments(request: Request):
    body = await request.json()
    sector = body.get("sector")
    funding = body.get("fundingRange")
    employees = body.get("employees")
    country = body.get("country")

    query = {}

    if sector:
        query["sector"] = sector
    if funding:
        query["funding_range"] = funding
    if employees:
        query["employees"] = employees
    if country:
        query["country"] = country

    try:
        results = list(company_collection.find(query, {"_id": 0}))  # exclude MongoDB _id
        return {"matches": results}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Database query failed: {str(e)}"})

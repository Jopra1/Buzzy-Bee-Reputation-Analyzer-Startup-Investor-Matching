from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.twitter_service import fetch_tweets
from services.news_service import fetch_gnews_data, fetch_newsapi_data
from analyzers.openrouter_sentiment import analyze_sentiment
from database import company_collection

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
            "isPublic": data.get("isPublic", False),
            "isStartup": data.get("isStartup", False)
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

        # Fetch data from sources
        combined_texts = []
        
        # News data for company
        try:
            gnews = fetch_gnews_data(company_data["companyName"]).get("results", [])
            newsapi = fetch_newsapi_data(company_data["companyName"]).get("results", [])
            
            # CEO data if provided
            if company_data["ceo"]:
                ceo_gnews = fetch_gnews_data(company_data["ceo"]).get("results", [])
                ceo_newsapi = fetch_newsapi_data(company_data["ceo"]).get("results", [])
                gnews.extend(ceo_gnews)
                newsapi.extend(ceo_newsapi)
            
            # Process articles
            for articles in [gnews, newsapi]:
                for article in articles:
                    title = article.get("title", "") or ""
                    desc = article.get("description", "") or ""
                    if title.strip():
                        combined_texts.append(f"{title}. {desc}".strip())
                        
        except Exception as e:
            print(f"Data fetch error: {e}")

        # Filter relevant content
        if combined_texts:
            company_lower = company_data["companyName"].lower()
            ceo_lower = company_data["ceo"].lower() if company_data["ceo"] else ""
            
            relevant_texts = [
                text for text in combined_texts 
                if text and (company_lower in text.lower() or 
                           (ceo_lower and ceo_lower in text.lower()))
            ]
            
            final_texts = relevant_texts if relevant_texts else combined_texts[:20]  # Limit to 20 articles
        else:
            final_texts = []

        print(f"📊 Processing {len(final_texts)} relevant texts")
        
        # Analyze sentiment
        result = analyze_sentiment(final_texts, company_data)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        return {"error": f"Analysis failed: {str(e)}"}

@app.get("/")
async def root():
    return {"message": "Company Analysis API - Ready", "status": "running"}
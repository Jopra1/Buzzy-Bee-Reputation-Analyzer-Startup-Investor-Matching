from fastapi import FastAPI, Request, HTTPException
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

# === services/twitter_service.py ===
import requests
from config import BEARER_TOKEN

def create_headers():
    return {"Authorization": f"Bearer {BEARER_TOKEN}"}

def fetch_tweets(query, max_results=10):
    """Fetch recent tweets with better filtering"""
    url = "https://api.twitter.com/2/tweets/search/recent"
    headers = create_headers()
    
    # Enhanced query to filter out spam and get quality tweets
    enhanced_query = f'("{query}") -is:retweet lang:en'
    
    params = {
        "query": enhanced_query,
        "max_results": min(max_results, 10),  # Twitter API limit
        "tweet.fields": "created_at,text,lang,public_metrics,context_annotations",
        "expansions": "author_id",
        "user.fields": "verified,public_metrics"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json().get("data", [])
            # Filter for quality tweets
            filtered_tweets = []
            for tweet in data:
                text = tweet.get("text", "")
                # Skip very short tweets or promotional content
                if len(text) > 50 and not any(spam_word in text.lower() for spam_word in ['crypto', 'nft', 'win', 'giveaway']):
                    filtered_tweets.append(tweet)
            return filtered_tweets
        else:
            print(f"Twitter API error: {response.status_code}")
            return []
    except Exception as e:
        print(f"Twitter fetch error: {e}")
        return []

# === analyzers/openrouter_sentiment.py ===
import requests
import json
import re
from config import GEMINI_API_KEY

def extract_json(text):
    """Extract JSON from markdown blocks"""
    match = re.search(r'```(?:json)?\n(.*?)\n```', text, re.DOTALL)
    return match.group(1).strip() if match else text

def analyze_sentiment(texts, company_data):
    """Enhanced sentiment analysis using Gemini API"""
    if not texts:
        return create_empty_response(company_data)
    
    # Prepare text content with better structure
    content = "\n---\n".join(texts[:20]) if isinstance(texts, list) else str(texts)  # Limit to 20 items
    
    # Build comprehensive company context
    context = f"""
COMPANY PROFILE:
Name: {company_data.get('companyName', 'N/A')}
CEO: {company_data.get('ceo', 'N/A')}
Sector: {company_data.get('sector', 'N/A')}
Country: {company_data.get('country', 'N/A')}
Public Company: {company_data.get('isPublic', False)}
"""

    prompt = f"""
{context}

You are a professional sentiment analyst. Analyze the following social media posts and news articles about this company. Be objective and consider:

1. Overall public perception
2. Recent events and their impact
3. Industry context and comparisons
4. Customer satisfaction indicators
5. Financial performance mentions
6. Leadership and management sentiment

Content to analyze:
{content}

Provide a comprehensive analysis with this exact JSON structure. Be accurate and balanced in your assessment:

{{
  "score": 0-100,
  "sentiment": "positive/negative/neutral",
  "confidence_level": "low/medium/high",
  "positive_count": integer,
  "negative_count": integer,
  "neutral_count": integer,
  "most_positive": "actual quote from content",
  "most_negative": "actual quote from content",
  "key_insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"],
  "brand_awareness_score": 0-100,
  "market_sentiment_score": 0-100,
  "public_opinion_score": 0-100,
  "topic_scores": [
    {{"topic": "leadership", "score": 0-100}},
    {{"topic": "innovation", "score": 0-100}},
    {{"topic": "customer_service", "score": 0-100}},
    {{"topic": "financial_performance", "score": 0-100}}
  ],
  "trend_data": [
    {{"day": "Day 1", "sentiment": 0-100, "mentions": 0-50}},
    {{"day": "Day 2", "sentiment": 0-100, "mentions": 0-50}},
    {{"day": "Day 3", "sentiment": 0-100, "mentions": 0-50}},
    {{"day": "Day 4", "sentiment": 0-100, "mentions": 0-50}},
    {{"day": "Day 5", "sentiment": 0-100, "mentions": 0-50}}
  ]
}}

Important: 
- Score 0-30 = Very Negative, 31-45 = Negative, 46-55 = Neutral, 56-70 = Positive, 71-100 = Very Positive
- Base your analysis only on the provided content
- Consider context and nuance, not just keyword matching
- For airlines like Air India, consider service quality, delays, customer experience factors
"""

    # API call with better error handling
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,  # Lower temperature for more consistent results
            "responseMimeType": "application/json",
            "maxOutputTokens": 2048
        }
    }

    try:
        response = requests.post(
            url, 
            headers={"Content-Type": "application/json"}, 
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        
        content = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        result = json.loads(extract_json(content))
        
        # Validate and sanitize result
        result = validate_analysis_result(result)
        
        return {
            "company_info": company_data,
            "analysis_result": result,
            "status": "success",
            "data_sources": f"Analyzed {len(texts)} items from news and social media"
        }
        
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        return {
            "company_info": company_data,
            "analysis_result": create_fallback_analysis(texts, company_data),
            "status": "partial_success",
            "error": str(e)
        }

def validate_analysis_result(result):
    """Validate and sanitize analysis results"""
    # Ensure score is within bounds
    result["score"] = max(0, min(100, result.get("score", 50)))
    
    # Ensure counts are non-negative integers
    for count_field in ["positive_count", "negative_count", "neutral_count"]:
        result[count_field] = max(0, int(result.get(count_field, 0)))
    
    # Validate sentiment matches score
    score = result["score"]
    if score <= 45:
        result["sentiment"] = "negative"
    elif score >= 55:
        result["sentiment"] = "positive"
    else:
        result["sentiment"] = "neutral"
    
    # Ensure topic scores are within bounds
    for topic in result.get("topic_scores", []):
        topic["score"] = max(0, min(100, topic.get("score", 50)))
    
    return result

def create_fallback_analysis(texts, company_data):
    """Create basic analysis when AI fails"""
    # Simple keyword-based sentiment
    positive_words = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'awesome', 'perfect']
    negative_words = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'failed']
    
    text_content = " ".join(texts).lower()
    pos_count = sum(word in text_content for word in positive_words)
    neg_count = sum(word in text_content for word in negative_words)
    
    if pos_count > neg_count:
        score = min(75, 50 + (pos_count - neg_count) * 5)
        sentiment = "positive"
    elif neg_count > pos_count:
        score = max(25, 50 - (neg_count - pos_count) * 5)
        sentiment = "negative"
    else:
        score = 50
        sentiment = "neutral"
    
    return {
        "score": score,
        "sentiment": sentiment,
        "confidence_level": "low",
        "positive_count": pos_count,
        "negative_count": neg_count,
        "neutral_count": len(texts) - pos_count - neg_count,
        "most_positive": "Analysis unavailable",
        "most_negative": "Analysis unavailable",
        "key_insights": ["Fallback analysis due to API issues"],
        "recommendations": ["Monitor brand mentions", "Improve customer engagement"],
        "brand_awareness_score": 40,
        "market_sentiment_score": score,
        "public_opinion_score": score,
        "topic_scores": [
            {"topic": "leadership", "score": score},
            {"topic": "innovation", "score": score},
            {"topic": "customer_service", "score": score},
            {"topic": "financial_performance", "score": score}
        ],
        "trend_data": [
            {"day": f"Day {i+1}", "sentiment": score, "mentions": len(texts)//5}
            for i in range(5)
        ]
    }

def create_empty_response(company_data):
    """Create empty response when no data available"""
    return {
        "company_info": company_data,
        "analysis_result": {
            "score": 50,
            "sentiment": "neutral",
            "confidence_level": "low",
            "positive_count": 0,
            "negative_count": 0,
            "neutral_count": 0,
            "most_positive": "No mentions found",
            "most_negative": "No mentions found",
            "key_insights": ["Insufficient data for comprehensive analysis"],
            "recommendations": ["Increase digital presence", "Monitor brand mentions", "Engage with customers online"],
            "brand_awareness_score": 20,
            "market_sentiment_score": 50,
            "public_opinion_score": 30,
            "topic_scores": [
                {"topic": "leadership", "score": 50},
                {"topic": "innovation", "score": 50},
                {"topic": "customer_service", "score": 50},
                {"topic": "financial_performance", "score": 50}
            ],
            "trend_data": [
                {"day": f"Day {i+1}", "sentiment": 50, "mentions": 0}
                for i in range(5)
            ]
        },
        "status": "no_data"
    }
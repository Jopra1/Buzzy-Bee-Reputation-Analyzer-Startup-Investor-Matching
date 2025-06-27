import requests
import json
import re
from config import GEMINI_API_KEY

def extract_json(text):
    """Extract JSON from markdown blocks"""
    match = re.search(r'```(?:json)?\n(.*?)\n```', text, re.DOTALL)
    return match.group(1).strip() if match else text

def analyze_sentiment(texts, company_data):
    """Analyze sentiment using Gemini API"""
    if not texts:
        return create_empty_response(company_data)
    
    # Prepare text content
    content = "\n".join(texts) if isinstance(texts, list) else str(texts)
    
    # Build company context
    context = f"""
COMPANY: {company_data.get('companyName', 'N/A')}
CEO: {company_data.get('ceo', 'N/A')}
SECTOR: {company_data.get('sector', 'N/A')}
COUNTRY: {company_data.get('country', 'N/A')}
"""

    prompt = f"""
{context}

Analyze sentiment for this company from the following content:
{content}

Return ONLY valid JSON with this exact structure:
{{
  "score": 0-100,
  "sentiment": "positive/negative/neutral",
  "confidence_level": "low/medium/high",
  "positive_count": integer,
  "negative_count": integer,
  "neutral_count": integer,
  "most_positive": "quote",
  "most_negative": "quote",
  "key_insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "brand_awareness_score": 0-100,
  "market_sentiment_score": 0-100,
  "public_opinion_score": 0-100,
  "topic_scores": [{{"topic": "leadership", "score": 0-100}}, {{"topic": "innovation", "score": 0-100}}, {{"topic": "financials", "score": 0-100}}],
  "trend_data": [{{"day": "Day 1", "sentiment": 70, "mentions": 15}}, {{"day": "Day 2", "sentiment": 65, "mentions": 12}}, {{"day": "Day 3", "sentiment": 75, "mentions": 18}}]
}}
"""

    # API call
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.3, "responseMimeType": "application/json"}
    }

    try:
        response = requests.post(url, headers={"Content-Type": "application/json"}, json=payload)
        response.raise_for_status()
        
        content = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        result = json.loads(extract_json(content))
        
        return {
            "company_info": company_data,
            "analysis_result": result,
            "status": "success"
        }
        
    except Exception as e:
        print(f"Analysis error: {e}")
        return {
            "company_info": company_data,
            "analysis_result": {"error": str(e)},
            "status": "error"
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
            "neutral_count": 1,
            "most_positive": "No positive mentions found",
            "most_negative": "No negative mentions found",
            "key_insights": ["Limited data available for analysis"],
            "recommendations": ["Increase online presence", "Monitor brand mentions", "Engage with media"],
            "brand_awareness_score": 30,
            "market_sentiment_score": 50,
            "public_opinion_score": 40,
            "topic_scores": [
                {"topic": "leadership", "score": 50},
                {"topic": "innovation", "score": 50},
                {"topic": "financials", "score": 50}
            ],
            "trend_data": [
                {"day": "Day 1", "sentiment": 50, "mentions": 0},
                {"day": "Day 2", "sentiment": 50, "mentions": 0},
                {"day": "Day 3", "sentiment": 50, "mentions": 0}
            ]
        },
        "status": "no_data"
    }
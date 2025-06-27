from openai import OpenAI
from config import OPENROUTER_API_KEY
import json

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=OPENROUTER_API_KEY,
)

def analyze_sentiment(text_list, company_data=None):
    # Join list into a single string if needed
    if isinstance(text_list, list):
        text = "\n".join(text_list)
    else:
        text = str(text_list)

    # Build company context string
    company_context = ""
    if company_data:
        company_context = f"""
        
COMPANY INFORMATION:
- Company Name: {company_data.get('companyName', 'N/A')}
- CEO: {company_data.get('ceo', 'N/A')}
- Country: {company_data.get('country', 'N/A')}
- Sector: {company_data.get('sector', 'N/A')}
- Revenue: {company_data.get('revenue', 'N/A')} USD
- Number of Employees: {company_data.get('employees', 'N/A')}
- Year Established: {company_data.get('year', 'N/A')}
- Stock Ticker: {company_data.get('ticker', 'N/A' if not company_data.get('ticker') else company_data.get('ticker'))}
- Publicly Listed: {'Yes' if company_data.get('isPublic') else 'No'}
- Startup Status: {'Yes' if company_data.get('isStartup') else 'No'}
- Additional Links: {company_data.get('links', 'N/A')}

"""

    prompt = f"""
You are an advanced AI-powered reputation analysis engine specialized in business intelligence and corporate reputation management.

{company_context}

ANALYSIS TASK:
Analyze the public sentiment and reputation specifically for the company mentioned above based on the following collection of digital texts from recent news articles, social media posts, and other public commentary:

{text}

IMPORTANT INSTRUCTIONS:
1. Focus ONLY on content that is directly related to the specified company
2. Consider the company's sector, size, and business context when providing insights
3. If the company is a startup, focus on growth potential, innovation, and market entry challenges
4. If the company is publicly listed, consider stock performance, investor sentiment, and market position
5. Provide sector-specific insights relevant to their industry
6. Filter out any content that might be about different companies with similar names

Your goal is to critically evaluate the overall sentiment and reputation, then respond in a structured JSON format with the following keys:

- score: a number from 0 to 100 indicating the company's overall reputation based on sentiment (0 = very negative, 100 = very positive)
- sentiment: overall tone — either 'positive', 'negative', or 'neutral'
- most_negative: the most concerning or harmful comment or statement from the input (if any)
- most_positive: the most favorable or supportive comment or statement from the input (if any)
- positive_count: total number of clearly positive comments
- negative_count: total number of clearly negative comments
- neutral_count: total number of neutral comments
- confidence_level: how confident you are that the analyzed content is about the specified company (low/medium/high)
- key_insights: 3-4 critical observations or patterns from the data, considering the company's specific context (e.g., sector trends, startup challenges, public company expectations, regional market factors)
- sector_specific_analysis: 2-3 insights specifically related to their industry sector and how they compare to industry standards
- risk_factors: 2-3 potential reputation risks or concerns identified from the analysis
- opportunities: 2-3 potential opportunities for reputation improvement or growth
- recommendations: 3-4 strategic and actionable suggestions tailored to this specific company profile to improve or maintain their public reputation
- next_steps: 2-3 immediate actions the company should consider taking based on this analysis
- brand_awareness_score: estimated brand awareness percentage (0-100)
- market_sentiment_score: estimated market sentiment percentage (0-100)
- public_opinion_score: estimated public opinion percentage (0-100)
- topic_scores: array of objects with 'topic' and 'score' for key discussion topics
- trend_data: array of objects with 'day', 'sentiment' and 'mentions' for the last 7 days (simulated based on analysis)

RESPONSE REQUIREMENTS:
- Provide your full response strictly in valid JSON format
- Ensure all recommendations are specific to the company's profile (startup vs established, public vs private, sector-specific)
- If limited relevant content is found, mention this in the confidence_level and adjust insights accordingly
- Focus on actionable intelligence that considers their business model, market position, and company characteristics

"""

    response = client.chat.completions.create(
        model="deepseek/deepseek-r1",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    try:
        # Parse the JSON response
        result_json = json.loads(response.choices[0].message.content)
        
        # Structure the response to match frontend expectations
        structured_result = {
            "company_info": company_data or {},
            "analysis_result": result_json,
            "raw_response": response.choices[0].message.content
        }
        
        return structured_result
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print(f"Raw response: {response.choices[0].message.content}")
        
        # Return a fallback structure
        return {
            "company_info": company_data or {},
            "analysis_result": {
                "score": 0,
                "sentiment": "neutral",
                "error": "Failed to parse analysis response",
                "raw_response": response.choices[0].message.content
            },
            "raw_response": response.choices[0].message.content
        }
from openai import OpenAI
from config import DEEPSEEK_API_KEY

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=DEEPSEEK_API_KEY,
)
def analyze_sentiment(text_list):
    # Join list into a single string if needed
    if isinstance(text_list, list):
        text = "\n".join(text_list)
    else:
        text = str(text_list)

    prompt = f"""
            
        You are an AI-powered reputation analysis engine for businesses.

        Analyze the public sentiment and reputation of a company based on the following collection of digital texts, which may include social media posts, news headlines, and other public commentary:

        {text}

        Your goal is to critically evaluate the overall sentiment and reputation, then respond in a structured JSON format with the following keys:

        - score: a number from 0 to 100 indicating the company's overall reputation based on sentiment (0 = very negative, 100 = very positive),
        - sentiment: overall tone — either 'positive', 'negative', or 'neutral',
        - most_negative: the most concerning or harmful comment or statement from the input,
        - most_positive: the most favorable or supportive comment or statement from the input,
        - positive_count: total number of clearly positive comments,
        - negative_count: total number of clearly negative comments,
        - key_insights: 2-3 critical observations or patterns from the data (e.g., trending concerns, recurring praise, sector-specific issues),
        - recommendations: 2-3 strategic or actionable suggestions for the business to improve or maintain their public reputation based on the analysis.

        Provide your full response strictly in valid JSON format.

    """

    response = client.chat.completions.create(
        model="deepseek/deepseek-r1",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

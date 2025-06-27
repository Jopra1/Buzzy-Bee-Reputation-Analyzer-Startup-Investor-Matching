from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def analyze_sentiment(text_list):
    # Join list into a single string if needed
    if isinstance(text_list, list):
        text = "\n".join(text_list)
    else:
        text = str(text_list)

    prompt = f"""
    Do sentiment analysis of the following text:

    {text}

    Now give your sentiment result in a JSON format with keys:
    - score: a number from 0 to 100 indicating how positive the sentiment is,
    - sentiment: either 'positive' or 'negative',
    - most_negative: the most negative text input,
    - most_positive: the most positive text input.
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content


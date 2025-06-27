from transformers import pipeline

# Load the sentiment analysis model once
model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
sentiment_pipeline = pipeline("sentiment-analysis", model=model_name)

def analyze_sentiment(texts: list[str], company_data: dict) -> dict:
    results = []

    for idx, text in enumerate(texts, 1):
        prediction = sentiment_pipeline(text)[0]
        label = prediction["label"]
        confidence = round(prediction["score"], 2)

        # Print the result
        print(f"[{idx}] Text: {text}\n    Sentiment: {label} (Confidence: {confidence})\n")

        results.append({
            "text": text,
            "label": label,
            "confidence": confidence
        })

    return {
        "sentiments": results,
        "summary": {
            "total": len(results),
            "positive": sum(1 for r in results if r["label"] == "Positive"),
            "negative": sum(1 for r in results if r["label"] == "Negative"),
            "neutral": sum(1 for r in results if r["label"] == "Neutral")
        },
        "company": company_data["companyName"]
    }


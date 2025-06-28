# Buzzy Bee

**Welcome to Buzzy Bee**, a dual-purpose platform built during the EDEN 4.0 hackathon to address two critical challenges:
- **AI-Powered Reputation Analysis** for businesses
- **Startup Finder** for connecting startups with investors

This project delivers real-time reputation scores and actionable insights for companies while facilitating smart investor-startup matching — all within a user-friendly web application.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Demo](#demo)
- [Challenges & Solutions](#challenges--solutions)
- [Future Scope](#future-scope)
- [License](#license)

---

## Project Overview

Eden4 Identifier Expected tackles **two key problems**:

### 1. AI-Powered Reputation Analysis
Businesses struggle to monitor their online reputation in real time. Our platform:
- Aggregates data from **social media** and **news**
- Uses **AI** to generate instant **reputation scores** and **insights**

### 2. Startup Finder
Startups struggle to connect with compatible investors. Our solution:
- Offers intelligent **investor-startup matching**
- Enables startups to improve pitches with **feedback loops**

🛠 Built during a hackathon, this is a functional MVP (minimum viable product) with core features live and expansion potential.

---

## Features

### ✅ Reputation Analysis
- Instant **reputation scores** (0–100) from Twitter, GNews, and NewsAPI
- Identifies **dominant sentiment** and **key themes**
- Actionable insights via **Gemini 1.5 Flash API**

### 🚀 Startup Finder
- Basic **matching engine** for startups and investors (sector, funding range)
- Framework for a **pitch feedback system**
- **Compatibility scores** explaining matches

### 👤 User Experience
- Role-based UI: **Company** or **Investor**
- Form for company info: name, sector, revenue, optional pitch deck
- Clean, modern React-based frontend

---

## Tech Stack

| Layer        | Tools & Frameworks                            |
|--------------|------------------------------------------------|
| **Frontend** | React, CSS                                     |
| **Backend**  | Python, FastAPI                                |
| **Database** | MongoDB                                        |
| **AI & APIs**| Gemini 1.5 Flash, Twitter API, GNews API, NewsAPI |

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Shivsay/Eden4_Identifier_Expected.git
cd Eden4_Identifier_Expected
```

### 2. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```


### Create a config.py :
```bash
BEARER_TOKEN = "YOUR_BEARER_TOKEN"
NEWSAPI_KEY = "YOUR_NEWSAPI_TOKEN"
GNEWS_API_KEY = "YOUR_GNEWSAPI_TOKEN"
GEMINI_API_KEY =  "YOUR_GEMINIAPI_TOKEN"
MONGO_KEY = "YOUR_MONGOAPI_TOKEN"
```

### Run the server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
### 4. MongoDB
- Use MongoDB Atlas or a local instance and update your MONGO_KEY accordingly in the config.py 
 
## Usage
1. Role Selection: Choose whether you’re a Company or Investor.

2. Company Form:
  - Enter name, sector, revenue, year founded, CEO name, etc.
  - If a startup: enter pitch deck , enter funding range

3. Reputation Analysis:
  - Data pulled from Twitter, NewsAPI, and GNews
  - Gemini API generates a reputation score and insights

4. Startup Finder:
  - Matches startups with suitable investors
  - Basic compatibility score and feedback system (in development)
    
## Demo
![PHOTO-2025-06-28-04-10-56](https://github.com/user-attachments/assets/d678fe30-1c54-4a20-8fb3-9d82eeb3d503)
![PHOTO-2025-06-28-04-11-10](https://github.com/user-attachments/assets/fc8d3f20-5493-4f19-918e-aab64c864710)
![PHOTO-2025-06-28-04-11-27](https://github.com/user-attachments/assets/38039047-d243-493b-bd96-964fa7a8a880)

## Challenges & Solutions

| Challenge                        | Solution                                                |
| -------------------------------- | ------------------------------------------------------- |
| Inconsistent API formats         | Normalized Twitter, NewsAPI, and GNews data via scripts |
| API Token Limits                 | Used batching, multiple keys, and optimized requests    |
| Balancing Dual Features          | Prioritized MVP for reputation analysis; added matching |
| Sarcasm & ambiguity in sentiment | Used Gemini for contextual interpretation               |
| Low-code integration with n8n    | Pivoted to direct Gemini API after token issues         |

## Future Scope

- Advanced investor filters and startup sorting
- Startup pitch deck summarization and evaluation
- Personalized investor recommendations using ML
- Enhanced feedback loop (NLP-powered)
- Chat-style onboarding assistant

## License
MIT License © 2025 Shivsay & Team Identifier_expected

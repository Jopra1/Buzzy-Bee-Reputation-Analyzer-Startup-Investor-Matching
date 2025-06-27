# Eden 4.0 Repo

## Installation

```
pip install -r requirements.txt
```

## Running
Running backend

```
cd backend

uvicorn main:app --reload
```

Now run the following curl command to test the server

```
curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d '{"query": "COMPANY_NAME"}'
```

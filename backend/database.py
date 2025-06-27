from pymongo import MongoClient
from config import MONGO_KEY

client = MongoClient(MONGO_KEY)
db = client.company_data
company_collection = db.companies

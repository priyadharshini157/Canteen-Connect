import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://priyadharshinis3011_db_user:C3Zbx2oz2ppPYPMn@cluster0.o6xbd5s.mongodb.net/?appName=Cluster0")
client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
db = client.canteen_db

def get_db():
    return db
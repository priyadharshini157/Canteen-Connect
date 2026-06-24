import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def make_admin():
    load_dotenv()
    uri = os.getenv("MONGO_URI")
    client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
    db = client.canteen_db
    
    # Find the first user or a specific user and make them admin
    result = await db.users.update_many({}, {"$set": {"role": "admin"}})
    print(f"Updated {result.modified_count} users to Admin role!")

if __name__ == "__main__":
    asyncio.run(make_admin())

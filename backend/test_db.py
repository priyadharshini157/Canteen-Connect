import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def test_connection():
    load_dotenv()
    uri = os.getenv("MONGO_URI")
    print(f"Connecting to: {uri}")
    client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
    try:
        await client.server_info()
        print("SUCCESS! Connected to MongoDB Atlas.")
    except Exception as e:
        print(f"FAILED to connect: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())

import asyncio
import os
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def create_admin():
    load_dotenv()
    uri = os.getenv("MONGO_URI")
    client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
    db = client.canteen_db
    
    email = "priya07admin@gmail.com"
    password = "priya07"
    
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    admin_user = {
        "username": "Admin Priya",
        "email": email,
        "hashed_password": hashed_password,
        "role": "admin",
        "phone": None,
        "profile_picture": None
    }
    
    # Check if exists
    existing = await db.users.find_one({"email": email})
    if existing:
        await db.users.update_one({"email": email}, {"$set": {"role": "admin", "hashed_password": hashed_password}})
        print(f"Updated existing user {email} to admin and reset password.")
    else:
        await db.users.insert_one(admin_user)
        print(f"Successfully created separate admin account: {email}")

if __name__ == "__main__":
    asyncio.run(create_admin())

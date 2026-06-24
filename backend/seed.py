import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

items = [
    {"name": "Chicken Rice", "price": 90.0, "category": "Lunch", "image_url": "/images/chicken_rice.png"},
    {"name": "Noodles", "price": 70.0, "category": "Lunch", "image_url": "/images/noodles.png"},
    {"name": "Veg Rice", "price": 60.0, "category": "Lunch", "image_url": "/images/veg_rice.png"},
    {"name": "Veg Noodles", "price": 75.5, "category": "Lunch", "image_url": "/images/veg_noodles.png"},
    {"name": "Egg Noodles", "price": 80.5, "category": "Lunch", "image_url": "/images/egg_noodles.png"},
    {"name": "Parotta", "price": 15.0, "category": "Dinner", "image_url": "/images/paroto.png"},
    {"name": "Curd Rice", "price": 56.0, "category": "Lunch", "image_url": "/images/curd_rice.png"}
]

async def seed_db():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient('mongodb://localhost:27017', serverSelectionTimeoutMS=5000)
    db = client.canteen_db
    
    try:
        # Check connection
        await client.server_info()
        print("Connected successfully. Seeding menu items...")
        
        # Clear existing menu if any
        await db.menu.delete_many({})
        
        # Insert new items
        await db.menu.insert_many(items)
        print(f"Successfully seeded {len(items)} menu items!")
        
    except Exception as e:
        print("Failed to connect or seed database:")
        print(e)
        print("\nPlease ensure MongoDB is running locally on port 27017 or update the URI.")

if __name__ == "__main__":
    asyncio.run(seed_db())

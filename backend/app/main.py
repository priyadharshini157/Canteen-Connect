from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import live_token, auth, menu, orders # Assuming you create these

app = FastAPI(title="Canteen Order System")

from app.config import settings

# Configure CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174",
        "https://food-canteen-connect.vercel.app",
        settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(live_token.router)
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(menu.router, prefix="/api/menu", tags=["menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])

@app.get("/api/test_db")
async def test_db():
    from app.database import db
    try:
        # Quick ping with a 3 second timeout
        await db.command("ping", maxTimeMS=3000)
        return {"status": "success", "message": "MongoDB is connected!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.on_event("startup")
async def seed_admin_user():
    from app.database import db
    from app.utils.security import get_password_hash
    from datetime import datetime
    try:
        admin_email = "priya07admin@gmail.com"
        admin_username = "priya07admin"
        existing = await db.users.find_one({"$or": [{"email": admin_email}, {"username": admin_username}]})
        if not existing:
            hashed_pw = get_password_hash("priya07")
            await db.users.insert_one({
                "username": admin_username,
                "email": admin_email,
                "hashed_password": hashed_pw,
                "full_name": "Priyadharshini Admin",
                "phone": "+91 9876543210",
                "roll_no": "ADMIN01",
                "department": "Administration",
                "role": "admin",
                "created_at": datetime.utcnow()
            })
            print("Auto-seeded admin account: priya07admin@gmail.com")
        else:
            # Ensure role is admin and password is valid
            hashed_pw = get_password_hash("priya07")
            await db.users.update_one(
                {"_id": existing["_id"]},
                {"$set": {"role": "admin", "hashed_password": hashed_pw, "email": admin_email, "username": admin_username}}
            )
            print("Updated existing admin account: priya07admin@gmail.com")

        # Auto-seed default food menu items
        default_menu = [
            {"name": "Chicken Rice", "price": 90.0, "category": "Lunch", "image_url": "/images/chicken_rice.png", "is_available": True},
            {"name": "Noodles", "price": 70.0, "category": "Lunch", "image_url": "/images/noodles.png", "is_available": True},
            {"name": "Veg Rice", "price": 60.0, "category": "Lunch", "image_url": "/images/veg_rice.png", "is_available": True},
            {"name": "Veg Noodles", "price": 75.0, "category": "Lunch", "image_url": "/images/veg_noodles.png", "is_available": True},
            {"name": "Egg Noodles", "price": 80.0, "category": "Lunch", "image_url": "/images/egg_noodles.png", "is_available": True},
            {"name": "Parotta", "price": 20.0, "category": "Dinner", "image_url": "/images/paroto.png", "is_available": True},
            {"name": "Curd Rice", "price": 50.0, "category": "Lunch", "image_url": "/images/curd_rice.png", "is_available": True},
            {"name": "Rose Milk", "price": 30.0, "category": "Drinks", "image_url": "https://res.cloudinary.com/db5jefiqz/image/upload/v1782276231/i5o8ecrih2bcy6pducwz.webp", "is_available": True},
            {"name": "Tea", "price": 15.0, "category": "Drinks", "image_url": "https://res.cloudinary.com/db5jefiqz/image/upload/v1782296871/lrm7qqy5grcmtdoi8kce.jpg", "is_available": True}
        ]
        for item in default_menu:
            if not await db.menu.find_one({"name": item["name"]}):
                await db.menu.insert_one(item)
        print("Auto-seeded food menu items successfully.")
    except Exception as e:
        print("Error seeding admin user or menu:", e)

@app.get("/")
def root():
    return {"message": "Canteen API is running"}
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
    except Exception as e:
        print("Error seeding admin user:", e)

@app.get("/")
def root():
    return {"message": "Canteen API is running"}
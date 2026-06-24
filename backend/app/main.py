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

@app.get("/")
def root():
    return {"message": "Canteen API is running"}
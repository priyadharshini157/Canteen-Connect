import os
from fastapi import APIRouter, HTTPException, UploadFile, File
import cloudinary
import cloudinary.uploader
from app.config import settings
from app.database import get_db
from app.models.menu import MenuItem
from typing import List

router = APIRouter()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME if hasattr(settings, 'CLOUDINARY_CLOUD_NAME') else os.getenv('CLOUDINARY_CLOUD_NAME', 'b5jefiqz'),
    api_key=settings.CLOUDINARY_API_KEY if hasattr(settings, 'CLOUDINARY_API_KEY') else os.getenv('CLOUDINARY_API_KEY', '522271644567994'),
    api_secret=settings.CLOUDINARY_API_SECRET if hasattr(settings, 'CLOUDINARY_API_SECRET') else os.getenv('CLOUDINARY_API_SECRET', 's9vd9dnQRBubr8xYVSgazwmmpZU')
)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        result = cloudinary.uploader.upload(file.file)
        return {"url": result.get("secure_url")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[MenuItem])
async def get_menu_items():
    db = get_db()
    # Fetch all menu items from MongoDB
    items = await db.menu.find().to_list(length=100)
    return items

@router.post("/", status_code=201)
async def add_menu_item(item: MenuItem):
    db = get_db()
    await db.menu.insert_one(item.model_dump())
    return {"message": "Menu item added successfully"}

@router.delete("/clear_all")
async def clear_all_menu_items():
    db = get_db()
    await db.menu.delete_many({})
    return {"message": "All menu items cleared successfully"}

@router.delete("/{item_name}")
async def delete_menu_item(item_name: str):
    db = get_db()
    result = await db.menu.delete_one({"name": item_name})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Menu item deleted successfully"}
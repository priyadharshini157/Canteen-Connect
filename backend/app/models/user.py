from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    phone: str
    roll_no: str
    department: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    phone: Optional[str] = None
    profile_picture: Optional[str] = None

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    full_name: str
    phone: str
    roll_no: str
    department: str
    role: str = "customer"  # Roles: "customer" or "admin"
    profile_picture: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
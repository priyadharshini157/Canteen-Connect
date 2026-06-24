from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.config import settings
from app.database import get_db
from app.models.user import UserCreate, UserInDB, UserUpdate, UserLogin
from app.utils.security import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    db = get_db()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and save
    hashed_password = get_password_hash(user.password)
    new_user = UserInDB(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password,
        full_name=user.full_name,
        phone=user.phone,
        roll_no=user.roll_no,
        department=user.department
    )

    await db.users.insert_one(new_user.model_dump())
    return {"message": "User registered successfully"}

@router.post("/login")
async def login_user(user: UserLogin):
    db = get_db()
    
    # Find user in DB
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )

    # Generate JWT
    access_token = create_access_token(
        data={"sub": db_user["email"], "role": db_user["role"]}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": db_user["role"]
    }

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return email

@router.get("/profile")
async def get_profile(current_user: str = Depends(get_current_user)):
    db = get_db()
    user = await db.users.find_one({"email": current_user}, {"hashed_password": 0, "_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/profile")
async def update_profile(profile_data: UserUpdate, current_user: str = Depends(get_current_user)):
    db = get_db()
    update_data = profile_data.model_dump(exclude_unset=True)
    if not update_data:
        return {"message": "No fields to update"}
        
    updated_user = await db.users.find_one_and_update(
        {"email": current_user},
        {"$set": update_data},
        return_document=True,
        projection={"hashed_password": 0, "_id": 0}
    )
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Profile updated successfully", "user": updated_user}
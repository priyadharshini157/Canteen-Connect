from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    menu_id: str
    quantity: int
    name: str
    image_url: Optional[str] = None
    category: Optional[str] = None

class OrderSchema(BaseModel):
    user_id: str
    items: List[OrderItem]
    total_price: float
    status: str = Field(default="Pending") # Pending, Preparing, Ready, Completed
    token_number: int
    payment_status: str = Field(default="Pending")
    payment_method: str = Field(default="None")
    
    # Razorpay Fields
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    
    # QR Collection Fields
    qrToken: Optional[str] = None
    qr_code: Optional[str] = None
    collected_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total_price: float
    payment_method: str = "Razorpay"
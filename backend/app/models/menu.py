from pydantic import BaseModel
from typing import Optional

class MenuItem(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    is_available: bool = True
    image_url: Optional[str] = None
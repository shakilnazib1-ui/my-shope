from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(min_length=6, max_length=72)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    is_admin: bool
    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    model_config = {"from_attributes": True}


class ProductIn(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: Optional[str] = ""
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    image_url: Optional[str] = ""
    sizes: Optional[str] = ""
    category_id: int
    is_active: bool = True


class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None
    sizes: Optional[str] = ""
    category: Optional[CategoryOut] = None
    is_active: bool
    model_config = {"from_attributes": True}


class OrderItemIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=50)
    size: Optional[str] = None


class OrderIn(BaseModel):
    full_name: str = Field(min_length=2)
    phone: str = Field(min_length=6)
    address: str = Field(min_length=5)
    payment_method: str = "cod"
    items: List[OrderItemIn] = Field(min_length=1)


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str
    size: Optional[str] = None
    quantity: int
    unit_price: float
    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    total: float
    status: str
    full_name: str
    phone: str
    address: str
    payment_method: str
    created_at: datetime
    items: List[OrderItemOut]
    model_config = {"from_attributes": True}


class StatusIn(BaseModel):
    status: str

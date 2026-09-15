from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.category import CategoryOut


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    price: Decimal
    image_url: str | None
    stock: int
    category_id: int
    created_at: datetime
    category: CategoryOut


class ProductListOut(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    page_size: int

class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    image_url: str | None = None
    stock: int = 0
    category_id: int


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    image_url: str | None = None
    stock: int | None = None
    category_id: int | None = None
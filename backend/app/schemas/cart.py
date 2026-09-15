from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class CartItemProduct(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: Decimal
    image_url: str | None
    stock: int


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity: int
    product: CartItemProduct
    line_total: Decimal


class CartOut(BaseModel):
    items: list[CartItemOut]
    subtotal: Decimal
    total_items: int


class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int
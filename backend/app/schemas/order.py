from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    product_name: str
    price: Decimal
    quantity: int
    line_total: Decimal


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    total: Decimal
    created_at: datetime
    items: list[OrderItemOut]


class OrderListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    total: Decimal
    created_at: datetime
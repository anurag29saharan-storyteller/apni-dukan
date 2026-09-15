from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.deps import get_session, require_admin
from app.models import Product, Category, Order, OrderItem, User
from app.schemas import (
    ProductOut,
    ProductCreate,
    ProductUpdate,
    OrderOut,
    OrderListOut,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# ---- Products ----

@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(require_admin),
):
    category = await session.get(Category, data.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")
    product = Product(**data.model_dump())
    session.add(product)
    await session.commit()
    stmt = (
        select(Product).options(selectinload(Product.category)).where(Product.id == product.id)
    )
    product = (await session.execute(stmt)).scalar_one()
    return product


@router.patch("/products/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(require_admin),
):
    product = await session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    await session.commit()
    stmt = (
        select(Product).options(selectinload(Product.category)).where(Product.id == product.id)
    )
    product = (await session.execute(stmt)).scalar_one()
    return product


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(require_admin),
):
    product = await session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await session.delete(product)
    await session.commit()


# ---- Orders ----

@router.get("/orders", response_model=list[OrderListOut])
async def admin_list_orders(
    session: AsyncSession = Depends(get_session),
    _: User = Depends(require_admin),
):
    stmt = select(Order).order_by(Order.created_at.desc())
    return (await session.execute(stmt)).scalars().all()


@router.get("/orders/{order_id}", response_model=OrderOut)
async def admin_get_order(
    order_id: int,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(require_admin),
):
    stmt = select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
    order = (await session.execute(stmt)).scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


VALID_STATUSES = {"PLACED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"}


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: int,
    status_value: str,
    session: AsyncSession = Depends(get_session),
    _: User = Depends(require_admin),
):
    if status_value not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    stmt = select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
    order = (await session.execute(stmt)).scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_value
    await session.commit()
    return order


# ---- Dashboard stats ----

@router.get("/stats")
async def admin_stats(
    session: AsyncSession = Depends(get_session),
    _: User = Depends(require_admin),
):
    total_products = (await session.execute(select(func.count()).select_from(Product))).scalar_one()
    total_orders = (await session.execute(select(func.count()).select_from(Order))).scalar_one()
    total_revenue = (
        await session.execute(
            select(func.coalesce(func.sum(Order.total), 0)).where(Order.status != "CANCELLED")
        )
    ).scalar_one()

    low_stock_stmt = select(Product).where(Product.stock < 10).order_by(Product.stock).limit(10)
    low_stock = (await session.execute(low_stock_stmt)).scalars().all()

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": str(total_revenue),
        "low_stock": [
            {"id": p.id, "name": p.name, "stock": p.stock} for p in low_stock
        ],
    }
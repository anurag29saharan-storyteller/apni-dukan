from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.deps import get_session, get_current_user
from app.models import Cart, CartItem, Order, OrderItem, User
from app.schemas import OrderOut, OrderListOut

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def checkout(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    cart_res = await session.execute(select(Cart).where(Cart.user_id == user.id))
    cart = cart_res.scalar_one_or_none()
    if cart is None:
        raise HTTPException(status_code=400, detail="Cart is empty")

    items_res = await session.execute(
        select(CartItem)
        .options(selectinload(CartItem.product))
        .where(CartItem.cart_id == cart.id)
    )
    cart_items = items_res.scalars().all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    for item in cart_items:
        if item.product is None:
            raise HTTPException(status_code=400, detail="Product no longer available")
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {item.product.name} "
                       f"(available: {item.product.stock})",
            )

    total = Decimal("0")
    order = Order(user_id=user.id, status="PLACED", total=Decimal("0"))
    session.add(order)
    await session.flush()

    for item in cart_items:
        line_total = item.product.price * item.quantity
        total += line_total
        session.add(
            OrderItem(
                order_id=order.id,
                product_id=item.product.id,
                product_name=item.product.name,
                price=item.product.price,
                quantity=item.quantity,
                line_total=line_total,
            )
        )
        item.product.stock -= item.quantity

    order.total = total

    for item in cart_items:
        await session.delete(item)

    await session.commit()

    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order.id)
    )
    order = (await session.execute(stmt)).scalar_one()
    return order


@router.get("", response_model=list[OrderListOut])
async def list_orders(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(Order)
        .where(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
    )
    orders = (await session.execute(stmt)).scalars().all()
    return orders


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id, Order.user_id == user.id)
    )
    order = (await session.execute(stmt)).scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
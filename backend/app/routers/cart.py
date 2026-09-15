from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.deps import get_session, get_current_user
from app.models import Cart, CartItem, Product, User
from app.schemas import CartOut, CartItemAdd, CartItemUpdate

router = APIRouter(prefix="/cart", tags=["cart"])


async def get_or_create_cart(session: AsyncSession, user: User) -> Cart:
    result = await session.execute(select(Cart).where(Cart.user_id == user.id))
    cart = result.scalar_one_or_none()
    if cart is None:
        cart = Cart(user_id=user.id)
        session.add(cart)
        await session.commit()
        await session.refresh(cart)
    return cart


async def build_cart_response(session: AsyncSession, cart_id: int) -> CartOut:
    stmt = (
        select(CartItem)
        .options(selectinload(CartItem.product))
        .where(CartItem.cart_id == cart_id)
        .order_by(CartItem.id)
    )
    items = (await session.execute(stmt)).scalars().all()

    out_items = []
    subtotal = Decimal("0")
    total_qty = 0
    for item in items:
        line_total = item.product.price * item.quantity
        subtotal += line_total
        total_qty += item.quantity
        out_items.append({
            "id": item.id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "product": item.product,
            "line_total": line_total,
        })

    return {"items": out_items, "subtotal": subtotal, "total_items": total_qty}


@router.get("", response_model=CartOut)
async def get_cart(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    cart = await get_or_create_cart(session, user)
    return await build_cart_response(session, cart.id)


@router.post("/items", response_model=CartOut)
async def add_item(
    data: CartItemAdd,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    product = await session.get(Product, data.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if data.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    cart = await get_or_create_cart(session, user)

    stmt = select(CartItem).where(
        CartItem.cart_id == cart.id, CartItem.product_id == data.product_id
    )
    existing = (await session.execute(stmt)).scalar_one_or_none()

    if existing:
        existing.quantity += data.quantity
    else:
        session.add(CartItem(cart_id=cart.id, product_id=data.product_id, quantity=data.quantity))

    await session.commit()
    return await build_cart_response(session, cart.id)


@router.patch("/items/{item_id}", response_model=CartOut)
async def update_item(
    item_id: int,
    data: CartItemUpdate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    if data.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    cart = await get_or_create_cart(session, user)
    item = await session.get(CartItem, item_id)
    if not item or item.cart_id != cart.id:
        raise HTTPException(status_code=404, detail="Cart item not found")

    item.quantity = data.quantity
    await session.commit()
    return await build_cart_response(session, cart.id)


@router.delete("/items/{item_id}", response_model=CartOut)
async def remove_item(
    item_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    cart = await get_or_create_cart(session, user)
    item = await session.get(CartItem, item_id)
    if not item or item.cart_id != cart.id:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await session.delete(item)
    await session.commit()
    return await build_cart_response(session, cart.id)
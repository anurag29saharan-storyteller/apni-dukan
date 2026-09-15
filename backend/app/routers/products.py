from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import AsyncSessionLocal
from app.models import Product, Category
from app.schemas import ProductOut, ProductListOut

router = APIRouter(prefix="/products", tags=["products"])


async def get_session():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("", response_model=ProductListOut)
async def list_products(
    search: str | None = Query(None),
    category: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Product).options(selectinload(Product.category))

    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(
            or_(Product.name.ilike(pattern), Product.description.ilike(pattern))
        )

    if category:
        stmt = stmt.join(Category).where(Category.name.ilike(category))

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await session.execute(count_stmt)).scalar_one()

    stmt = stmt.order_by(Product.id).offset((page - 1) * page_size).limit(page_size)
    items = (await session.execute(stmt)).scalars().all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, session: AsyncSession = Depends(get_session)):
    stmt = (
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.id == product_id)
    )
    product = (await session.execute(stmt)).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
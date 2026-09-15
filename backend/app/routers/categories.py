from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import Category
from app.schemas import CategoryOut

router = APIRouter(prefix="/categories", tags=["categories"])


async def get_session():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("", response_model=list[CategoryOut])
async def list_categories(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Category).order_by(Category.name))
    return result.scalars().all()
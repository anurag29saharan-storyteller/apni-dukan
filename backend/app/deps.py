from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import User
from app.security import decode_token

bearer = HTTPBearer(auto_error=False)


async def get_session():
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    session: AsyncSession = Depends(get_session),
) -> User:
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_token(creds.credentials)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await session.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user
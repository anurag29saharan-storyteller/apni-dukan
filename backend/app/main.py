from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import AsyncSessionLocal
from app.routers import categories, products, auth, cart, orders, admin
from app.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/db-health")
async def db_health():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT 1"))
        value = result.scalar()
    return {"database": "connected", "result": value}
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)
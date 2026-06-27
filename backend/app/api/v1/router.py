from fastapi import APIRouter

from app.api.v1.endpoints import health
from app.auth.router import router as auth_router

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])

# Add future routers here, e.g.:
# api_router.include_router(users.router, prefix="/users", tags=["users"])

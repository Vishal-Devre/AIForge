from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/")
def health_check():
    """
    Check if the service is running.
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }

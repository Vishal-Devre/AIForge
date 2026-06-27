from fastapi import APIRouter, Depends
from app.auth.schemas import UserResponse
from app.models.user import User
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get the currently authenticated user's profile.
    
    This endpoint verifies the Supabase JWT token via the `get_current_user` dependency,
    extracts the payload, ensures the user exists in the local database (creating them if not),
    and returns their profile information.
    """
    return current_user

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.auth.dependencies import require_superuser
from app.models.user import User
from app.schemas.user import UserAdminListResponse, UserAdminResponse, UserStatsResponse
from app.services.user import get_all_users, get_user_stats

router = APIRouter()


@router.get("", response_model=UserAdminListResponse)
def list_users(
    search: str = Query(None, description="Search by name or email"),
    role: str = Query(None, description="Filter by role (ADMIN, CUSTOMER)"),
    current_user: User = Depends(require_superuser),
    db: Session = Depends(get_db),
):
    """
    List all users. Requires superuser privileges.
    """
    users = get_all_users(db, search=search, role=role)
    return UserAdminListResponse(items=users, total=len(users))


@router.get("/stats", response_model=UserStatsResponse)
def get_users_stats(
    current_user: User = Depends(require_superuser),
    db: Session = Depends(get_db),
):
    """
    Get user statistics. Requires superuser privileges.
    """
    return get_user_stats(db)

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.user import UserRole


class UserAdminResponse(BaseModel):
    """
    Schema for serializing User data for admin management.
    Includes all fields safe to expose to administrators.
    """
    id: uuid.UUID
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    role: UserRole
    is_superuser: bool
    provider: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserAdminListResponse(BaseModel):
    """
    Paginated list of users returned by admin list endpoint.
    """
    items: list[UserAdminResponse] = Field(
        default_factory=list,
        description="List of users",
    )
    total: int = Field(
        ...,
        description="Total number of users matching the query",
    )


class UserStatsResponse(BaseModel):
    """
    User statistics for admin dashboard.
    """
    total: int = Field(..., description="Total number of users")
    admin_count: int = Field(..., description="Number of admin users")
    superuser_count: int = Field(..., description="Number of superusers")
    active_count: int = Field(..., description="Number of active users")
    inactive_count: int = Field(..., description="Number of inactive/suspended users")

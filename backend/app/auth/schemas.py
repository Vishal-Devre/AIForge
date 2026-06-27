import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.user import UserRole

class UserResponse(BaseModel):
    """
    Pydantic schema for serializing User model responses safely.
    """
    id: uuid.UUID
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None
    role: UserRole
    provider: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    # Tells Pydantic to read data even if it is not a dict, but an ORM model
    model_config = ConfigDict(from_attributes=True)

import uuid
from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Boolean, DateTime, Enum, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.agent import Agent


class UserRole(str, PyEnum):
    """
    Enumeration of user roles for Role-Based Access Control (RBAC).
    Inherits from str to ensure easy JSON serialization.
    """
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"


class User(Base):
    """
    User Model mapping to the 'users' table.
    Designed to be extensible for OAuth, generic authentication, and future permissions.
    """
    __tablename__ = "users"

    # Primary Key: UUID provides secure, distributed, and non-sequential identifiers
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, 
        primary_key=True, 
        default=uuid.uuid4, 
        index=True
    )

    # Basic Identity Information
    full_name: Mapped[str] = mapped_column(String(255))
    
    # Email is indexed and unique for fast lookups and secure identity management
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    
    # Nullable profile picture URL
    avatar_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)

    # Role-Based Access Control
    # native_enum=False creates a VARCHAR column rather than a Postgres ENUM.
    # This simplifies database migrations if new roles are added later.
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, native_enum=False), 
        default=UserRole.CUSTOMER
    )

    # Superuser Flag (Replaces .env email checking)
    is_superuser: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="false"
    )

    # Identity Provider Source (e.g., "google")
    provider: Mapped[str] = mapped_column(String(50), default="google")

    # Soft-delete / account suspension flag
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Auditing: Timezone-aware timestamps securely managed by the database
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    
    # onupdate automatically refreshes the timestamp whenever the row is modified
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )

    # ---- ORM Relationships ----

    # Collection of agents owned by this user.
    # The `agents` attribute provides access to all Agent instances belonging to this user.
    agents: Mapped[List["Agent"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
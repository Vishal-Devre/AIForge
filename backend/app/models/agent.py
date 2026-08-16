import uuid
from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, Float, Integer, DateTime, Enum, ForeignKey, Index, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Visibility(str, PyEnum):
    """
    Enumeration of agent visibility levels.
    Inherits from str to ensure easy JSON serialization.
    """
    PRIVATE = "PRIVATE"
    PUBLIC = "PUBLIC"


class Status(str, PyEnum):
    """
    Enumeration of agent lifecycle statuses.
    Tracks the deployment state of an agent.
    """
    DRAFT = "DRAFT"
    READY = "READY"
    DEPLOYED = "DEPLOYED"
    ARCHIVED = "ARCHIVED"


class Provider(str, PyEnum):
    """
    Enumeration of supported AI model providers.
    """
    OPENAI = "OPENAI"
    ANTHROPIC = "ANTHROPIC"
    GOOGLE = "GOOGLE"
    GROQ = "GROQ"
    OLLAMA = "OLLAMA"


class Agent(Base):
    """
    Agent Model mapping to the 'agents' table.

    Represents an AI assistant created by a user. Each agent is owned
    by exactly one user and encapsulates the configuration needed to
    deploy and interact with a specific AI model.
    """
    __tablename__ = "agents"

    __table_args__ = (
        # Composite index on (owner_id, status) for efficient filtered queries
        # such as "fetch all deployed/ready agents belonging to this user"
        Index("ix_agents_owner_id_status", "owner_id", "status"),
    )

    # Primary Key: UUID provides secure, distributed, and non-sequential identifiers
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    # Foreign Key: Each agent belongs to exactly one user.
    # Indexed for efficient lookups by owner (common query pattern).
    owner_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Basic Identity Information
    # Indexed for fast search-by-name queries (common user workflow)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    # Optional verbose description of the agent's purpose
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # AI Provider Configuration
    # native_enum=False creates a VARCHAR column for database portability
    provider: Mapped[Provider] = mapped_column(
        Enum(Provider, native_enum=False),
        nullable=False,
        default=Provider.OPENAI,
    )

    # Model identifier (e.g., "gpt-4", "claude-3-opus-20240229", "gemini-pro")
    model: Mapped[str] = mapped_column(String(255), nullable=False)

    # System prompt defines the base personality and instructions for the agent
    system_prompt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Model Hyperparameters
    temperature: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.7,
        server_default="0.7",
    )

    max_tokens: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        default=4096,
        server_default="4096",
    )

    # Visibility & Status
    visibility: Mapped[Visibility] = mapped_column(
        Enum(Visibility, native_enum=False),
        nullable=False,
        default=Visibility.PRIVATE,
    )

    status: Mapped[Status] = mapped_column(
        Enum(Status, native_enum=False),
        nullable=False,
        default=Status.DRAFT,
    )

    # Auditing: Timezone-aware timestamps securely managed by the database
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # onupdate automatically refreshes the timestamp whenever the row is modified
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # ---- ORM Relationships ----

    # Back-reference to the owning User.
    # The `owner` attribute provides access to the User instance that owns this agent.
    owner: Mapped["User"] = relationship(back_populates="agents")

    def __repr__(self) -> str:
        return f"<Agent(id={self.id}, name='{self.name}', owner_id={self.owner_id}, status={self.status})>"

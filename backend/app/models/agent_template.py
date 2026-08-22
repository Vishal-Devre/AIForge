import uuid
from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, Float, Integer, Boolean, DateTime, Enum, ForeignKey, Index, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.agent import Provider, Visibility

if TYPE_CHECKING:
    from app.models.user import User


class ModerationStatus(str, PyEnum):
    """
    Enumeration of template moderation states for the public template gallery.

    Lifecycle:
        PENDING  -> Template awaiting review (required before public listing)
        APPROVED -> Reviewed and allowed in the public gallery
        REJECTED -> Reviewed and denied public listing
        HIDDEN   -> Previously approved, temporarily removed by moderators
    """
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    HIDDEN = "HIDDEN"


class AgentTemplate(Base):
    """
    AgentTemplate Model mapping to the 'agent_templates' table.

    Represents a reusable blueprint for creating Agents. A template captures
    the full AI configuration (provider, model, prompt, hyperparameters) so
    that any user can instantiate a pre-configured agent from it.

    Templates may be personal (private) or shared with the community (public),
    in which case they pass through a moderation workflow before appearing
    in the public gallery. Official templates are curated by the platform.
    """
    __tablename__ = "agent_templates"

    __table_args__ = (
        # Single-column indexes for the dominant filtered-query patterns:
        # - owner_id:      "fetch my templates"
        # - category:      gallery browsing by category
        # - visibility:    public/private filtering
        # - moderation_status: moderator queues & gallery eligibility checks
        Index("ix_agent_templates_owner_id", "owner_id"),
        Index("ix_agent_templates_category", "category"),
        Index("ix_agent_templates_visibility", "visibility"),
        Index("ix_agent_templates_moderation_status", "moderation_status"),
    )

    # Primary Key: UUID provides secure, distributed, and non-sequential identifiers
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    # Foreign Key: The user who created the template.
    # Nullable: official platform templates have no individual owner.
    # ON DELETE SET NULL: deleting a user preserves their published templates.
    # NOTE: Deliberately NOT "CASCADE"/"delete-orphan" here — templates must
    # survive their creator's account deletion.
    owner_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Basic Identity Information
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Optional verbose description of what the template builds
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # AI Provider Configuration (reuses the existing Provider enum from Agent)
    # native_enum=False creates a VARCHAR column for database portability
    provider: Mapped[Provider] = mapped_column(
        Enum(Provider, native_enum=False),
        nullable=False,
        default=Provider.OPENAI,
    )

    # Model identifier (e.g., "gpt-4", "claude-3-opus-20240229", "gemini-pro")
    model: Mapped[str] = mapped_column(String(255), nullable=False)

    # System prompt defines the base personality and instructions for agents
    # created from this template
    system_prompt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Model Hyperparameters (defaults mirror the Agent model so cloned agents behave identically)
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

    # Visibility & Curation
    visibility: Mapped[Visibility] = mapped_column(
        Enum(Visibility, native_enum=False),
        nullable=False,
        default=Visibility.PRIVATE,
    )

    # Gallery grouping key (e.g., "productivity", "coding", "writing")
    category: Mapped[str] = mapped_column(String(64), nullable=False)

    # Official templates are curated/maintained by the platform itself
    is_official: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="false",
    )

    # Moderation workflow state; public gallery listings require APPROVED
    moderation_status: Mapped[ModerationStatus] = mapped_column(
        Enum(ModerationStatus, native_enum=False),
        nullable=False,
        default=ModerationStatus.PENDING,
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

    # Back-reference to the authoring User (None for official platform templates).
    owner: Mapped[Optional["User"]] = relationship(back_populates="agent_templates")

    def __repr__(self) -> str:
        return (
            f"<AgentTemplate(id={self.id}, name='{self.name}', "
            f"owner_id={self.owner_id}, visibility={self.visibility}, "
            f"moderation_status={self.moderation_status})>"
        )

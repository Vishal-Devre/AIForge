import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.agent import Visibility, Status, Provider


class CreateAgentRequest(BaseModel):
    """
    Schema for creating a new agent.
    Only user-supplied fields are required; server-managed fields (id, owner_id, status, timestamps) are excluded.
    """
    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Human-readable name for the agent",
    )
    description: Optional[str] = Field(
        None,
        max_length=5000,
        description="Optional verbose description of the agent's purpose",
    )
    provider: Provider = Field(
        default=Provider.OPENAI,
        description="AI model provider (e.g., OPENAI, ANTHROPIC, GOOGLE)",
    )
    model: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Model identifier (e.g., 'gpt-4', 'claude-3-opus-20240229')",
    )
    system_prompt: Optional[str] = Field(
        None,
        max_length=100000,
        description="Base personality and instructions for the agent",
    )
    temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="Model temperature (0.0 = deterministic, 2.0 = creative)",
    )
    max_tokens: Optional[int] = Field(
        default=4096,
        ge=1,
        le=1048576,
        description="Maximum tokens per response",
    )
    visibility: Visibility = Field(
        default=Visibility.PRIVATE,
        description="Agent visibility level (PRIVATE or PUBLIC)",
    )


class UpdateAgentRequest(BaseModel):
    """
    Schema for partially updating an existing agent.
    All fields are optional — only supplied fields are applied.
    Server-managed fields (id, owner_id, status, created_at, updated_at) are excluded.
    """
    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Human-readable name for the agent",
    )
    description: Optional[str] = Field(
        None,
        max_length=5000,
        description="Optional verbose description of the agent's purpose",
    )
    provider: Optional[Provider] = Field(
        None,
        description="AI model provider (e.g., OPENAI, ANTHROPIC, GOOGLE)",
    )
    model: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Model identifier (e.g., 'gpt-4', 'claude-3-opus-20240229')",
    )
    system_prompt: Optional[str] = Field(
        None,
        max_length=100000,
        description="Base personality and instructions for the agent",
    )
    temperature: Optional[float] = Field(
        None,
        ge=0.0,
        le=2.0,
        description="Model temperature (0.0 = deterministic, 2.0 = creative)",
    )
    max_tokens: Optional[int] = Field(
        None,
        ge=1,
        le=1048576,
        description="Maximum tokens per response",
    )
    visibility: Optional[Visibility] = Field(
        None,
        description="Agent visibility level (PRIVATE or PUBLIC)",
    )


class AgentResponse(BaseModel):
    """
    Schema for serializing Agent model responses.
    Includes all fields that are safe to expose to the client.
    """
    id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    description: Optional[str] = None
    provider: Provider
    model: str
    system_prompt: Optional[str] = None
    temperature: float
    max_tokens: Optional[int] = None
    visibility: Visibility
    status: Status
    created_at: datetime
    updated_at: datetime

    # Tells Pydantic to read data even if it is not a dict, but an ORM model
    model_config = ConfigDict(from_attributes=True)


class AgentListResponse(BaseModel):
    """
    Paginated list of agents returned by list endpoints.
    Matches the frontend AgentListResponse contract: { items: Agent[], total: number }.
    """
    items: list[AgentResponse] = Field(
        default_factory=list,
        description="List of agents for the current page",
    )
    total: int = Field(
        ...,
        description="Total number of agents matching the query",
    )

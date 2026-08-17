import uuid
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.agent import Agent
from app.schemas.agent import CreateAgentRequest, UpdateAgentRequest


def get_agent_by_id(db: Session, agent_id: uuid.UUID) -> Optional[Agent]:
    """
    Retrieve a single agent by its primary key (UUID).
    Returns None if no agent with the given ID exists.
    """
    return db.query(Agent).filter(Agent.id == agent_id).first()


def get_agents_by_owner(db: Session, owner_id: uuid.UUID) -> list[Agent]:
    """
    Retrieve all agents owned by a specific user, ordered by created_at descending.
    """
    return (
        db.query(Agent)
        .filter(Agent.owner_id == owner_id)
        .order_by(desc(Agent.created_at))
        .all()
    )


def create_agent(db: Session, owner_id: uuid.UUID, data: CreateAgentRequest) -> Agent:
    """
    Create a new agent for the given owner.
    All configurable fields are sourced from the validated `CreateAgentRequest` schema.
    """
    agent = Agent(
        owner_id=owner_id,
        name=data.name,
        description=data.description,
        provider=data.provider,
        model=data.model,
        system_prompt=data.system_prompt,
        temperature=data.temperature,
        max_tokens=data.max_tokens,
        visibility=data.visibility,
    )

    db.add(agent)
    db.commit()
    db.refresh(agent)

    return agent


def update_agent(db: Session, agent: Agent, data: UpdateAgentRequest) -> Agent:
    """
    Apply partial updates to an existing agent.
    Only fields explicitly supplied by the client are updated.
    Server-managed fields (id, owner_id, status, created_at, updated_at) are never modified here.
    """
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)

    db.commit()
    db.refresh(agent)

    return agent


def delete_agent(db: Session, db_agent: Agent) -> None:
    """
    Permanently delete an agent from the database.
    """
    db.delete(db_agent)
    db.commit()

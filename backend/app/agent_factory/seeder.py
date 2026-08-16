"""
Seeding engine for the AgentFactory.

Provides functions to populate the database with demo agents, clear them,
and optionally run from the command line or a FastAPI startup hook.
"""

import uuid
from typing import Optional

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.agent import Agent
from app.models.user import User
from app.agent_factory.seed_data import SEED_AGENTS


def seed_agents_for_user(
    db: Session,
    owner_id: uuid.UUID,
    *,
    clear_existing: bool = False,
) -> list[Agent]:
    """
    Seed all demo agents for a specific user.

    Args:
        db: Active database session.
        owner_id: UUID of the user who will own the seeded agents.
        clear_existing: If True, delete any existing agents owned by this user
                        before seeding (useful for re-seeding).

    Returns:
        List of created Agent ORM instances.
    """
    if clear_existing:
        db.query(Agent).filter(Agent.owner_id == owner_id).delete()
        db.flush()

    created: list[Agent] = []

    for data in SEED_AGENTS:
        agent = Agent(
            owner_id=owner_id,
            name=data["name"],
            description=data["description"],
            provider=data["provider"],
            model=data["model"],
            system_prompt=data["system_prompt"],
            temperature=data["temperature"],
            max_tokens=data["max_tokens"],
            visibility=data["visibility"],
            status=data["status"],
        )
        db.add(agent)
        created.append(agent)

    db.commit()

    # Refresh all instances so computed fields (id, created_at, updated_at) are populated
    for agent in created:
        db.refresh(agent)

    return created


def seed_agents(
    db: Session,
    owner_email: Optional[str] = None,
    *,
    clear_existing: bool = False,
) -> list[Agent]:
    """
    Seed demo agents, optionally for a specific user identified by email.

    Args:
        db: Active database session.
        owner_email: Email of the user to assign agents to. If None, uses the
                     first user in the database.
        clear_existing: If True, delete existing agents before seeding.

    Returns:
        List of created Agent ORM instances.

    Raises:
        ValueError: If no users exist in the database.
    """
    query = db.query(User)

    if owner_email:
        user = query.filter(User.email == owner_email).first()
        if not user:
            raise ValueError(f"User with email '{owner_email}' not found. Ensure the user exists in the database first.")
    else:
        user = query.first()
        if not user:
            raise ValueError(
                "No users found in the database. "
                "Authenticate at least once via the /auth/me endpoint before seeding."
            )

    return seed_agents_for_user(db, user.id, clear_existing=clear_existing)


def clear_seed_agents(db: Session) -> int:
    """
    Remove all agents that match the known seed agent names.
    This is a targeted cleanup that only deletes agents whose names
    appear in the SEED_AGENTS catalog.

    Args:
        db: Active database session.

    Returns:
        Number of agents deleted.
    """
    seed_names = [a["name"] for a in SEED_AGENTS]
    deleted = db.query(Agent).filter(Agent.name.in_(seed_names)).delete(synchronize_session="fetch")
    db.commit()
    return deleted


def get_seed_count() -> int:
    """
    Return the number of seed agent definitions available.
    Useful for displaying progress during seeding operations.
    """
    return len(SEED_AGENTS)


# ---------------------------------------------------------------------------
# Standalone CLI entry point
# Usage:
#   python -m app.agent_factory.seeder
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    print(f"🌱 AgentFactory — Seeding {get_seed_count()} demo agents...\n")

    db = SessionLocal()
    try:
        agents = seed_agents(db, clear_existing=True)
        print(f"✅ Successfully seeded {len(agents)} agents:\n")
        for a in agents:
            print(f"   • {a.name:35s} | {a.provider.value:10s} | {a.status.value:10s} | {a.visibility.value}")
        print(f"\n✨ Done. Agents can now be queried via GET /api/v1/agents")
    except ValueError as e:
        print(f"❌ {e}")
        sys.exit(1)
    finally:
        db.close()

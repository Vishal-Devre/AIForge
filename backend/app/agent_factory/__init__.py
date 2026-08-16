"""
AgentFactory — Seed data and seeding utilities for the Agent module.

Provides a curated catalog of demo agents covering all providers (OpenAI,
Anthropic, Google, Groq, Ollama), lifecycle statuses, and visibility levels.

Usage:
    from app.agent_factory import seed_agents, seed_agents_for_user, clear_seed_agents

    # Seed for the first user in the database
    agents = seed_agents(db, clear_existing=True)

    # Seed for a specific user by email
    agents = seed_agents(db, owner_email="admin@example.com")

    # Seed for a specific user by UUID
    agents = seed_agents_for_user(db, user_id, clear_existing=True)

    # Remove all seeded agents
    count = clear_seed_agents(db)
"""

from app.agent_factory.seeder import (
    seed_agents,
    seed_agents_for_user,
    clear_seed_agents,
    get_seed_count,
)
from app.agent_factory.seed_data import SEED_AGENTS

__all__ = [
    "SEED_AGENTS",
    "seed_agents",
    "seed_agents_for_user",
    "clear_seed_agents",
    "get_seed_count",
]

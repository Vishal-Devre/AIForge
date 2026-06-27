from sqlalchemy import create_engine

from app.core.config import settings

# Create a SQLAlchemy Engine with production-ready connection pooling configurations.
# 
# Connection Pooling Best Practices:
# - pool_size: The baseline number of connections kept open in the pool.
# - max_overflow: Additional connections allowed when the pool is full.
# - pool_timeout: How long to wait (in seconds) for a connection to become available before raising an error.
# - pool_recycle: Recycles connections after a certain time (e.g., 1800s / 30m) to prevent database timeouts or stale connections.
# - pool_pre_ping: Issues a simple "SELECT 1" (or equivalent) before checking out a connection to ensure it's still alive.
#
# Note: For async database operations (e.g., with asyncpg), you would use `create_async_engine` 
# from `sqlalchemy.ext.asyncio` instead of `create_engine`.

engine = create_engine(
    settings.DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
    echo=False  # Set to True to log SQL queries during development/debugging
)

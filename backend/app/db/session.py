from sqlalchemy.orm import sessionmaker

from app.db.database import engine

# Create a session factory using sessionmaker.
# 
# Best Practices Configuration:
# - autocommit=False: Sessions should not auto-commit by default. This allows us to group
#   database operations into a single transaction and commit explicitly, ensuring data 
#   integrity and allowing for rollback if an error occurs.
# - autoflush=False: Disabling auto-flush prevents SQLAlchemy from automatically pushing
#   pending changes to the database before every query. This gives us explicit control 
#   over when data is synchronized, which avoids unexpected behaviors and optimizes performance.
# - bind=engine: Binds this session factory to our production-configured database engine.

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    """
    FastAPI dependency that yields a database session.
    
    This function creates a new SQLAlchemy SessionLocal that will be used for a 
    single request, and then closes it once the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

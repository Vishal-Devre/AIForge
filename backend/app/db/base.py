from sqlalchemy.orm import DeclarativeBase

# The DeclarativeBase class is the foundation for all SQLAlchemy ORM models.
# By inheriting from this class, your Python classes will automatically be mapped 
# to database tables. 
#
# This class-based approach is the standard for SQLAlchemy 2.0+ as it provides 
# native support for type checkers (like mypy) and modern IDE autocomplete.

class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy declarative models.
    
    All future database models in the application should inherit from this class.
    It serves as the central registry for all models in the application.
    """
    pass

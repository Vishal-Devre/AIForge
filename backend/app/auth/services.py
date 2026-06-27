import uuid
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.core.config import settings

def get_or_create_user(
    db: Session, 
    id: uuid.UUID,
    email: str, 
    full_name: str, 
    avatar_url: str = None, 
    provider: str = "email"
) -> User:
    """
    Checks if a user exists by ID or email. If they do not exist, creates a new user 
    using the exact UUID provided by Supabase.
    Automatically assigns the ADMIN role if the email matches ADMIN_EMAIL in settings.
    """
    # 1. Try to find the user by ID
    user = db.query(User).filter(User.id == id).first()
    
    if not user:
        # 2. Fallback: check by email in case the ID wasn't mapped yet
        user = db.query(User).filter(User.email == email).first()
        
    if user:
        # Return existing user
        return user
        
    # User does not exist, determine role based on configuration
    role = UserRole.ADMIN if email == settings.ADMIN_EMAIL else UserRole.CUSTOMER
    
    # Create new user record ensuring the Supabase Auth ID matches our Database ID
    new_user = User(
        id=id,
        email=email,
        full_name=full_name,
        avatar_url=avatar_url,
        role=role,
        provider=provider
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

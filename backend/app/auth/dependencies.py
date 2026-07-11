import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from supabase import create_client, Client

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.auth.services import get_or_create_user

# We use HTTPBearer instead of OAuth2PasswordBearer because Supabase handles the actual OAuth flow.
# The client just needs to send the Bearer token in the Authorization header.
security = HTTPBearer()

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency to get the current authenticated user.
    Verifies the JWT token using the Supabase Python client and retrieves or creates the user.
    """
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify the JWT using Supabase Auth
        # This makes a secure verification call or decodes using Supabase's internal mechanisms
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise credentials_exception
            
        sb_user = user_response.user
        
        email = sb_user.email
        if not email:
            raise credentials_exception
            
        # Parse Supabase string ID into UUID
        user_id = uuid.UUID(sb_user.id)
        
        # Extract metadata
        user_metadata = sb_user.user_metadata or {}
        app_metadata = sb_user.app_metadata or {}
        
        full_name = user_metadata.get("full_name") or user_metadata.get("name") or "Unknown User"
        avatar_url = user_metadata.get("avatar_url") or user_metadata.get("picture")
        provider = app_metadata.get("provider", "email")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Delegate to the service layer to get or create the user in our database
    user = get_or_create_user(
        db=db, 
        id=user_id,
        email=email, 
        full_name=full_name, 
        avatar_url=avatar_url,
        provider=provider
    )
    
    # Check for soft deletion or suspended accounts
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return user

def require_superuser(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to enforce that the current user is a super administrator.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superuser privileges required"
        )
    return current_user

def require_customer(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Future dependency: enforce that the current user is a customer or higher.
    """
    # Assuming all valid users have at least customer privileges for now
    return current_user

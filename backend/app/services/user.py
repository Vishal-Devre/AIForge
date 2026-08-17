from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.models.user import User


def get_all_users(
    db: Session,
    search: Optional[str] = None,
    role: Optional[str] = None,
) -> list[User]:
    """
    Retrieve all users, optionally filtered by search term (name/email) and role.
    Ordered by created_at descending (newest first).
    """
    query = db.query(User)

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                User.full_name.ilike(term),
                User.email.ilike(term),
            )
        )

    if role:
        query = query.filter(User.role == role)

    return query.order_by(User.created_at.desc()).all()


def get_user_stats(db: Session) -> dict:
    """
    Compute user statistics from the database.
    """
    total = db.query(func.count(User.id)).scalar() or 0
    admin_count = db.query(func.count(User.id)).filter(
        User.role.in_(["ADMIN"]),
    ).scalar() or 0
    superuser_count = db.query(func.count(User.id)).filter(
        User.is_superuser == True,
    ).scalar() or 0
    active_count = db.query(func.count(User.id)).filter(
        User.is_active == True,
    ).scalar() or 0
    inactive_count = db.query(func.count(User.id)).filter(
        User.is_active == False,
    ).scalar() or 0

    return {
        "total": total,
        "admin_count": admin_count,
        "superuser_count": superuser_count,
        "active_count": active_count,
        "inactive_count": inactive_count,
    }

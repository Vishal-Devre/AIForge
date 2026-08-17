import uuid
from typing import Optional

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from fastapi import Response

from app.db.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.agent import CreateAgentRequest, UpdateAgentRequest, AgentResponse, AgentListResponse
from app.services.agent import create_agent, get_agent_by_id, get_agents_by_owner, update_agent, delete_agent
 
router = APIRouter()

@router.get("", response_model=AgentListResponse)
def list_my_agents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve all agents owned by the current user.
    """
    agents = get_agents_by_owner(db, owner_id=current_user.id)
    return AgentListResponse(items=agents, total=len(agents))

@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
def create_new_agent(
    data: CreateAgentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new agent for the authenticated user.
    The agent is automatically owned by the current user.
    """
    agent = create_agent(db, owner_id=current_user.id, data=data)
    return agent

@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(
    agent_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve a specific agent by its UUID.
    Returns 404 if the agent does not exist or does not belong to the user.
    """
    agent = get_agent_by_id(db, agent_id)
    
    if not agent or agent.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )

    return agent

@router.patch("/{agent_id}", response_model=AgentResponse)
def update_existing_agent(
    agent_id: uuid.UUID,
    data: UpdateAgentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Partially update an existing agent.
    Only supplied fields are modified; omitted fields remain unchanged.
    Returns 404 if the agent does not exist or does not belong to the user.
    """
    agent = get_agent_by_id(db, agent_id)

    if not agent or agent.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )

    agent = update_agent(db, agent, data)
    return agent

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_agent(
    agent_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a specific agent by its UUID.
    Returns 404 if the agent does not exist or does not belong to the user.
    """
    agent = get_agent_by_id(db, agent_id)
    
    if not agent or agent.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )
        
    delete_agent(db, agent)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


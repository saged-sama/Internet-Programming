from typing import Annotated, List, Optional
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from pydantic import BaseModel

from app.models.user import User
from app.models.project import Project, ProjectTeamMember
from app.utils.auth import get_current_user
from app.utils.db import SessionDependency

router = APIRouter(prefix="/projects", tags=["projects"])

# Request models
class ProjectCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    year: int
    topic: str
    status: str
    abstract: str
    team: List[str] = []
    demoUrl: Optional[str] = None

class ProjectUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    year: Optional[int] = None
    topic: Optional[str] = None
    status: Optional[str] = None
    abstract: Optional[str] = None
    team: Optional[List[str]] = None
    demoUrl: Optional[str] = None

# Response models
class ProjectResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    supervisor: Optional[str] = None
    supervisorName: Optional[str] = None
    year: int
    topic: str
    status: str
    abstract: str
    team: List[str] = []
    demoUrl: Optional[str] = None

class ProjectsApiResponse(BaseModel):
    data: List[ProjectResponse]
    total: int
    page: Optional[int] = None
    limit: Optional[int] = None

def project_to_response(project: Project, session: SessionDependency) -> ProjectResponse:
    """Convert backend Project model to frontend ProjectResponse"""
    # Get team members
    team_members = session.exec(
        select(ProjectTeamMember).where(ProjectTeamMember.project_id == project.id)
    ).all()
    
    # Get team member names
    team_names = []
    for member in team_members:
        user = session.exec(select(User).where(User.id == member.member)).first()
        if user:
            team_names.append(f"{user.first_name} {user.last_name}")
    
    # Get supervisor name
    supervisor_name = None
    if project.supervisor:
        supervisor = session.exec(select(User).where(User.id == project.supervisor)).first()
        if supervisor:
            supervisor_name = f"{supervisor.first_name} {supervisor.last_name}"
    
    # Extract demo URL from description if present (temporary solution)
    demo_url = None
    description = project.description
    if description and "demoUrl:" in description:
        parts = description.split("demoUrl:")
        if len(parts) > 1:
            demo_url = parts[1].strip()
            description = parts[0].strip()
    
    return ProjectResponse(
        id=project.id,
        title=project.title or "",
        description=description,
        supervisor=project.supervisor,
        supervisorName=supervisor_name,
        year=project.year or 0,
        topic=project.topic or "",
        status=project.status or "",
        abstract=project.abstract or "",
        team=team_names,
        demoUrl=demo_url
    )

@router.get("/", response_model=ProjectsApiResponse)
async def get_projects(
    session: SessionDependency,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    searchQuery: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    topic: Optional[str] = Query(None),
    supervisor: Optional[str] = Query(None)
):
    """Get all projects with filtering"""
    query = select(Project)
    
    # Apply filters
    if searchQuery:
        query = query.where(
            Project.title.contains(searchQuery) |
            Project.abstract.contains(searchQuery)
        )
    
    if year:
        query = query.where(Project.year == year)
    
    if topic:
        query = query.where(Project.topic == topic)
    
    if supervisor:
        query = query.where(Project.supervisor == supervisor)
    
    # Get total count
    total = len(session.exec(query).all())
    
    # Apply pagination
    projects = session.exec(query.offset(skip).limit(limit)).all()
    
    return ProjectsApiResponse(
        data=[project_to_response(project, session) for project in projects],
        total=total,
        page=skip // limit + 1 if limit > 0 else 1,
        limit=limit
    )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, session: SessionDependency):
    """Get a specific project by ID"""
    project = session.exec(select(Project).where(Project.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project_to_response(project, session)

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreateRequest,
    session: SessionDependency,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Create a new project"""
    if not current_user or current_user.role == "student":
        raise HTTPException(status_code=403, detail="Only faculty can create projects")
    
    # Create project with demo URL in description (temporary solution)
    description = project_data.description or ""
    if project_data.demoUrl:
        description = f"{description} demoUrl:{project_data.demoUrl}"
    
    project = Project(
        id=uuid4().hex,
        title=project_data.title,
        description=description.strip() if description else None,
        supervisor=current_user.id,
        year=project_data.year,
        topic=project_data.topic,
        status=project_data.status,
        abstract=project_data.abstract
    )
    
    session.add(project)
    session.commit()
    
    # Add team members
    for member_name in project_data.team:
        # For now, we'll store member names directly
        # In a real app, you'd look up user IDs
        team_member = ProjectTeamMember(
            project_id=project.id,
            member=member_name  # This should be a user ID in production
        )
        session.add(team_member)
    
    session.commit()
    session.refresh(project)
    
    return project_to_response(project, session)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_update: ProjectUpdateRequest,
    session: SessionDependency,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Update project information"""
    project = session.exec(select(Project).where(Project.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user is the supervisor
    if project.supervisor != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the supervisor can update this project")
    
    # Update fields
    update_data = project_update.model_dump(exclude_unset=True, exclude={"team", "demoUrl"})
    
    # Handle demo URL
    if "demoUrl" in project_update.model_dump(exclude_unset=True):
        description = update_data.get("description", project.description) or ""
        if project_update.demoUrl:
            update_data["description"] = f"{description} demoUrl:{project_update.demoUrl}"
    
    for field, value in update_data.items():
        setattr(project, field, value)
    
    # Update team members if provided
    if project_update.team is not None:
        # Remove existing team members
        existing_members = session.exec(
            select(ProjectTeamMember).where(ProjectTeamMember.project_id == project_id)
        ).all()
        for member in existing_members:
            session.delete(member)
        
        # Add new team members
        for member_name in project_update.team:
            team_member = ProjectTeamMember(
                project_id=project_id,
                member=member_name
            )
            session.add(team_member)
    
    session.add(project)
    session.commit()
    session.refresh(project)
    
    return project_to_response(project, session)

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    session: SessionDependency,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Delete a project"""
    project = session.exec(select(Project).where(Project.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user is the supervisor
    if project.supervisor != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the supervisor can delete this project")
    
    # Delete team members first
    team_members = session.exec(
        select(ProjectTeamMember).where(ProjectTeamMember.project_id == project_id)
    ).all()
    for member in team_members:
        session.delete(member)
    
    # Delete project
    session.delete(project)
    session.commit()
    
    return {"message": "Project deleted successfully"}

# Additional endpoints for team management
@router.post("/{project_id}/team/{user_id}")
async def add_team_member(
    project_id: str,
    user_id: str,
    session: SessionDependency,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Add a team member to a project"""
    project = session.exec(select(Project).where(Project.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.supervisor != current_user.id:
        raise HTTPException(status_code=403, detail="Only the supervisor can add team members")
    
    # Check if member already exists
    existing = session.exec(
        select(ProjectTeamMember).where(
            ProjectTeamMember.project_id == project_id,
            ProjectTeamMember.member == user_id
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="User is already a team member")
    
    team_member = ProjectTeamMember(
        project_id=project_id,
        member=user_id
    )
    session.add(team_member)
    session.commit()
    
    return {"message": "Team member added successfully"}

@router.delete("/{project_id}/team/{user_id}")
async def remove_team_member(
    project_id: str,
    user_id: str,
    session: SessionDependency,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Remove a team member from a project"""
    project = session.exec(select(Project).where(Project.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.supervisor != current_user.id:
        raise HTTPException(status_code=403, detail="Only the supervisor can remove team members")
    
    team_member = session.exec(
        select(ProjectTeamMember).where(
            ProjectTeamMember.project_id == project_id,
            ProjectTeamMember.member == user_id
        )
    ).first()
    
    if not team_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    session.delete(team_member)
    session.commit()
    
    return {"message": "Team member removed successfully"}
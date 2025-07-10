from typing import Optional
from sqlmodel import Field, SQLModel

class Project(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: Optional[str] = None
    description: Optional[str] = None
    supervisor: Optional[str] = Field(default=None, foreign_key="user.id")
    year: Optional[int] = None
    topic: Optional[str] = None
    status: Optional[str] = None
    abstract: Optional[str] = None

class ProjectTeamMember(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: Optional[str] = Field(default=None, foreign_key="project.id")
    member: Optional[str] = Field(default=None, foreign_key="user.id")
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

class Project(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: Optional[str]
    description: Optional[str]
    supervisor: Optional[str]
    year: Optional[int]
    topic: Optional[str]
    status: Optional[str]
    abstract: Optional[str]

class ProjectTeamMember(SQLModel, table=True):
    project_id: Optional[str] = Field(foreign_key="project.id"),
    member: str = Field(foreign_key="user.id", max_length=100)
    project: Optional[Project] = Relationship(back_populates="team_members")
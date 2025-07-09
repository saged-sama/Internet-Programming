from datetime import date
from typing import List, Optional

from sqlalchemy import JSON
from sqlmodel import Column, Field, SQLModel

class Course(SQLModel, table=True):
    course_code: str = Field(primary_key=True, max_length=10)
    course_title: str
    course_description: Optional[str] = None
    course_credits: Optional[float] = None
    prerequisites: Optional[List[str]] = Field(default=None, sa_column=Column(JSON, nullable=True))

class CourseMaterial(SQLModel, table=True):
    id: str = Field(primary_key=True)
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    title: Optional[str]
    type: Optional[str]
    description: Optional[str]
    upload_date: Optional[date]
    file_url: Optional[str]
    file_type: Optional[str]
    file_size: Optional[str]
    uploaded_by: Optional[str] = Field(foreign_key="user.id")
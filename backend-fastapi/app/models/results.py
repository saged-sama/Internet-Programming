from datetime import date
from fastapi import UploadFile
from sqlmodel import SQLModel, Field

from app.models.course import CourseSemester

class Results(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    title: str
    year: str
    semester: CourseSemester
    file: str
    created_at: date = Field(default_factory=date.today)
    updated_at: date = Field(default_factory=date.today)
    published_by: str = Field(default=None, foreign_key="user.id")

class ResultsReadQuery(SQLModel):
    year: str | None = None
    semester: CourseSemester | None = None
    student_id: str | None = None

class ResultsCreate(SQLModel):
    title: str
    file: UploadFile

class ResultsUpdate(SQLModel):
    title: str | None = None
    file: UploadFile | None = None
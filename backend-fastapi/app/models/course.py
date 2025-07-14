from datetime import date
from typing import Optional, List
from uuid import UUID, uuid4
from fastapi import UploadFile
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, JSON, Column
from enum import Enum

class CourseType(str, Enum):
    Core = "Core"
    Elective = "Elective"
    Lab = "Lab"

class CourseDegreeLevel(str, Enum):
    undergraduate = "undergraduate"
    graduate = "graduate"
    doctorate = "doctorate"
    all = "all"

class CourseSemester(str, Enum):
    first = "1st"
    second = "2nd"
    third = "3rd"
    fourth = "4th"
    fifth = "5th"
    sixth = "6th"
    seventh = "7th"
    eighth = "8th"

class Course(SQLModel, table=True):
    course_code: str = Field(primary_key=True, max_length=10)
    course_title: str
    course_description: Optional[str] = None
    course_credits: Optional[float] = None
    degree_level: Optional[CourseDegreeLevel] = None
    semester: Optional[CourseSemester] = None
    instructor: Optional[str] = Field(default=None, foreign_key="user.id")
    prerequisites: Optional[List[str]] = Field(default=[], sa_column=Column(JSON))
    topics: Optional[List[str]] = Field(default=[], sa_column=Column(JSON))
    objectives: Optional[List[str]] = Field(default=[], sa_column=Column(JSON))
    learning_outcomes: Optional[List[str]] = Field(default=[], sa_column=Column(JSON))

class CourseMaterial(SQLModel, table=True):
    id: str = Field(primary_key=True)
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    title: Optional[str]
    type: Optional[str]
    description: Optional[str]
    upload_date: Optional[date] = Field(default_factory=date.today)
    file_url: Optional[str]
    file_type: Optional[str]
    file_size: Optional[str]
    uploaded_by: Optional[str] = Field(foreign_key="user.id")

class CourseMaterialCreateRequest(BaseModel):
    course_code: str
    title: str
    type: str
    description: Optional[str] = None
    file: Optional[UploadFile]
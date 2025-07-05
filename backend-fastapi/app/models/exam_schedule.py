from datetime import date, datetime, time
from enum import Enum
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.course import Course

class ExamTypeEnum(str, Enum):
    Midterm = "Midterm"
    Final = "Final"
    Quiz = "Quiz"
    Oral = "Oral"
    Practical = "Practical"

class ExamTimeTable(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    semester: Optional[str] = Field(foreign_key="program.id")
    exam_type: Optional[ExamTypeEnum]
    exam_schedule: Optional[datetime]
    duration: Optional[time]
    room: Optional[str] = Field(foreign_key="room.room")
    invigilator: Optional[str]
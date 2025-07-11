from datetime import datetime, time
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel

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
    total_marks: Optional[int]
    weight: Optional[float]
    duration: Optional[time]
    room: Optional[str] = Field(foreign_key="room.room")
    invigilator: Optional[str]

class ExamResult(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    exam_id: Optional[str] = Field(foreign_key="examtimetable.id")
    student_id: Optional[str] = Field(foreign_key="user.id")
    marks_obtained: Optional[float]
    status: Optional[str]
    feedback: Optional[str]
    submission_time: Optional[datetime]
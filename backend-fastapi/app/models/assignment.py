
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Assignment(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    course_title: Optional[str] = None
    batch: Optional[str]
    semester: Optional[str] = Field(foreign_key="program.id")
    title: str
    description: Optional[str]
    deadline: Optional[datetime]
    total_marks: Optional[int]
    weight: Optional[float]
    status: Optional[str]
    submission_count: Optional[int]
    created_by: Optional[str] = Field(foreign_key="user.id")

class AssignmentSubmission(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    assignment_id: Optional[str] = Field(foreign_key="assignment.id")
    student_id: Optional[str] = Field(foreign_key="user.id")
    submission_time: Optional[datetime]
    marks_obtained: Optional[int]
    feedback: Optional[str]
    status: Optional[str]
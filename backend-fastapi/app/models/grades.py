from typing import Optional
from sqlmodel import Field, SQLModel

class Grade(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: Optional[str] = Field(foreign_key="user.id")
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    semester: Optional[str] = Field(foreign_key="program.id")
    incourse_marks: Optional[float]
    final_marks: Optional[float]
    total_marks: Optional[float]
    grade: Optional[float]
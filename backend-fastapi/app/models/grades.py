from typing import Optional
from sqlmodel import Field, SQLModel

from app.models.course import Course, CourseSemester
from app.models.user import StudentProfile

class Grade(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    student_id: Optional[str] = Field(foreign_key="user.id")
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    semester: Optional[str] = Field(foreign_key="program.id")
    incourse_marks: Optional[float]
    final_marks: Optional[float]
    total_marks: Optional[float]
    grade: Optional[float]

class GradeCreateRequest(SQLModel):
    student_id: str
    course_code: str
    semester: str
    incourse_marks: Optional[float] = None
    final_marks: Optional[float] = None
    total_marks: Optional[float] = None
    grade: Optional[float] = None

class GradeUpdateRequest(SQLModel):
    student_id: Optional[str] = None
    course_code: Optional[str] = None
    semester: Optional[str] = None
    incourse_marks: Optional[float] = None
    final_marks: Optional[float] = None
    total_marks: Optional[float] = None
    grade: Optional[float] = None

class GradeResponse(SQLModel):
    id: int
    student: StudentProfile
    course: Course
    semester: CourseSemester
    incourse_marks: Optional[float] = None
    final_marks: Optional[float] = None
    total_marks: Optional[float] = None
    grade: Optional[float] = None
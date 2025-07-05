from datetime import date
from typing import List
from sqlmodel import Field, SQLModel

class Program(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str = Field(max_length=100)
    year: int
    semester: int = Field(min=1, max=8, sa_column_kwargs={"nullable": True})
    description: str = Field(max_length=500)
    start_date: date
    end_date: date
    degree_type: str
    department: str
    courses: List[str] = Field(default=[], sa_column_kwargs={"nullable": True}, foreign_key="course.course_code")
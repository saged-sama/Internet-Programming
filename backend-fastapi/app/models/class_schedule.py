from datetime import time
import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class ClassSchedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    batch: Optional[str]
    semester: Optional[str] = Field(foreign_key="program.id")
    room: Optional[str] = Field(foreign_key="room.room")
    schedule: datetime
    duration: Optional[time]
    instructor: Optional[str] = Field(foreign_key="user.id")
from datetime import time
from typing import Optional
from sqlmodel import Field, SQLModel

class ClassSchedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    course_code: Optional[str] = Field(foreign_key="course.course_code")
    batch: Optional[str]
    semester: Optional[str]  # Simple string field for semester numbers like "1", "2", "3", etc.
    room: Optional[str] = Field(foreign_key="room.room")
    day: Optional[str]  # Monday, Tuesday, etc.
    start_time: Optional[time]
    end_time: Optional[time]
    instructor: Optional[str] = Field(foreign_key="user.id")
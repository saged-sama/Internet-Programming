from datetime import date, time
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel

class MeetingTypeEnum(str, Enum):
    All = "All"
    Faculty = "Faculty"
    Department = "Department"
    Student = "Student"
    Administrative = "Administrative"

    
class Meeting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    meeting_date: Optional[date]
    start_time: Optional[time]
    end_time: Optional[time]
    location: Optional[str]
    url: Optional[str]
    organizer: Optional[str]
    type: Optional[MeetingTypeEnum]
    is_registration_required: bool = False
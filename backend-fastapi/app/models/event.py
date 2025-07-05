from datetime import date, time
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel

class EventCategoryEnum(str, Enum):
    All = "All"
    Academic = "Academic"
    Cultural = "Cultural"
    Sports = "Sports"
    Workshop = "Workshop"
    Conference = "Conference"

class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    event_date: date
    start_time: Optional[time]
    end_time: Optional[time]
    location: Optional[str]
    category: Optional[EventCategoryEnum]
    description: Optional[str]
    image: Optional[str]
    registration_required: bool = False
    registration_deadline: Optional[date]
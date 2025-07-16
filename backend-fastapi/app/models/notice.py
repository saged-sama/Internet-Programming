from datetime import date
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel
from pydantic import BaseModel

class NoticeCategoryEnum(str, Enum):
    Academic = "Academic"
    Administrative = "Administrative"
    General = "General"
    Research = "Research"

class Notice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    notice_date: date = Field(default_factory=date.today)
    category: NoticeCategoryEnum
    description: str
    is_important: bool = False

# Request models for frontend compatibility
class NoticeCreateRequest(BaseModel):
    title: str
    category: str
    description: str
    is_important: bool = False

class NoticeUpdateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    is_important: Optional[bool] = None

# Response models for frontend compatibility
class NoticeResponse(BaseModel):
    id: int
    title: str
    notice_date: date
    category: str
    description: str
    is_important: bool = False
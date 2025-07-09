from datetime import date, time
from typing import List, Optional

from sqlalchemy import JSON
from sqlmodel import Column, Field, Relationship, SQLModel

from app.models.user import User

class Room(SQLModel, table=True):
    room: str = Field(primary_key=True)
    capacity: Optional[int]
    facilities: Optional[List[str]] = Field(default_factory=list, sa_column=Column(JSON, nullable=True))

## Gotta clarify the differences between RoomAvailabilitySlot and RoomBooking

class RoomAvailabilitySlot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room: Optional[str] = Field(foreign_key="room.room")
    day: Optional[str]
    start_time: Optional[time]
    end_time: Optional[time]

class RoomBooking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    room: Optional[str] = Field(foreign_key="room.room")
    requested_by: Optional[str] = Field(foreign_key="user.id")
    email: Optional[str]
    purpose: Optional[str]
    booking_date: Optional[date]
    start_time: Optional[time]
    end_time: Optional[time]
    attendees: Optional[int]
    status: Optional[str] = Field(default="Pending")  # Pending, Approved, Rejected
    request_date: Optional[date]
    rejection_reason: Optional[str] = None

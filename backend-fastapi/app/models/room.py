from datetime import date, time
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.user import User

class Room(SQLModel, table=True):
    room: str = Field(primary_key=True)
    capacity: Optional[int]
    facilities: Optional[List[str]]

## Gotta clarify the differences between RoomAvailabilitySlot and RoomBooking

class RoomAvailabilitySlot(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    room: Optional[str] = Field(foreign_key="room.room")
    day: Optional[str]
    start_time: Optional[time]
    end_time: Optional[time]

class RoomBooking(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    room: Optional[str] = Field(foreign_key="room.room")
    requested_by: Optional[str] = Field(foreign_key="user.id")
    purpose: Optional[str]
    booking_date: Optional[date]
    start_time: Optional[time]
    end_time: Optional[time]
    status: Optional[str]
    request_date: Optional[date]

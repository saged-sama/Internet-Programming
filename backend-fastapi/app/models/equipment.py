from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class LabEquipment(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: Optional[str]
    description: Optional[str]
    status: Optional[str]
    location: Optional[str]
    category: Optional[str]

class EquipmentBooking(SQLModel, table=True):
    id: str = Field(primary_key=True)
    equipment_id: Optional[str] = Field(foreign_key="labequipment.id")
    user_id: Optional[str] = Field(foreign_key="user.id")
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    purpose: Optional[str]
    status: Optional[str]
    created_at: Optional[datetime]
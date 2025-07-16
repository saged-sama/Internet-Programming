from datetime import datetime, time
from typing import List, Optional
from enum import Enum
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel, validator

# ======================
# ENUM DEFINITIONS
# ======================

class EquipmentStatus(str, Enum):
    available = "available"
    booked = "booked"
    maintenance = "maintenance"

class BookingStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    completed = "completed"

class EquipmentCategory(str, Enum):
    computing = "computing"
    manufacturing = "manufacturing"
    imaging = "imaging"
    analytical = "analytical"
    general = "general"

# ======================
# DATABASE MODELS (SQLModel)
# ======================

class LabEquipment(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str 
    description: str
    status: Optional[ EquipmentStatus] = Field(default=EquipmentStatus.available)
    location: str
    category: Optional[ EquipmentCategory ] = Field(default=EquipmentCategory.general)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    bookings: List["Booking"] = Relationship(back_populates="equipment")


class Booking(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    equipment_id: str = Field(foreign_key="labequipment.id")
    user_id: str = Field(foreign_key="user.id")
    start_time: datetime = Field(index=True)
    end_time: datetime = Field(index=True)
    purpose: str
    status: BookingStatus = Field(default=BookingStatus.pending)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    equipment: "LabEquipment" = Relationship(back_populates="bookings")



# ======================
# REQUEST MODELS (Pydantic)
# ======================

class LabEquipmentCreate(BaseModel):
    name: str
    description: str
    location: str

class LabEquipmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[EquipmentStatus] = None
    location: Optional[str] = None
    category: Optional[EquipmentCategory] = None

class BookingCreate(BaseModel):
    equipment_id: str
    start_time: datetime
    end_time: datetime
    purpose: str

    @validator('end_time')
    def validate_time_range(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError("End time must be after start time")
        return v

class AvailabilityCheckRequest(BaseModel):
    equipment_id: str
    start_time: datetime
    end_time: datetime

# ======================
# RESPONSE MODELS (Pydantic)
# ======================

class TimeRange(BaseModel):
    start: str  # ISO format time
    end: str    # ISO format time

class LabEquipmentResponse(BaseModel):
    id: str
    name: str
    description: str
    status: EquipmentStatus
    location: str
    category: EquipmentCategory
    created_at: datetime
    updated_at: datetime

class LabEquipmentApiResponse(BaseModel):
    data: List[LabEquipmentResponse]
    total: int
    page: Optional[int] = None
    limit: Optional[int] = None

class BookingResponse(BaseModel):
    id: UUID
    equipment_id: str
    equipment_name: str
    user_id: str
    start_time: datetime
    end_time: datetime
    purpose: str
    status: BookingStatus
    created_at: datetime
    updated_at: Optional[datetime]

class BookingApiResponse(BaseModel):
    data: List[BookingResponse]
    total: int

class AvailabilityResponse(BaseModel):
    is_available: bool
    conflicting_bookings: List[BookingResponse] = []
    message: Optional[str] = None

class EquipmentAvailabilityResponse(BaseModel):
    date: str
    equipment_id: str
    equipment_status: EquipmentStatus
    available_ranges: List[TimeRange]
    booked_ranges: List[TimeRange]


class BookingUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    purpose: Optional[str] = None
    status: Optional[BookingStatus] = None

    @validator('end_time')
    def validate_time_range(cls, v, values):
        if v is not None and 'start_time' in values and values['start_time'] is not None:
            if v <= values['start_time']:
                raise ValueError("End time must be after start time")
        return v

# ======================
# HELPER FUNCTIONS
# ======================

def equipment_to_response(equipment: LabEquipment) -> LabEquipmentResponse:
    return LabEquipmentResponse(
        id=equipment.id,
        name=equipment.name,
        description=equipment.description,
        status=equipment.status,
        location=equipment.location,
        category=equipment.category,
        created_at=equipment.created_at,
        updated_at=equipment.updated_at
    )

def booking_to_response(booking: Booking) -> BookingResponse:
    return BookingResponse(
        id=booking.id,
        equipment_id=booking.equipment_id,
        equipment_name=booking.equipment.name if booking.equipment else "Unknown",
        user_id=booking.user_id,
        start_time=booking.start_time,
        end_time=booking.end_time,
        purpose=booking.purpose,
        status=booking.status,
        created_at=booking.created_at,
        updated_at=booking.updated_at
    )









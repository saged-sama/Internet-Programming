from typing import List, Optional, Annotated
from datetime import datetime, time, date, timedelta
from fastapi import APIRouter, HTTPException, Query, Depends, Body
from sqlmodel import select, and_, or_
from uuid import UUID, uuid4

from app.utils.db import SessionDependency
from app.utils.auth import get_current_user
from app.models.user import User
from app.models.equipment import (
    LabEquipmentUpdate,
    LabEquipmentCreate,
    LabEquipment,
    Booking,
    EquipmentStatus,
    EquipmentCategory,
    BookingStatus,
    LabEquipmentResponse,
    LabEquipmentApiResponse,
    BookingCreate,
    BookingResponse,
    BookingApiResponse,
    AvailabilityCheckRequest,
    AvailabilityResponse,
    EquipmentAvailabilityResponse,
    TimeRange,
    BookingUpdate
)

router = APIRouter(prefix="/staff-api/lab-equipments", tags=["lab-equipments"])

# Helper functions
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

async def check_equipment_availability(
    session: SessionDependency,
    equipment_id: str,
    start_time: datetime,
    end_time: datetime,
    exclude_booking_id: Optional[str] = None
) -> AvailabilityResponse:
    equipment = session.get(LabEquipment, equipment_id)
    if not equipment:
        return AvailabilityResponse(
            is_available=False,
            message="Equipment not found"
        )
    
    if equipment.status == EquipmentStatus.maintenance:
        return AvailabilityResponse(
            is_available=False,
            message="Equipment is under maintenance"
        )
    
    query = select(Booking).where(
        Booking.equipment_id == equipment_id,
        Booking.status.in_([BookingStatus.approved, BookingStatus.pending]),
        or_(
            and_(Booking.start_time <= start_time, Booking.end_time > start_time),
            and_(Booking.start_time < end_time, Booking.end_time >= end_time),
            and_(Booking.start_time >= start_time, Booking.end_time <= end_time)
        )
    )
    
    if exclude_booking_id:
        query = query.where(Booking.id != exclude_booking_id)
    
    conflicting_bookings = session.exec(query).all()
    
    if conflicting_bookings:
        return AvailabilityResponse(
            is_available=False,
            conflicting_bookings=[booking_to_response(b) for b in conflicting_bookings],
            message="Equipment is already booked for the selected time slot"
        )
    
    return AvailabilityResponse(is_available=True)

# Equipment CRUD Endpoints
@router.get("/", response_model=LabEquipmentApiResponse)
async def get_lab_equipments(
    session: SessionDependency,
    status: Optional[EquipmentStatus] = Query(None),
    category: Optional[EquipmentCategory] = Query(None),
    location: Optional[str] = Query(None),
    searchQuery: Optional[str] = Query(None)
):
    """Get all lab equipments with filtering"""
    query = select(LabEquipment)
    
    if status:
        query = query.where(LabEquipment.status == status)
    if category:
        query = query.where(LabEquipment.category == category)
    if location:
        query = query.where(LabEquipment.location.contains(location))
    if searchQuery:
        query = query.where(
            or_(
                LabEquipment.name.contains(searchQuery),
                LabEquipment.description.contains(searchQuery),
                LabEquipment.location.contains(searchQuery)
            )
        )
    
    equipments = session.exec(query.order_by(LabEquipment.created_at.desc())).all()
    
    return LabEquipmentApiResponse(
        data=[equipment_to_response(e) for e in equipments],
        total=len(equipments),
        page=None,
        limit=None
    )

@router.get("/{equipment_id}", response_model=LabEquipmentResponse)
async def get_lab_equipment(equipment_id: str, session: SessionDependency):
    """Get a specific lab equipment"""
    equipment = session.get(LabEquipment, equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Lab equipment not found")
    return equipment_to_response(equipment)

@router.post("/", response_model=LabEquipmentResponse)
async def create_lab_equipment(
    equipment: Annotated[LabEquipmentCreate, Body()],
    session: SessionDependency
):
    """Create a new lab equipment"""
    new_equipment = LabEquipment(
        id=str(uuid4()),
        name=equipment.name,
        description=equipment.description,
        location=equipment.location,
        status=EquipmentStatus.available,
        category=EquipmentCategory.general
    )
    
    session.add(new_equipment)
    session.commit()
    session.refresh(new_equipment)
    return equipment_to_response(new_equipment)

@router.put("/{equipment_id}", response_model=LabEquipmentResponse)
async def update_lab_equipment(
    equipment_id: str,
    equipment_update: LabEquipmentUpdate,
    session: SessionDependency
):
    """Update lab equipment information"""
    equipment = session.get(LabEquipment, equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Lab equipment not found")
    
    update_data = equipment_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(equipment, field, value)
    
    equipment.updated_at = datetime.utcnow()
    session.add(equipment)
    session.commit()
    session.refresh(equipment)
    return equipment_to_response(equipment)

# Booking Endpoints

# @router.get("/bookings", response_model=BookingApiResponse)
# async def get_all_bookings(
#     session: SessionDependency,
#     equipment_id: Optional[str] = Query(None),
#     user_id: Optional[str] = Query(None),
#     status: Optional[BookingStatus] = Query(None),
#     start_date: Optional[datetime] = Query(None),
#     end_date: Optional[datetime] = Query(None)
# ):
#     """
#     Get all bookings (optionally filter by equipment_id, user_id, status, date range)
#     """
#     query = select(Booking)

#     if equipment_id:
#         query = query.where(Booking.equipment_id == equipment_id)
#     if user_id:
#         query = query.where(Booking.user_id == user_id)
#     if status:
#         query = query.where(Booking.status == status)
#     if start_date:
#         query = query.where(Booking.start_time >= start_date)
#     if end_date:
#         query = query.where(Booking.end_time <= end_date)

#     bookings = session.exec(query.order_by(Booking.start_time)).all()

#     # Ensure equipment relationship is loaded for name
#     for b in bookings:
#         if b.equipment is None:
#             b.equipment = session.get(LabEquipment, b.equipment_id)

#     return BookingApiResponse(
#         data=[booking_to_response(b) for b in bookings],
#         total=len(bookings)
#     )



@router.post("/{equipment_id}/bookings", response_model=BookingResponse)
async def create_booking(
    equipment_id: str,
    booking: BookingCreate,
    session: SessionDependency,
    current_user: User = Depends(get_current_user)
    # current_user: User = (get_current_user)
):
    """Create a new booking for lab equipment"""
    availability = await check_equipment_availability(
        session, equipment_id, booking.start_time, booking.end_time)
    
    if not availability.is_available:
        raise HTTPException(status_code=400, detail=availability.message)
    
    new_booking = Booking(
        equipment_id=equipment_id,
        user_id=current_user.id,
        start_time=booking.start_time,
        end_time=booking.end_time,
        purpose=booking.purpose,
        status=BookingStatus.pending
    )
    
    session.add(new_booking)
    session.commit()
    session.refresh(new_booking)
    
    # Ensure equipment relationship is loaded
    if new_booking.equipment is None:
        new_booking.equipment = session.get(LabEquipment, equipment_id)
    
    return booking_to_response(new_booking)


@router.get("/all/booking", response_model=BookingApiResponse)
async def get_all_equipment_bookings(
    session: SessionDependency,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    """Get all bookings for a specific equipment"""
    
    query = select(Booking)
    
    # if start_date:
    #     query = query.where(Booking.start_time >= start_date)
    # if end_date:
    #     query = query.where(Booking.end_time <= end_date)
    
    bookings = session.exec(query.order_by(Booking.start_time)).all()
    return BookingApiResponse(
        data=[booking_to_response(b) for b in bookings],
        total=len(bookings)
    )


@router.get("/{equipment_id}/bookings", response_model=BookingApiResponse)
async def get_equipment_bookings(
    equipment_id: str,
    session: SessionDependency,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    """Get all bookings for a specific equipment"""
    query = select(Booking).where(Booking.equipment_id == equipment_id)
    
    if start_date:
        query = query.where(Booking.start_time >= start_date)
    if end_date:
        query = query.where(Booking.end_time <= end_date)
    
    # Get current date at start of day
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Add filter for bookings from today onwards
    query = query.where(Booking.start_time >= today)
    bookings = session.exec(query.order_by(Booking.start_time)).all()
    
    return BookingApiResponse(
        data=[booking_to_response(b) for b in bookings],
        total=len(bookings)
    )


@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    booking_update: BookingUpdate,
    session: SessionDependency,
    # current_user: User = Depends(get_current_user)
):
    """Update a booking's details"""
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    update_data = booking_update.model_dump(exclude_unset=True)
    
    if "start_time" in update_data or "end_time" in update_data:
        start_time = update_data.get("start_time", booking.start_time)
        end_time = update_data.get("end_time", booking.end_time)
        
        availability = await check_equipment_availability(
            session, 
            booking.equipment_id, 
            start_time, 
            end_time,
            exclude_booking_id=booking_id
        )
        
        if not availability.is_available:
            raise HTTPException(status_code=400, detail=availability.message)
    
    for field, value in update_data.items():
        setattr(booking, field, value)
    
    booking.updated_at = datetime.utcnow()
    session.add(booking)
    session.commit()
    session.refresh(booking)
    
    return booking_to_response(booking)




@router.get("/{equipment_id}/availability", response_model=EquipmentAvailabilityResponse)
async def get_equipment_availability(
    equipment_id: str,
    date: date,
    session: SessionDependency
):
    """Get available time ranges for a specific equipment on a given date"""
    equipment = session.get(LabEquipment, equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    # Office hours (9AM to 5PM)
    office_start = datetime.combine(date, time(hour=9))
    office_end = datetime.combine(date, time(hour=17))
    
    # Get all bookings for this equipment on the selected date
    bookings = session.exec(
        select(Booking).where(
            Booking.equipment_id == equipment_id,
            Booking.start_time >= office_start,
            Booking.end_time <= office_end,
            Booking.status.in_([BookingStatus.approved, BookingStatus.pending])
        ).order_by(Booking.start_time)
    ).all()
    
    # Initialize availability ranges
    available_ranges = []
    current_start = office_start
    
    for booking in bookings:
        # If there's time between current_start and booking start, it's available
        if current_start < booking.start_time:
            available_ranges.append(TimeRange(
                start=current_start.time().isoformat(),
                end=booking.start_time.time().isoformat()
            ))
        # Move current_start to the end of this booking
        current_start = max(current_start, booking.end_time)
    
    # Add remaining time after last booking until office close
    if current_start < office_end:
        available_ranges.append(TimeRange(
            start=current_start.time().isoformat(),
            end=office_end.time().isoformat()
        ))
    
    # If no bookings, the whole day is available
    if not bookings:
        available_ranges.append(TimeRange(
            start=office_start.time().isoformat(),
            end=office_end.time().isoformat()
        ))
    
    # Convert bookings to time ranges for response
    booked_ranges = [TimeRange(
        start=b.start_time.time().isoformat(),
        end=b.end_time.time().isoformat()
    ) for b in bookings]
    
    return EquipmentAvailabilityResponse(
        date=date.isoformat(),
        equipment_id=equipment_id,
        equipment_status=equipment.status,
        available_ranges=available_ranges,
        booked_ranges=booked_ranges
    )

# Utility Endpoints
@router.get("/statuses/list")
async def get_statuses():
    return {"statuses": [s.value for s in EquipmentStatus]}

@router.get("/categories/list")
async def get_categories():
    return {"categories": [c.value for c in EquipmentCategory]}

@router.get("/booking-statuses/list")
async def get_booking_statuses():
    return {"statuses": [s.value for s in BookingStatus]}


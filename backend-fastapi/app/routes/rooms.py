from datetime import date, time, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, and_, or_
from pydantic import BaseModel

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.room import Room, RoomAvailabilitySlot, RoomBooking
from app.models.user import User, UserRoles

# Mock admin user for development
def get_mock_admin_user():
    """Create a mock admin user for development when authentication is not available"""
    return User(
        id="admin-dev",
        name="Development Admin",
        role=UserRoles.admin,
        email="admin@dev.local"
    )

# Development authentication dependency
async def get_current_user_or_mock(session: Session = Depends(get_session)):
    """Get current user from authentication or return mock admin for development"""
    try:
        # For development, we'll just return a mock admin user
        # In production, you'd use the real authentication
        return get_mock_admin_user()
    except Exception:
        # Fallback to mock admin if authentication fails
        return get_mock_admin_user()

# Helper function to generate consistent room IDs
def generate_room_id(room_name: str) -> int:
    """Generate a consistent ID for a room name"""
    # Use a deterministic hash function (CRC32) to ensure consistency across processes
    import zlib
    return abs(zlib.crc32(room_name.encode('utf-8'))) % 1000000

# Helper function to find room by ID
def find_room_by_id(session: Session, room_id: int) -> Optional[Room]:
    """Find a room by its generated ID"""
    rooms = session.exec(select(Room)).all()
    for room in rooms:
        if generate_room_id(room.room) == room_id:
            return room
    return None

router = APIRouter(prefix="/api/scheduling", tags=["rooms"])

# Pydantic models for API responses
class RoomAvailabilityResponse(BaseModel):
    id: int
    room: str
    capacity: int
    facilities: List[str]
    availableSlots: List[dict]

class RoomBookingResponse(BaseModel):
    id: int
    room: str
    requestedBy: str
    email: str
    purpose: str
    date: str
    startTime: str
    endTime: str
    attendees: int
    status: str
    requestDate: str
    rejectionReason: Optional[str] = None

class BookingFormData(BaseModel):
    room: str
    requestedBy: str
    email: str
    purpose: str
    date: str
    startTime: str
    endTime: str
    attendees: int

class ApprovalRequest(BaseModel):
    action: str  # "approve" or "reject"
    rejectionReason: Optional[str] = None

class RoomCreateRequest(BaseModel):
    room: str
    capacity: int
    facilities: List[str]
    availableSlots: List[dict] = []

class RoomUpdateRequest(BaseModel):
    room: Optional[str] = None
    capacity: Optional[int] = None
    facilities: Optional[List[str]] = None
    availableSlots: Optional[List[dict]] = None

# Room Availability Endpoints
@router.get("/rooms/availability", response_model=List[RoomAvailabilityResponse])
async def get_room_availability(session: Session = Depends(get_session)):
    """Get all rooms with their availability slots"""
    
    # Get all rooms from database
    rooms = session.exec(select(Room)).all()
    
    result = []
    for room in rooms:
        # Get availability slots for this room from database
        slots_query = select(RoomAvailabilitySlot).where(RoomAvailabilitySlot.room == room.room)
        slots = session.exec(slots_query).all()
        
        # Group slots by day
        slots_by_day = {}
        for slot in slots:
            if slot.day not in slots_by_day:
                slots_by_day[slot.day] = []
            slots_by_day[slot.day].append({
                "startTime": slot.start_time.strftime("%H:%M") if slot.start_time else "",
                "endTime": slot.end_time.strftime("%H:%M") if slot.end_time else ""
            })
        
        available_slots = [
            {"day": day, "slots": day_slots} 
            for day, day_slots in slots_by_day.items()
        ]
        
        result.append(RoomAvailabilityResponse(
            id=generate_room_id(room.room),
            room=room.room,
            capacity=room.capacity or 0,
            facilities=room.facilities or [],
            availableSlots=available_slots
        ))
    
    return result

# Room Booking Endpoints
@router.post("/bookings", response_model=dict)
async def create_booking(
    booking_data: BookingFormData,
    session: Session = Depends(get_session)
):
    """Create a new room booking request"""
    
    # Parse date and time
    booking_date = datetime.strptime(booking_data.date, "%Y-%m-%d").date()
    start_time = datetime.strptime(booking_data.startTime, "%H:%M").time()
    end_time = datetime.strptime(booking_data.endTime, "%H:%M").time()
    
    # Create booking in database
    booking = RoomBooking(
        room=booking_data.room,
        requested_by=booking_data.requestedBy,
        email=booking_data.email,
        purpose=booking_data.purpose,
        booking_date=booking_date,
        start_time=start_time,
        end_time=end_time,
        attendees=booking_data.attendees,
        status="Pending",
        request_date=date.today()
    )
    
    session.add(booking)
    session.commit()
    session.refresh(booking)
    
    return {"message": "Booking request submitted successfully", "booking_id": booking.id}

@router.get("/bookings", response_model=List[RoomBookingResponse])
async def get_bookings(
    status: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """Get all room bookings from database, optionally filtered by status"""
    
    query = select(RoomBooking)
    if status:
        query = query.where(RoomBooking.status == status)
    
    bookings = session.exec(query).all()
    
    result = []
    for booking in bookings:
        result.append(RoomBookingResponse(
            id=booking.id,
            room=booking.room or "",
            requestedBy=booking.requested_by or "",
            email=booking.email or "",
            purpose=booking.purpose or "",
            date=booking.booking_date.strftime("%Y-%m-%d") if booking.booking_date else "",
            startTime=booking.start_time.strftime("%H:%M") if booking.start_time else "",
            endTime=booking.end_time.strftime("%H:%M") if booking.end_time else "",
            attendees=booking.attendees or 0,
            status=booking.status or "Pending",
            requestDate=booking.request_date.strftime("%Y-%m-%d") if booking.request_date else "",
            rejectionReason=booking.rejection_reason
        ))
    
    return result

@router.put("/bookings/{booking_id}/approve", response_model=dict)
async def approve_booking(
    booking_id: int,
    approval_data: ApprovalRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Approve or reject a room booking request"""
    
    # Get booking from database
    booking = session.get(RoomBooking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if approval_data.action == "approve":
        booking.status = "Approved"
        booking.rejection_reason = None
    elif approval_data.action == "reject":
        booking.status = "Rejected"
        booking.rejection_reason = approval_data.rejectionReason
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Must be 'approve' or 'reject'")
    
    session.add(booking)
    session.commit()
    
    return {"message": f"Booking {approval_data.action}d successfully"}

# Admin Room CRUD Endpoints
@router.get("/admin/rooms", response_model=List[RoomAvailabilityResponse])
async def get_admin_rooms(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Get all rooms for admin management (database only)"""
    
    # Get all rooms from database
    rooms = session.exec(select(Room)).all()
    
    result = []
    for room in rooms:
        # Get availability slots for this room from database
        slots_query = select(RoomAvailabilitySlot).where(RoomAvailabilitySlot.room == room.room)
        slots = session.exec(slots_query).all()
        
        # Group slots by day
        slots_by_day = {}
        for slot in slots:
            if slot.day not in slots_by_day:
                slots_by_day[slot.day] = []
            slots_by_day[slot.day].append({
                "startTime": slot.start_time.strftime("%H:%M") if slot.start_time else "",
                "endTime": slot.end_time.strftime("%H:%M") if slot.end_time else ""
            })
        
        available_slots = [
            {"day": day, "slots": day_slots} 
            for day, day_slots in slots_by_day.items()
        ]
        
        result.append(RoomAvailabilityResponse(
            id=generate_room_id(room.room),
            room=room.room,
            capacity=room.capacity or 0,
            facilities=room.facilities or [],
            availableSlots=available_slots
        ))
    
    return result

@router.post("/admin/rooms", response_model=dict)
async def create_room(
    room_data: RoomCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Create a new room in database"""
    
    # Check if room already exists in database
    existing_room = session.exec(select(Room).where(Room.room == room_data.room)).first()
    if existing_room:
        raise HTTPException(status_code=400, detail=f"Room {room_data.room} already exists")
    
    # Create room in database
    room = Room(
        room=room_data.room,
        capacity=room_data.capacity,
        facilities=room_data.facilities
    )
    
    session.add(room)
    session.commit()
    session.refresh(room)
    
    # Create availability slots in database
    for slot_data in room_data.availableSlots:
        for slot in slot_data.get("slots", []):
            try:
                start_time = datetime.strptime(slot["startTime"], "%H:%M").time()
                end_time = datetime.strptime(slot["endTime"], "%H:%M").time()
                
                availability_slot = RoomAvailabilitySlot(
                    room=room.room,
                    day=slot_data["day"],
                    start_time=start_time,
                    end_time=end_time
                )
                session.add(availability_slot)
            except (KeyError, ValueError) as e:
                continue  # Skip invalid slots
    
    session.commit()
    
    return {"message": f"Room {room_data.room} created successfully", "room_id": generate_room_id(room.room)}

@router.get("/admin/rooms/{room_id}", response_model=RoomAvailabilityResponse)
async def get_room_by_id(
    room_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Get a specific room by ID from database"""
    
    # Find room by generated ID in database
    room = find_room_by_id(session, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Get availability slots from database
    slots_query = select(RoomAvailabilitySlot).where(RoomAvailabilitySlot.room == room.room)
    slots = session.exec(slots_query).all()
    
    # Group slots by day
    slots_by_day = {}
    for slot in slots:
        if slot.day not in slots_by_day:
            slots_by_day[slot.day] = []
        slots_by_day[slot.day].append({
            "startTime": slot.start_time.strftime("%H:%M") if slot.start_time else "",
            "endTime": slot.end_time.strftime("%H:%M") if slot.end_time else ""
        })
    
    available_slots = [
        {"day": day, "slots": day_slots} 
        for day, day_slots in slots_by_day.items()
    ]
    
    return RoomAvailabilityResponse(
        id=generate_room_id(room.room),
        room=room.room,
        capacity=room.capacity or 0,
        facilities=room.facilities or [],
        availableSlots=available_slots
    )

@router.put("/admin/rooms/{room_id}", response_model=dict)
async def update_room(
    room_id: int,
    room_data: RoomUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Update a room in database"""
    
    # Find room by generated ID in database
    room = find_room_by_id(session, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    old_room_name = room.room
    
    # Update room fields
    if room_data.room is not None:
        # Check if new room name conflicts with existing rooms
        if room_data.room != old_room_name:
            existing_room = session.exec(select(Room).where(Room.room == room_data.room)).first()
            if existing_room:
                raise HTTPException(status_code=400, detail=f"Room {room_data.room} already exists")
        room.room = room_data.room
    
    if room_data.capacity is not None:
        room.capacity = room_data.capacity
    
    if room_data.facilities is not None:
        room.facilities = room_data.facilities
    
    session.add(room)
    session.commit()
    
    # Update availability slots if provided
    if room_data.availableSlots is not None:
        # Delete existing slots from database
        old_slots = session.exec(select(RoomAvailabilitySlot).where(RoomAvailabilitySlot.room == old_room_name)).all()
        for slot in old_slots:
            session.delete(slot)
        
        # Create new slots in database
        for slot_data in room_data.availableSlots:
            for slot in slot_data.get("slots", []):
                try:
                    start_time = datetime.strptime(slot["startTime"], "%H:%M").time()
                    end_time = datetime.strptime(slot["endTime"], "%H:%M").time()
                    
                    availability_slot = RoomAvailabilitySlot(
                        room=room.room,
                        day=slot_data["day"],
                        start_time=start_time,
                        end_time=end_time
                    )
                    session.add(availability_slot)
                except (KeyError, ValueError) as e:
                    continue  # Skip invalid slots
        
        session.commit()
    
    # Update room references in other tables if room name changed
    if room_data.room is not None and room_data.room != old_room_name:
        # Update room bookings
        bookings = session.exec(select(RoomBooking).where(RoomBooking.room == old_room_name)).all()
        for booking in bookings:
            booking.room = room.room
            session.add(booking)
        
        session.commit()
    
    return {"message": f"Room updated successfully", "room_id": generate_room_id(room.room)}

@router.delete("/admin/rooms/{room_id}", response_model=dict)
async def delete_room(
    room_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Delete a room from database"""
    
    try:
        # Find room by generated ID in database
        room = find_room_by_id(session, room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        room_name = room.room
        
        # Delete associated availability slots from database
        try:
            slots = session.exec(select(RoomAvailabilitySlot).where(RoomAvailabilitySlot.room == room_name)).all()
            for slot in slots:
                session.delete(slot)
            session.commit()
        except Exception as e:
            print(f"Error deleting availability slots: {e}")
            session.rollback()
        
        # Delete associated bookings from database
        try:
            bookings = session.exec(select(RoomBooking).where(RoomBooking.room == room_name)).all()
            for booking in bookings:
                session.delete(booking)
            session.commit()
        except Exception as e:
            print(f"Error deleting bookings: {e}")
            session.rollback()
        
        # Delete associated class schedules from database
        try:
            from app.models.class_schedule import ClassSchedule
            schedules = session.exec(select(ClassSchedule).where(ClassSchedule.room == room_name)).all()
            for schedule in schedules:
                session.delete(schedule)
            session.commit()
        except Exception as e:
            print(f"Error deleting class schedules: {e}")
            session.rollback()
        
        # Delete the room from database
        try:
            session.delete(room)
            session.commit()
        except Exception as e:
            print(f"Error deleting room: {e}")
            session.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to delete room: {str(e)}")
        
        return {"message": f"Room {room_name} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in delete_room: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Sample Data Creation
@router.post("/sample-data/rooms")
async def create_sample_rooms(session: Session = Depends(get_session)):
    """Create sample room data in database"""
    
    sample_rooms_data = [
        {
            "room": "Room 101",
            "capacity": 30,
            "facilities": ["Projector", "Whiteboard", "Air Conditioning"],
            "availableSlots": [
                {
                    "day": "Monday",
                    "slots": [
                        {"startTime": "09:00", "endTime": "10:00"},
                        {"startTime": "11:00", "endTime": "12:00"},
                        {"startTime": "14:00", "endTime": "15:00"}
                    ]
                },
                {
                    "day": "Wednesday",
                    "slots": [
                        {"startTime": "10:00", "endTime": "11:00"},
                        {"startTime": "15:00", "endTime": "16:00"}
                    ]
                }
            ]
        },
        {
            "room": "Room 102",
            "capacity": 25,
            "facilities": ["Smart Board", "Audio System"],
            "availableSlots": [
                {
                    "day": "Tuesday",
                    "slots": [
                        {"startTime": "08:00", "endTime": "09:00"},
                        {"startTime": "13:00", "endTime": "14:00"}
                    ]
                },
                {
                    "day": "Friday",
                    "slots": [
                        {"startTime": "09:00", "endTime": "10:00"},
                        {"startTime": "16:00", "endTime": "17:00"}
                    ]
                }
            ]
        }
    ]
    
    for room_data in sample_rooms_data:
        # Check if room already exists
        existing_room = session.exec(select(Room).where(Room.room == room_data["room"])).first()
        if existing_room:
            continue  # Skip if already exists
        
        # Create room in database
        room = Room(
            room=room_data["room"],
            capacity=room_data["capacity"],
            facilities=room_data["facilities"]
        )
        session.add(room)
        session.commit()
        session.refresh(room)
        
        # Create availability slots in database
        for slot_data in room_data["availableSlots"]:
            for slot in slot_data["slots"]:
                start_time = datetime.strptime(slot["startTime"], "%H:%M").time()
                end_time = datetime.strptime(slot["endTime"], "%H:%M").time()
                
                availability_slot = RoomAvailabilitySlot(
                    room=room.room,
                    day=slot_data["day"],
                    start_time=start_time,
                    end_time=end_time
                )
                session.add(availability_slot)
        
        session.commit()
    
    return {"message": "Sample room data created successfully"} 
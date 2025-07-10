from datetime import date, time, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, and_, or_
from pydantic import BaseModel, validator

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.room import Room, RoomAvailabilitySlot, RoomBooking
from app.models.class_schedule import ClassSchedule
from app.models.course import Course
from app.models.user import User
from app.models.exam_schedule import ExamTimeTable, ExamTypeEnum

router = APIRouter(prefix="/api/scheduling", tags=["scheduling"])

# Pydantic models for API responses
class RoomAvailabilityResponse(BaseModel):
    id: int
    room: str
    capacity: int
    facilities: List[str]
    availableSlots: List[dict]

class ClassScheduleResponse(BaseModel):
    id: int
    courseCode: str
    courseTitle: str
    batch: str
    semester: str
    room: str
    day: str
    startTime: str
    endTime: str
    instructor: str

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

# Room Availability Endpoints
@router.get("/rooms/availability", response_model=List[RoomAvailabilityResponse])
async def get_room_availability(session: Session = Depends(get_session)):
    """Get all rooms with their availability slots"""
    
    # Get all rooms
    rooms = session.exec(select(Room)).all()
    
    result = []
    for room in rooms:
        # Get availability slots for this room
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
            id=hash(room.room) % 1000000,  # Generate a simple ID
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
    
    # Create booking
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
    """Get all room bookings, optionally filtered by status"""
    
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
    current_user: User = Depends(get_current_user)
):
    """Approve or reject a booking request (admin only)"""
    
    # Check if user is admin (you may need to adjust this based on your user model)
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can approve bookings"
        )
    
    # Get booking
    booking = session.get(RoomBooking, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Update booking status
    if approval_data.action == "approve":
        booking.status = "Approved"
    elif approval_data.action == "reject":
        booking.status = "Rejected"
        booking.rejection_reason = approval_data.rejectionReason
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid action. Use 'approve' or 'reject'"
        )
    
    session.add(booking)
    session.commit()
    
    return {"message": f"Booking {approval_data.action}d successfully"}

# Class Schedule Endpoints
@router.get("/schedules", response_model=List[ClassScheduleResponse])
async def get_class_schedules(
    batch: Optional[str] = None,
    semester: Optional[str] = None,
    room: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """Get class schedules with optional filtering"""
    
    query = select(ClassSchedule, Course).join(
        Course, ClassSchedule.course_code == Course.course_code
    )
    
    # Apply filters
    if batch:
        query = query.where(ClassSchedule.batch == batch)
    if semester:
        query = query.where(ClassSchedule.semester == semester)
    if room:
        query = query.where(ClassSchedule.room == room)
    
    results = session.exec(query).all()
    
    schedules = []
    for schedule, course in results:
        # Get instructor name
        instructor_query = select(User).where(User.id == schedule.instructor)
        instructor = session.exec(instructor_query).first()
        instructor_name = f"{instructor.first_name} {instructor.last_name}" if instructor else "TBA"
        
        schedules.append(ClassScheduleResponse(
            id=schedule.id,
            courseCode=schedule.course_code or "",
            courseTitle=course.course_title,
            batch=schedule.batch or "",
            semester=schedule.semester or "",
            room=schedule.room or "",
            day=schedule.day or "",
            startTime=schedule.start_time.strftime("%H:%M") if schedule.start_time else "",
            endTime=schedule.end_time.strftime("%H:%M") if schedule.end_time else "",
            instructor=instructor_name
        ))
    
    return schedules

# Admin Class Schedule CRUD Endpoints
class ClassScheduleCreateRequest(BaseModel):
    course_code: str
    batch: str
    semester: str
    room: str
    day: str
    start_time: str
    end_time: str
    instructor: str

class ClassScheduleUpdateRequest(BaseModel):
    course_code: Optional[str] = None
    batch: Optional[str] = None
    semester: Optional[str] = None
    room: Optional[str] = None
    day: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    instructor: Optional[str] = None

@router.post("/admin/schedules", response_model=dict)
async def create_class_schedule(
    schedule_data: ClassScheduleCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new class schedule (admin only)"""
    
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create schedules"
        )
    
    # Parse time
    start_time = datetime.strptime(schedule_data.start_time, "%H:%M").time()
    end_time = datetime.strptime(schedule_data.end_time, "%H:%M").time()
    
    # Create schedule
    schedule = ClassSchedule(
        course_code=schedule_data.course_code,
        batch=schedule_data.batch,
        semester=schedule_data.semester,
        room=schedule_data.room,
        day=schedule_data.day,
        start_time=start_time,
        end_time=end_time,
        instructor=schedule_data.instructor
    )
    
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    
    return {"message": "Class schedule created successfully", "schedule_id": schedule.id}

@router.put("/admin/schedules/{schedule_id}", response_model=dict)
async def update_class_schedule(
    schedule_id: int,
    schedule_data: ClassScheduleUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Update an existing class schedule (admin only)"""
    
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update schedules"
        )
    
    # Get schedule
    schedule = session.get(ClassSchedule, schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    # Update fields
    if schedule_data.course_code is not None:
        schedule.course_code = schedule_data.course_code
    if schedule_data.batch is not None:
        schedule.batch = schedule_data.batch
    if schedule_data.semester is not None:
        schedule.semester = schedule_data.semester
    if schedule_data.room is not None:
        schedule.room = schedule_data.room
    if schedule_data.day is not None:
        schedule.day = schedule_data.day
    if schedule_data.start_time is not None:
        schedule.start_time = datetime.strptime(schedule_data.start_time, "%H:%M").time()
    if schedule_data.end_time is not None:
        schedule.end_time = datetime.strptime(schedule_data.end_time, "%H:%M").time()
    if schedule_data.instructor is not None:
        schedule.instructor = schedule_data.instructor
    
    session.add(schedule)
    session.commit()
    
    return {"message": "Class schedule updated successfully"}

@router.delete("/admin/schedules/{schedule_id}", response_model=dict)
async def delete_class_schedule(
    schedule_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Delete a class schedule (admin only)"""
    
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete schedules"
        )
    
    # Get schedule
    schedule = session.get(ClassSchedule, schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    session.delete(schedule)
    session.commit()
    
    return {"message": "Class schedule deleted successfully"}

@router.get("/admin/schedules/{schedule_id}", response_model=ClassScheduleResponse)
async def get_class_schedule_by_id(
    schedule_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get a specific class schedule by ID (admin only)"""
    
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this endpoint"
        )
    
    # Get schedule with course details
    query = select(ClassSchedule, Course).join(
        Course, ClassSchedule.course_code == Course.course_code
    ).where(ClassSchedule.id == schedule_id)
    
    result = session.exec(query).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    schedule, course = result
    
    # Get instructor name
    instructor_query = select(User).where(User.id == schedule.instructor)
    instructor = session.exec(instructor_query).first()
    instructor_name = f"{instructor.first_name} {instructor.last_name}" if instructor else "TBA"
    
    return ClassScheduleResponse(
        id=schedule.id,
        courseCode=schedule.course_code or "",
        courseTitle=course.course_title,
        batch=schedule.batch or "",
        semester=schedule.semester or "",
        room=schedule.room or "",
        day=schedule.day or "",
        startTime=schedule.start_time.strftime("%H:%M") if schedule.start_time else "",
        endTime=schedule.end_time.strftime("%H:%M") if schedule.end_time else "",
        instructor=instructor_name
    )

@router.get("/schedules/rooms", response_model=List[str])
async def get_schedule_rooms(session: Session = Depends(get_session)):
    """Get all rooms used in schedules for filtering"""
    
    query = select(ClassSchedule.room).distinct()
    rooms = session.exec(query).all()
    
    return [room for room in rooms if room]

# Add sample data endpoints for development
@router.post("/sample-data/rooms")
async def create_sample_rooms(session: Session = Depends(get_session)):
    """Create sample room data for development"""
    
    sample_rooms = [
        Room(room="A101", capacity=30, facilities=["Projector", "Whiteboard", "AC"]),
        Room(room="A102", capacity=25, facilities=["Projector", "Whiteboard"]),
        Room(room="B201", capacity=50, facilities=["Projector", "Whiteboard", "AC", "Sound System"]),
        Room(room="Lab1", capacity=20, facilities=["Computers", "Projector", "AC"]),
        Room(room="Hall1", capacity=200, facilities=["Projector", "Sound System", "AC", "Stage"])
    ]
    
    for room in sample_rooms:
        existing = session.get(Room, room.room)
        if not existing:
            session.add(room)
    
    # Add sample availability slots
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    time_slots = [
        ("08:00", "10:00"), ("10:00", "12:00"), ("12:00", "14:00"), 
        ("14:00", "16:00"), ("16:00", "18:00")
    ]
    
    for room in sample_rooms:
        for day in days:
            for start_str, end_str in time_slots:
                start_time = datetime.strptime(start_str, "%H:%M").time()
                end_time = datetime.strptime(end_str, "%H:%M").time()
                
                slot = RoomAvailabilitySlot(
                    room=room.room,
                    day=day,
                    start_time=start_time,
                    end_time=end_time
                )
                session.add(slot)
    
    session.commit()
    return {"message": "Sample room data created successfully"} 

class ExamCreateRequest(BaseModel):
    course_code: str
    course_title: str
    batch: str
    semester: str
    exam_type: ExamTypeEnum
    date: str  # yyyy-mm-dd
    start_time: str  # HH:MM
    end_time: str    # HH:MM
    room: str
    invigilator: str

    @validator('date')
    def validate_date(cls, v):
        from datetime import datetime
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

    @validator('start_time', 'end_time')
    def validate_time(cls, v):
        from datetime import datetime
        try:
            datetime.strptime(v, "%H:%M")
        except ValueError:
            raise ValueError("Time must be in HH:MM format")
        return v

@router.post("/staff-api/exams", response_model=dict)
async def create_exam(
    exam_data: ExamCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Only allow faculty or admin
    if current_user.role not in ("faculty", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or admin can create exams"
        )
    from datetime import datetime
    # Parse datetime and duration
    exam_date = datetime.strptime(exam_data.date, "%Y-%m-%d")
    start_time = datetime.strptime(exam_data.start_time, "%H:%M").time()
    end_time = datetime.strptime(exam_data.end_time, "%H:%M").time()
    # Calculate duration
    duration_seconds = (datetime.combine(exam_date, end_time) - datetime.combine(exam_date, start_time)).total_seconds()
    if duration_seconds <= 0:
        raise HTTPException(status_code=400, detail="End time must be after start time")
    duration = (datetime.min + (datetime.combine(exam_date, end_time) - datetime.combine(exam_date, start_time))).time()
    # Compose exam_schedule as datetime
    exam_schedule = datetime.combine(exam_date, start_time)
    # Create ExamTimeTable record
    exam = ExamTimeTable(
        course_code=exam_data.course_code,
        semester=exam_data.semester,
        exam_type=exam_data.exam_type,
        exam_schedule=exam_schedule,
        duration=duration,
        room=exam_data.room,
        invigilator=exam_data.invigilator
    )
    session.add(exam)
    session.commit()
    session.refresh(exam)
    return {"message": "Exam created successfully", "exam_id": exam.id} 

class ExamResponse(BaseModel):
    id: str
    course_code: str
    semester: str
    exam_type: ExamTypeEnum
    exam_schedule: str
    duration: str
    room: str
    invigilator: str

@router.get("/staff-api/exams", response_model=List[ExamResponse])
async def get_exams(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Only allow faculty or admin
    if current_user.role not in ("faculty", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or admin can view exams"
        )
    exams = session.exec(select(ExamTimeTable)).all()
    result = []
    for exam in exams:
        result.append(ExamResponse(
            id=exam.id,
            course_code=exam.course_code,
            semester=exam.semester,
            exam_type=exam.exam_type,
            exam_schedule=exam.exam_schedule.isoformat() if exam.exam_schedule else None,
            duration=exam.duration.isoformat() if exam.duration else None,
            room=exam.room,
            invigilator=exam.invigilator
        ))
    return result 

class ExamUpdateRequest(BaseModel):
    course_code: Optional[str] = None
    course_title: Optional[str] = None
    batch: Optional[str] = None
    semester: Optional[str] = None
    exam_type: Optional[ExamTypeEnum] = None
    date: Optional[str] = None  # yyyy-mm-dd
    start_time: Optional[str] = None  # HH:MM
    end_time: Optional[str] = None    # HH:MM
    room: Optional[str] = None
    invigilator: Optional[str] = None

@router.put("/staff-api/exams/{exam_id}", response_model=dict)
async def update_exam(
    exam_id: str,
    exam_data: ExamUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ("faculty", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or admin can update exams"
        )
    exam = session.get(ExamTimeTable, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    update_fields = exam_data.dict(exclude_unset=True)
    # Handle date/time/duration logic if any time fields are updated
    if any(f in update_fields for f in ("date", "start_time", "end_time")):
        from datetime import datetime
        exam_date = datetime.strptime(update_fields.get("date") or exam.exam_schedule.date().isoformat(), "%Y-%m-%d")
        start_time = datetime.strptime(update_fields.get("start_time") or exam.exam_schedule.time().strftime("%H:%M"), "%H:%M").time()
        end_time = datetime.strptime(update_fields.get("end_time") or (datetime.min + exam.duration).time().strftime("%H:%M"), "%H:%M").time()
        duration_seconds = (datetime.combine(exam_date, end_time) - datetime.combine(exam_date, start_time)).total_seconds()
        if duration_seconds <= 0:
            raise HTTPException(status_code=400, detail="End time must be after start time")
        duration = (datetime.min + (datetime.combine(exam_date, end_time) - datetime.combine(exam_date, start_time))).time()
        exam.exam_schedule = datetime.combine(exam_date, start_time)
        exam.duration = duration
    # Update other fields
    for field, value in update_fields.items():
        if field not in ("date", "start_time", "end_time"):
            setattr(exam, field, value)
    session.add(exam)
    session.commit()
    session.refresh(exam)
    return {"message": "Exam updated successfully", "exam_id": exam.id}

@router.delete("/staff-api/exams/{exam_id}", response_model=dict)
async def delete_exam(
    exam_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ("faculty", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or admin can delete exams"
        )
    exam = session.get(ExamTimeTable, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    session.delete(exam)
    session.commit()
    return {"message": "Exam deleted successfully", "exam_id": exam_id} 
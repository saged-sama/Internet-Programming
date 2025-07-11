from datetime import date, time, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.class_schedule import ClassSchedule
from app.models.course import Course
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

router = APIRouter(prefix="/api/scheduling", tags=["scheduling"])

# Pydantic models for class schedule API
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

# Class Schedule Endpoints
@router.get("/schedules", response_model=List[ClassScheduleResponse])
async def get_class_schedules(
    batch: Optional[str] = None,
    semester: Optional[str] = None,
    room: Optional[str] = None,
    course_code: Optional[str] = None,
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
    if course_code:
        query = query.where(ClassSchedule.course_code == course_code)
    
    results = session.exec(query).all()
    
    schedules = []
    for schedule, course in results:
        # Get instructor name
        instructor_query = select(User).where(User.id == schedule.instructor)
        instructor = session.exec(instructor_query).first()
        instructor_name = instructor.name if instructor else "TBA"
        
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
@router.post("/admin/schedules", response_model=dict)
async def create_class_schedule(
    schedule_data: ClassScheduleCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Create a new class schedule (admin only)"""
    
    # Check if user is admin
    if current_user.role != UserRoles.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create schedules"
        )
    
    # Validate that the course exists
    existing_course = session.exec(select(Course).where(Course.course_code == schedule_data.course_code)).first()
    if not existing_course:
        # If course doesn't exist, create it
        new_course = Course(
            course_code=schedule_data.course_code,
            course_title=f"Course {schedule_data.course_code}",  # Default title
            credits=3,  # Default credits
            description=f"Course {schedule_data.course_code} - Auto-created",
            prerequisites=""
        )
        session.add(new_course)
        session.commit()
        session.refresh(new_course)
    
    # Parse time strings
    try:
        start_time = datetime.strptime(schedule_data.start_time, "%H:%M").time()
        end_time = datetime.strptime(schedule_data.end_time, "%H:%M").time()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid time format. Use HH:MM format"
        )
    
    # Validate time range
    if start_time >= end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time"
        )
    
    # Create schedule in database
    try:
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
    
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create schedule: {str(e)}"
        )

@router.get("/admin/schedules", response_model=List[ClassScheduleResponse])
async def get_admin_schedules(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Get all class schedules for admin management"""
    
    # Check if user is admin
    if current_user.role != UserRoles.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this endpoint"
        )
    
    # Get all schedules with course info from database
    query = select(ClassSchedule, Course).join(
        Course, ClassSchedule.course_code == Course.course_code
    )
    
    results = session.exec(query).all()
    
    schedules = []
    for schedule, course in results:
        # Get instructor name
        instructor_query = select(User).where(User.id == schedule.instructor)
        instructor = session.exec(instructor_query).first()
        instructor_name = instructor.name if instructor else "TBA"
        
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

@router.get("/admin/schedules/{schedule_id}", response_model=ClassScheduleResponse)
async def get_class_schedule_by_id(
    schedule_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Get a specific class schedule by ID (admin only)"""
    
    # Check if user is admin
    if current_user.role != UserRoles.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this endpoint"
        )
    
    # Get schedule with course info from database
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
    instructor_name = instructor.name if instructor else "TBA"
    
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

@router.put("/admin/schedules/{schedule_id}", response_model=dict)
async def update_class_schedule(
    schedule_id: int,
    schedule_data: ClassScheduleUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_or_mock)
):
    """Update an existing class schedule (admin only)"""
    
    # Check if user is admin
    if current_user.role != UserRoles.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update schedules"
        )
    
    # Get schedule from database
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
    current_user: User = Depends(get_current_user_or_mock)
):
    """Delete a class schedule (admin only)"""
    
    # Check if user is admin
    if current_user.role != UserRoles.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete schedules"
        )
    
    # Get schedule from database
    schedule = session.get(ClassSchedule, schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    session.delete(schedule)
    session.commit()
    
    return {"message": "Class schedule deleted successfully"}

# Helper endpoints
@router.get("/schedules/rooms", response_model=List[str])
async def get_schedule_rooms(session: Session = Depends(get_session)):
    """Get list of unique rooms used in schedules"""
    
    rooms = session.exec(select(ClassSchedule.room).distinct()).all()
    return [room for room in rooms if room]

@router.get("/schedules/courses", response_model=List[dict])
async def get_available_courses(session: Session = Depends(get_session)):
    """Get list of available courses for scheduling"""
    
    courses = session.exec(select(Course)).all()
    return [
        {
            "course_code": course.course_code,
            "course_title": course.course_title,
            "credits": course.course_credits
        }
        for course in courses
    ]

@router.get("/schedules/batches", response_model=List[str])
async def get_schedule_batches(session: Session = Depends(get_session)):
    """Get list of unique batches in schedules"""
    
    batches = session.exec(select(ClassSchedule.batch).distinct()).all()
    return [batch for batch in batches if batch]

@router.get("/schedules/semesters", response_model=List[str])
async def get_schedule_semesters(session: Session = Depends(get_session)):
    """Get list of unique semesters in schedules"""
    
    semesters = session.exec(select(ClassSchedule.semester).distinct()).all()
    return [semester for semester in semesters if semester]

@router.get("/schedules/instructors", response_model=List[dict])
async def get_schedule_instructors(session: Session = Depends(get_session)):
    """Get list of instructors for scheduling"""
    
    instructors = session.exec(select(User).where(User.role.in_(["faculty", "admin"]))).all()
    return [
        {
            "id": instructor.id,
            "name": instructor.name,
            "email": instructor.email
        }
        for instructor in instructors
    ]

@router.post("/sample-data/courses")
async def create_sample_courses(session: Session = Depends(get_session)):
    """Create sample course data for development"""
    
    sample_courses = [
        {"course_code": "CSE101", "course_title": "Introduction to Programming", "credits": 3},
        {"course_code": "CSE201", "course_title": "Data Structures", "credits": 3},
        {"course_code": "CSE301", "course_title": "Algorithms", "credits": 3},
        {"course_code": "CSE401", "course_title": "Software Engineering", "credits": 3},
        {"course_code": "MAT101", "course_title": "Calculus I", "credits": 3},
        {"course_code": "MAT201", "course_title": "Discrete Mathematics", "credits": 3},
        {"course_code": "PHY101", "course_title": "Physics I", "credits": 3},
        {"course_code": "ENG101", "course_title": "English Composition", "credits": 3},
    ]
    
    for course_data in sample_courses:
        # Check if course already exists
        existing_course = session.exec(select(Course).where(Course.course_code == course_data["course_code"])).first()
        if existing_course:
            continue  # Skip if already exists
        
        # Create course
        course = Course(
            course_code=course_data["course_code"],
            course_title=course_data["course_title"],
            course_credits=course_data["credits"],
            course_description=f"{course_data['course_title']} - {course_data['credits']} credits"
        )
        session.add(course)
    
    session.commit()
    return {"message": "Sample courses created successfully"}

@router.post("/sample-data/instructors")
async def create_sample_instructors(session: Session = Depends(get_session)):
    """Create sample instructor data for development"""
    
    sample_instructors = [
        {"id": "inst1", "name": "Dr. Alice Johnson", "email": "alice.johnson@university.edu", "role": "faculty"},
        {"id": "inst2", "name": "Prof. Bob Wilson", "email": "bob.wilson@university.edu", "role": "faculty"},
        {"id": "inst3", "name": "Dr. Carol Davis", "email": "carol.davis@university.edu", "role": "faculty"},
        {"id": "inst4", "name": "Prof. David Miller", "email": "david.miller@university.edu", "role": "faculty"},
        {"id": "inst5", "name": "Dr. Eva Brown", "email": "eva.brown@university.edu", "role": "faculty"},
    ]
    
    for instructor_data in sample_instructors:
        # Check if instructor already exists
        existing_instructor = session.exec(select(User).where(User.id == instructor_data["id"])).first()
        if existing_instructor:
            continue  # Skip if already exists
        
        # Create instructor
        instructor = User(
            id=instructor_data["id"],
            name=instructor_data["name"],
            email=instructor_data["email"],
            role=UserRoles(instructor_data["role"]),
            password="hashed_password",  # In real scenario, this should be properly hashed
            is_active=True
        )
        session.add(instructor)
    
    session.commit()
    return {"message": "Sample instructors created successfully"} 
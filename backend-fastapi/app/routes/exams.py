from datetime import date, time, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel, validator

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.user import User, UserRoles
from app.models.exam_schedule import ExamTimeTable, ExamTypeEnum

router = APIRouter(prefix="/api/exams", tags=["exams"])

# Pydantic models for exam API
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
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')

    @validator('start_time', 'end_time')
    def validate_time(cls, v):
        try:
            datetime.strptime(v, '%H:%M')
            return v
        except ValueError:
            raise ValueError('Time must be in HH:MM format')

class ExamResponse(BaseModel):
    id: str
    course_code: str
    semester: str
    exam_type: ExamTypeEnum
    exam_schedule: str
    duration: str
    room: str
    invigilator: str

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

# Exam Management Endpoints
@router.post("/staff-api/create", response_model=dict)
async def create_exam(
    exam_data: ExamCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new exam (faculty/admin only)"""
    
    # Only allow faculty or admin
    if current_user.role not in [UserRoles.faculty, UserRoles.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or administrators can create exams"
        )
    
    # Parse date and time
    exam_date = datetime.strptime(exam_data.date, "%Y-%m-%d").date()
    start_time = datetime.strptime(exam_data.start_time, "%H:%M").time()
    end_time = datetime.strptime(exam_data.end_time, "%H:%M").time()
    
    # Create exam in database
    exam = ExamTimeTable(
        course_code=exam_data.course_code,
        course_title=exam_data.course_title,
        batch=exam_data.batch,
        semester=exam_data.semester,
        exam_type=exam_data.exam_type,
        exam_date=exam_date,
        start_time=start_time,
        end_time=end_time,
        room=exam_data.room,
        invigilator=exam_data.invigilator
    )
    
    session.add(exam)
    session.commit()
    session.refresh(exam)
    
    return {"message": "Exam created successfully", "exam_id": exam.id}

@router.get("/staff-api/list", response_model=List[ExamResponse])
async def get_exams(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get all exams (faculty/admin only)"""
    
    # Only allow faculty or admin
    if current_user.role not in [UserRoles.faculty, UserRoles.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or administrators can view exams"
        )
    
    # Get all exams from database
    exams = session.exec(select(ExamTimeTable)).all()
    
    result = []
    for exam in exams:
        # Calculate duration display
        duration = f"{exam.start_time.strftime('%H:%M')} - {exam.end_time.strftime('%H:%M')}"
        
        result.append(ExamResponse(
            id=str(exam.id),
            course_code=exam.course_code or "",
            semester=exam.semester or "",
            exam_type=exam.exam_type,
            exam_schedule=exam.exam_date.strftime("%Y-%m-%d") if exam.exam_date else "",
            duration=duration,
            room=exam.room or "",
            invigilator=exam.invigilator or ""
        ))
    
    return result

@router.get("/staff-api/{exam_id}", response_model=ExamResponse)
async def get_exam_by_id(
    exam_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get a specific exam by ID (faculty/admin only)"""
    
    # Only allow faculty or admin
    if current_user.role not in [UserRoles.faculty, UserRoles.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or administrators can view exam details"
        )
    
    # Get exam from database
    exam = session.get(ExamTimeTable, exam_id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Calculate duration display
    duration = f"{exam.start_time.strftime('%H:%M')} - {exam.end_time.strftime('%H:%M')}"
    
    return ExamResponse(
        id=str(exam.id),
        course_code=exam.course_code or "",
        semester=exam.semester or "",
        exam_type=exam.exam_type,
        exam_schedule=exam.exam_date.strftime("%Y-%m-%d") if exam.exam_date else "",
        duration=duration,
        room=exam.room or "",
        invigilator=exam.invigilator or ""
    )

@router.put("/staff-api/{exam_id}", response_model=dict)
async def update_exam(
    exam_id: str,
    exam_data: ExamUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Update an existing exam (faculty/admin only)"""
    
    # Only allow faculty or admin
    if current_user.role not in [UserRoles.faculty, UserRoles.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or administrators can update exams"
        )
    
    # Get exam from database
    exam = session.get(ExamTimeTable, exam_id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Update fields
    if exam_data.course_code is not None:
        exam.course_code = exam_data.course_code
    if exam_data.course_title is not None:
        exam.course_title = exam_data.course_title
    if exam_data.batch is not None:
        exam.batch = exam_data.batch
    if exam_data.semester is not None:
        exam.semester = exam_data.semester
    if exam_data.exam_type is not None:
        exam.exam_type = exam_data.exam_type
    if exam_data.date is not None:
        exam.exam_date = datetime.strptime(exam_data.date, "%Y-%m-%d").date()
    if exam_data.start_time is not None:
        exam.start_time = datetime.strptime(exam_data.start_time, "%H:%M").time()
    if exam_data.end_time is not None:
        exam.end_time = datetime.strptime(exam_data.end_time, "%H:%M").time()
    if exam_data.room is not None:
        exam.room = exam_data.room
    if exam_data.invigilator is not None:
        exam.invigilator = exam_data.invigilator
    
    session.add(exam)
    session.commit()
    
    return {"message": "Exam updated successfully"}

@router.delete("/staff-api/{exam_id}", response_model=dict)
async def delete_exam(
    exam_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Delete an exam (faculty/admin only)"""
    
    # Only allow faculty or admin
    if current_user.role not in [UserRoles.faculty, UserRoles.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or administrators can delete exams"
        )
    
    # Get exam from database
    exam = session.get(ExamTimeTable, exam_id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    session.delete(exam)
    session.commit()
    
    return {"message": "Exam deleted successfully"}

# Additional endpoints for exam management
@router.get("/staff-api/by-semester/{semester}", response_model=List[ExamResponse])
async def get_exams_by_semester(
    semester: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get exams filtered by semester (faculty/admin only)"""
    
    # Only allow faculty or admin
    if current_user.role not in [UserRoles.faculty, UserRoles.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or administrators can view exams"
        )
    
    # Get exams filtered by semester from database
    exams = session.exec(select(ExamTimeTable).where(ExamTimeTable.semester == semester)).all()
    
    result = []
    for exam in exams:
        duration = f"{exam.start_time.strftime('%H:%M')} - {exam.end_time.strftime('%H:%M')}"
        
        result.append(ExamResponse(
            id=str(exam.id),
            course_code=exam.course_code or "",
            semester=exam.semester or "",
            exam_type=exam.exam_type,
            exam_schedule=exam.exam_date.strftime("%Y-%m-%d") if exam.exam_date else "",
            duration=duration,
            room=exam.room or "",
            invigilator=exam.invigilator or ""
        ))
    
    return result

@router.get("/staff-api/by-batch/{batch}", response_model=List[ExamResponse])
async def get_exams_by_batch(
    batch: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get exams filtered by batch (faculty/admin only)"""
    
    # Only allow faculty or admin
    if current_user.role not in [UserRoles.faculty, UserRoles.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or administrators can view exams"
        )
    
    # Get exams filtered by batch from database
    exams = session.exec(select(ExamTimeTable).where(ExamTimeTable.batch == batch)).all()
    
    result = []
    for exam in exams:
        duration = f"{exam.start_time.strftime('%H:%M')} - {exam.end_time.strftime('%H:%M')}"
        
        result.append(ExamResponse(
            id=str(exam.id),
            course_code=exam.course_code or "",
            semester=exam.semester or "",
            exam_type=exam.exam_type,
            exam_schedule=exam.exam_date.strftime("%Y-%m-%d") if exam.exam_date else "",
            duration=duration,
            room=exam.room or "",
            invigilator=exam.invigilator or ""
        ))
    
    return result 
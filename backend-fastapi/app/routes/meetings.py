from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from pydantic import BaseModel
from datetime import date, time

from app.utils.db import SessionDependency
from app.models.meeting import Meeting, MeetingTypeEnum

router = APIRouter(prefix="/staff-api/meetings", tags=["meetings"])

# Request models for frontend compatibility
class MeetingCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    meeting_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    location: Optional[str] = None
    url: Optional[str] = None
    organizer: Optional[str] = None
    type: Optional[str] = None
    is_registration_required: bool = False

# Response models for frontend compatibility
class MeetingResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    meeting_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    location: Optional[str] = None
    url: Optional[str] = None
    organizer: Optional[str] = None
    type: Optional[str] = None
    is_registration_required: bool = False

class MeetingApiResponse(BaseModel):
    data: List[MeetingResponse]
    total: int
    page: Optional[int] = None
    limit: Optional[int] = None

def meeting_to_response(meeting: Meeting) -> MeetingResponse:
    """Convert backend Meeting model to frontend MeetingResponse"""
    return MeetingResponse(
        id=meeting.id,
        title=meeting.title,
        description=meeting.description,
        meeting_date=meeting.meeting_date,
        start_time=meeting.start_time,
        end_time=meeting.end_time,
        location=meeting.location,
        url=meeting.url,
        organizer=meeting.organizer,
        type=meeting.type.value if meeting.type else None,
        is_registration_required=meeting.is_registration_required
    )

@router.get("/", response_model=MeetingApiResponse)
async def get_meetings(
    session: SessionDependency,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    search_query: Optional[str] = Query(None),
    meeting_type: Optional[MeetingTypeEnum] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    organizer: Optional[str] = Query(None)
):
    """List view of meetings"""
    query = select(Meeting)
    
    # Apply filters
    if search_query:
        query = query.where(
            Meeting.title.contains(search_query) |
            Meeting.description.contains(search_query) |
            Meeting.location.contains(search_query) |
            Meeting.organizer.contains(search_query)
        )
    
    if meeting_type and meeting_type != MeetingTypeEnum.All:
        query = query.where(Meeting.type == meeting_type)
    
    if start_date:
        query = query.where(Meeting.meeting_date >= start_date)
    
    if end_date:
        query = query.where(Meeting.meeting_date <= end_date)
    
    if organizer:
        query = query.where(Meeting.organizer == organizer)
    
    # Sort by date (upcoming first)
    query = query.order_by(Meeting.meeting_date)
    
    # Get total count for pagination
    total_query = select(Meeting)
    if search_query:
        total_query = total_query.where(
            Meeting.title.contains(search_query) |
            Meeting.description.contains(search_query) |
            Meeting.location.contains(search_query) |
            Meeting.organizer.contains(search_query)
        )
    if meeting_type and meeting_type != MeetingTypeEnum.All:
        total_query = total_query.where(Meeting.type == meeting_type)
    if start_date:
        total_query = total_query.where(Meeting.meeting_date >= start_date)
    if end_date:
        total_query = total_query.where(Meeting.meeting_date <= end_date)
    if organizer:
        total_query = total_query.where(Meeting.organizer == organizer)
    
    total = len(session.exec(total_query).all())
    
    # Apply pagination
    meetings = session.exec(query.offset(skip).limit(limit)).all()
    
    return MeetingApiResponse(
        data=[meeting_to_response(meeting) for meeting in meetings],
        total=total,
        page=skip // limit + 1 if limit > 0 else 1,
        limit=limit
    )

@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: int, session: SessionDependency):
    """View a single meeting details"""
    meeting = session.exec(select(Meeting).where(Meeting.id == meeting_id)).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting_to_response(meeting)

@router.post("/", response_model=MeetingResponse)
async def create_meeting(meeting_data: MeetingCreateRequest, session: SessionDependency):
    """Create and schedule new meetings"""
    # Convert type string to enum if provided
    meeting_type = None
    if meeting_data.type:
        try:
            meeting_type = MeetingTypeEnum(meeting_data.type)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid meeting type: {meeting_data.type}")
    
    # Create new meeting
    meeting = Meeting(
        title=meeting_data.title,
        description=meeting_data.description,
        meeting_date=meeting_data.meeting_date,
        start_time=meeting_data.start_time,
        end_time=meeting_data.end_time,
        location=meeting_data.location,
        url=meeting_data.url,
        organizer=meeting_data.organizer,
        type=meeting_type,
        is_registration_required=meeting_data.is_registration_required
    )
    
    session.add(meeting)
    session.commit()
    session.refresh(meeting)
    return meeting_to_response(meeting)

@router.put("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(meeting_id: int, meeting_update: MeetingCreateRequest, session: SessionDependency):
    """Update a meeting"""
    meeting = session.exec(select(Meeting).where(Meeting.id == meeting_id)).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Convert type string to enum if provided
    meeting_type = None
    if meeting_update.type:
        try:
            meeting_type = MeetingTypeEnum(meeting_update.type)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid meeting type: {meeting_update.type}")
    
    # Update meeting fields
    meeting.title = meeting_update.title
    meeting.description = meeting_update.description
    meeting.meeting_date = meeting_update.meeting_date
    meeting.start_time = meeting_update.start_time
    meeting.end_time = meeting_update.end_time
    meeting.location = meeting_update.location
    meeting.url = meeting_update.url
    meeting.organizer = meeting_update.organizer
    meeting.type = meeting_type
    meeting.is_registration_required = meeting_update.is_registration_required
    
    session.add(meeting)
    session.commit()
    session.refresh(meeting)
    return meeting_to_response(meeting)

@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: int, session: SessionDependency):
    """Delete a meeting"""
    meeting = session.exec(select(Meeting).where(Meeting.id == meeting_id)).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    session.delete(meeting)
    session.commit()
    return {"message": "Meeting deleted successfully"}

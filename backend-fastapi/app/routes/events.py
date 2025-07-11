from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from pydantic import BaseModel
from datetime import date, time

from app.utils.db import SessionDependency
from app.models.event import Event, EventCategoryEnum

router = APIRouter(prefix="/staff-api/events", tags=["events"])

# Request models for frontend compatibility
class EventCreateRequest(BaseModel):
    title: str
    event_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    location: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    registration_required: bool = False
    registration_deadline: Optional[date] = None

# Response models for frontend compatibility
class EventResponse(BaseModel):
    id: int
    title: str
    event_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    location: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    registration_required: bool = False
    registration_deadline: Optional[date] = None

class EventApiResponse(BaseModel):
    data: List[EventResponse]
    total: int
    page: Optional[int] = None
    limit: Optional[int] = None

def event_to_response(event: Event) -> EventResponse:
    """Convert backend Event model to frontend EventResponse"""
    return EventResponse(
        id=event.id,
        title=event.title,
        event_date=event.event_date,
        start_time=event.start_time,
        end_time=event.end_time,
        location=event.location,
        category=event.category.value if event.category else None,
        description=event.description,
        image=event.image,
        registration_required=event.registration_required,
        registration_deadline=event.registration_deadline
    )

@router.get("/", response_model=EventApiResponse)
async def get_events(
    session: SessionDependency,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    search_query: Optional[str] = Query(None),
    category: Optional[EventCategoryEnum] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None)
):
    """List/filter upcoming events"""
    query = select(Event)
    
    # Apply filters
    if search_query:
        query = query.where(
            Event.title.contains(search_query) |
            Event.description.contains(search_query) |
            Event.location.contains(search_query)
        )
    
    if category and category != EventCategoryEnum.All:
        query = query.where(Event.category == category)
    
    if start_date:
        query = query.where(Event.event_date >= start_date)
    
    if end_date:
        query = query.where(Event.event_date <= end_date)
    
    # Sort by date (upcoming first)
    query = query.order_by(Event.event_date)
    
    # Get total count for pagination
    total_query = select(Event)
    if search_query:
        total_query = total_query.where(
            Event.title.contains(search_query) |
            Event.description.contains(search_query) |
            Event.location.contains(search_query)
        )
    if category and category != EventCategoryEnum.All:
        total_query = total_query.where(Event.category == category)
    if start_date:
        total_query = total_query.where(Event.event_date >= start_date)
    if end_date:
        total_query = total_query.where(Event.event_date <= end_date)
    
    total = len(session.exec(total_query).all())
    
    # Apply pagination
    events = session.exec(query.offset(skip).limit(limit)).all()
    
    return EventApiResponse(
        data=[event_to_response(event) for event in events],
        total=total,
        page=skip // limit + 1 if limit > 0 else 1,
        limit=limit
    )

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int, session: SessionDependency):
    """View a single event details"""
    event = session.exec(select(Event).where(Event.id == event_id)).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event_to_response(event)

@router.post("/", response_model=EventResponse)
async def create_event(event_data: EventCreateRequest, session: SessionDependency):
    """Create a new event"""
    # Convert category string to enum if provided
    category = None
    if event_data.category:
        try:
            category = EventCategoryEnum(event_data.category)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid category: {event_data.category}")
    
    # Create new event
    event = Event(
        title=event_data.title,
        event_date=event_data.event_date,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        location=event_data.location,
        category=category,
        description=event_data.description,
        image=event_data.image,
        registration_required=event_data.registration_required,
        registration_deadline=event_data.registration_deadline
    )
    
    session.add(event)
    session.commit()
    session.refresh(event)
    return event_to_response(event)

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: int, event_update: EventCreateRequest, session: SessionDependency):
    """Edit an event details"""
    event = session.exec(select(Event).where(Event.id == event_id)).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Convert category string to enum if provided
    category = None
    if event_update.category:
        try:
            category = EventCategoryEnum(event_update.category)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid category: {event_update.category}")
    
    # Update event fields
    event.title = event_update.title
    event.event_date = event_update.event_date
    event.start_time = event_update.start_time
    event.end_time = event_update.end_time
    event.location = event_update.location
    event.category = category
    event.description = event_update.description
    event.image = event_update.image
    event.registration_required = event_update.registration_required
    event.registration_deadline = event_update.registration_deadline
    
    session.add(event)
    session.commit()
    session.refresh(event)
    return event_to_response(event)

@router.delete("/{event_id}")
async def delete_event(event_id: int, session: SessionDependency):
    """Delete an event"""
    event = session.exec(select(Event).where(Event.id == event_id)).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    session.delete(event)
    session.commit()
    return {"message": "Event deleted successfully"}

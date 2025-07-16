from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends, status
from datetime import date

from sqlmodel import select, text

from app.utils.db import SessionDependency
from app.models.notice import Notice, NoticeCategoryEnum, NoticeResponse, NoticeCreateRequest, NoticeUpdateRequest
from app.utils.auth import get_current_user

router = APIRouter(prefix="/staff-api/notices", tags=["notices"])


def notice_to_response(notice: Notice) -> NoticeResponse:
    """Convert backend Notice model to frontend NoticeResponse"""
    return NoticeResponse(
        id=notice.id,
        title=notice.title,
        notice_date=notice.notice_date,
        category=notice.category.value,
        description=notice.description,
        is_important=notice.is_important
    )

@router.get("", response_model=List[NoticeResponse])
async def get_all_notices(
    session: SessionDependency,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all notices with optional filtering by category"""
    query = select(Notice)
    
    if category and category != "All":
        try:
            category_enum = NoticeCategoryEnum(category)
            query = query.where(Notice.category == category_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category: {category}"
            )
    
    # Order by date (newest first) and importance
    query = query.order_by(Notice.is_important.desc(), Notice.notice_date.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    notices = session.exec(query).all()
    return [notice_to_response(notice) for notice in notices]

@router.get("/{notice_id}", response_model=NoticeResponse)
async def get_notice_by_id(notice_id: int, session: SessionDependency):
    """Get a specific notice by ID"""
    notice = session.get(Notice, notice_id)
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notice with ID {notice_id} not found"
        )
    return notice_to_response(notice)

@router.post("", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
async def create_notice(
    notice_data: NoticeCreateRequest,
    session: SessionDependency,
    current_user = Depends(get_current_user)
):
    """Create a new notice (admin only)"""
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create notices"
        )
    
    try:
        category_enum = NoticeCategoryEnum(notice_data.category)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category: {notice_data.category}. Valid categories are: {[c.value for c in NoticeCategoryEnum]}"
        )
    
    # Find the maximum ID currently in the database to ensure a unique ID
    result = session.exec(text("SELECT MAX(id) FROM notice")).one()
    max_id = result[0] if result[0] is not None else 0
    next_id = max_id + 1
    
    # Create new notice with explicit ID to avoid conflicts
    new_notice = Notice(
        id=next_id,  # Set explicit ID to avoid conflicts
        title=notice_data.title,
        category=category_enum,
        description=notice_data.description,
        is_important=notice_data.is_important,
        notice_date=date.today()  # Set current date
    )
    
    try:
        session.add(new_notice)
        session.commit()
        session.refresh(new_notice)
        return notice_to_response(new_notice)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create notice: {str(e)}"
        )

@router.patch("/{notice_id}", response_model=NoticeResponse)
async def update_notice(
    notice_id: int,
    notice_update: NoticeUpdateRequest,
    session: SessionDependency,
    current_user = Depends(get_current_user)
):
    """Update an existing notice (admin only)"""
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update notices"
        )
    
    # Get existing notice
    notice = session.get(Notice, notice_id)
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notice with ID {notice_id} not found"
        )
    
    # Update fields if provided
    if notice_update.title is not None:
        notice.title = notice_update.title
    
    if notice_update.category is not None:
        try:
            notice.category = NoticeCategoryEnum(notice_update.category)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category: {notice_update.category}. Valid categories are: {[c.value for c in NoticeCategoryEnum]}"
            )
    
    if notice_update.description is not None:
        notice.description = notice_update.description
    
    if notice_update.is_important is not None:
        notice.is_important = notice_update.is_important
    
    try:
        session.add(notice)
        session.commit()
        session.refresh(notice)
        return notice_to_response(notice)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update notice: {str(e)}"
        )

@router.delete("/{notice_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notice(
    notice_id: int,
    session: SessionDependency,
    current_user = Depends(get_current_user)
):
    """Delete a notice (admin only)"""
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete notices"
        )
    
    # Get existing notice
    notice = session.get(Notice, notice_id)
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notice with ID {notice_id} not found"
        )
    
    # Delete the notice
    try:
        session.delete(notice)
        session.commit()
        return None
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete notice: {str(e)}"
        )

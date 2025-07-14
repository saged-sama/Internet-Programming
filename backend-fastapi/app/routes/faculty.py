from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.user import (
    User, 
    FacultyProfile, 
    UserResponse, 
    FacultyResponse, 
    FacultyProfileCreateRequest,
    UserRoles,
    FacultyProfileUpdateRequest
)

router = APIRouter(
    prefix="/staff-api/faculty",
    tags=["faculty"],
)


@router.get(
    "/",
    response_model=List[FacultyResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_faculties(
    session: Session = Depends(get_session),
):
    stmt = (
        select(FacultyProfile, User)
        .join(User, FacultyProfile.user_id == User.id)
    )
    rows = session.exec(stmt).all()
    if not rows:
        # optional: return [] rather than 404 if you prefer an empty list
        return []

    return [
        FacultyResponse(
            **faculty.dict(),
            user=UserResponse.from_orm(user),
        )
        for faculty, user in rows
    ]


@router.get(
    "/{faculty_id}",
    response_model=FacultyResponse,
    status_code=status.HTTP_200_OK,
)
async def get_faculty(
    faculty_id: str,
    session: Session = Depends(get_session),
):
    stmt = (
        select(FacultyProfile, User)
        .join(User, FacultyProfile.user_id == User.id)
        .where(FacultyProfile.id == faculty_id)
    )
    row = session.exec(stmt).first()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found",
        )
    faculty, user = row

    return FacultyResponse(
        **faculty.dict(),               # all FacultyProfile fields
        user=UserResponse.from_orm(user),   # nested User fields
    )
    
    
@router.post(
    "/",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
async def create_faculty_profile(
    profile_data: FacultyProfileCreateRequest,
    session: Session = Depends(get_session),
):
    # if current_user.role != UserRoles.admin:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Only admins can create faculty profiles",
    #     )

    # Verify the User exists
    user = session.get(User, profile_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
        
    if user.role != UserRoles.faculty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The specified user is not a faculty",
        )

    id = str(uuid.uuid4())
    # Create and persist the FacultyProfile
    faculty = FacultyProfile(
        id=id,
        user_id=profile_data.user_id,
        specialization=profile_data.specialization,
        research_interests=profile_data.research_interests,
        publications=profile_data.publications,
        courses_taught=profile_data.courses_taught,
        office_hours=profile_data.office_hours,
        office_location=profile_data.office_location,
    )
    session.add(faculty)
    session.commit()
    session.refresh(faculty)

    return {
        "message": "Faculty profile created successfully",
        "faculty_id": faculty.id,
    }


@router.patch(
    "/{faculty_id}",
    response_model=FacultyResponse,
    status_code=status.HTTP_200_OK,
)
async def update_faculty_profile(
    faculty_id: str,
    profile_data: FacultyProfileUpdateRequest,
    session: Session = Depends(get_session),
):
    # 1. fetch existing profile
    faculty = session.get(FacultyProfile, faculty_id)
    if not faculty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty profile not found",
        )

    # 2. apply only the fields the client sent
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faculty, field, value)

    # 3. persist & refresh
    session.add(faculty)
    session.commit()
    session.refresh(faculty)

    # 4. load nested user and return the new shape
    user = session.get(User, faculty.user_id)
    return FacultyResponse(
        **faculty.dict(),
        user=UserResponse.from_orm(user),
    )

from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.utils.db import get_session
from app.models.user import (
    User,
    StudentProfile,
    UserResponse,
    StudentResponse,
    StudentProfileCreateRequest,
    StudentProfileUpdateRequest,
    UserRoles,
)

router = APIRouter(
    prefix="/staff-api/student",
    tags=["student"],
)


@router.get(
    "/",
    response_model=List[StudentResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_students(
    session: Session = Depends(get_session),
):
    stmt = (
        select(StudentProfile, User)
        .join(User, StudentProfile.user_id == User.id)
    )
    rows = session.exec(stmt).all()
    if not rows:
        return []

    return [
        StudentResponse(
            **student.dict(),
            user=UserResponse.from_orm(user),
        )
        for student, user in rows
    ]


@router.get(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
)
async def get_student(
    student_id: str,
    session: Session = Depends(get_session),
):
    stmt = (
        select(StudentProfile, User)
        .join(User, StudentProfile.user_id == User.id)
        .where(StudentProfile.id == student_id)
    )
    row = session.exec(stmt).first()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )
    student, user = row
    return StudentResponse(
        **student.dict(),
        user=UserResponse.from_orm(user),
    )


@router.post(
    "/",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
async def create_student_profile(
    profile_data: StudentProfileCreateRequest,
    session: Session = Depends(get_session),
):
    # Optional: enforce that only admins can create student profiles
    # current_user = Depends(get_current_user)
    # if current_user.role != UserRoles.admin:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Only admins can create student profiles",
    #     )

    user = session.get(User, profile_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if user.role != UserRoles.student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The specified user is not a student",
        )

    new_id = str(uuid.uuid4())
    student = StudentProfile(
        id=new_id,
        user_id=profile_data.user_id,
        student_id=profile_data.student_id,
        major=profile_data.major,
        admission_date=profile_data.admission_date,
        graduation_date=profile_data.graduation_date,
        year_of_study=profile_data.year_of_study,
        student_type=profile_data.student_type,
        cgpa=profile_data.cgpa,
        extracurricular_activities=profile_data.extracurricular_activities,
    )
    session.add(student)
    session.commit()
    session.refresh(student)

    return {
        "message": "Student profile created successfully",
        "student_id": student.id,
    }


@router.patch(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
)
async def update_student_profile(
    student_id: str,
    profile_data: StudentProfileUpdateRequest,
    session: Session = Depends(get_session),
):
    student = session.get(StudentProfile, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)

    session.add(student)
    session.commit()
    session.refresh(student)

    user = session.get(User, student.user_id)
    return StudentResponse(
        **student.dict(),
        user=UserResponse.from_orm(user),
    )

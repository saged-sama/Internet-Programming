from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.user import User, UserCreateRequest, UserRoles
from app.models.user import UserResponse

router = APIRouter(
    prefix="/users-api/profiles",
    tags=["users"],
)

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def get_user(
    user_id: str,
    session: Session = Depends(get_session),
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.get(
    "/",
    response_model=List[UserResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_users(
    session: Session = Depends(get_session),
):
    users = session.exec(select(User)).all()
    
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users found",
        )
    
    return users

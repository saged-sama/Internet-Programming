from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, File, HTTPException, Path, Query, UploadFile, status
from sqlmodel import Session, select

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.user import User, UserCreateRequest, UserRoles
from app.models.user import UserResponse
from app.utils.file_handler import BaseFilePath, delete_file, save_file

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

@router.put(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def update_user(
    user_id: Annotated[str, Path()],
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    name: Annotated[Optional[str], Query()] = None,
    image: Annotated[Optional[UploadFile], File()] = None,
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update users",
        )
    
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    user.name = name
    if image:
        if user.image:
            delete_file(BaseFilePath + user.image)
        filename, _, _ = save_file(image)
        if not filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to save image",
            )
        user.image = "/api/files/" + filename
        print(f"Updated user image: {user.image}")
    
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return user
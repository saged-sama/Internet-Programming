from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Body, Form, HTTPException, Response
from sqlmodel import select

from app.utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token
from app.utils.crypt import get_password_hash
from app.utils.db import SessionDependency
from app.models.user import User, UserCreateRequest, UserLoginRequest, UserVerificationStatus
import random

router = APIRouter()

@router.post("/username_exists")
async def username_exists(username: Annotated[str, Body()], session: SessionDependency):
    user = session.exec(select(User).where(User.email == username)).first()
    if user:
        return {"exists": True}
    return {"exists": False}

@router.post("/signup")
async def signup(user_create_request: Annotated[UserCreateRequest, Form()], session: SessionDependency):
    try:
        user = session.exec(select(User).where(User.email == user_create_request.email)).first()
        if user:
            raise HTTPException(status_code=400, detail="User already exists")
        if user_create_request.password != user_create_request.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        new_user = User(
            username=user_create_request.email,
            hashed_password=get_password_hash(user_create_request.password),
            name=user_create_request.firstname + " " + user_create_request.lastname,
            email=user_create_request.email,
            role=user_create_request.role,
            id=user_create_request.id,
            verification=UserVerificationStatus.Verified
        )
        # print(f"Creating new user: {new_user}")
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"message": "User created successfully", "user": new_user.email}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(login_request: Annotated[UserLoginRequest, Form()], session: SessionDependency):
    try:
        user = authenticate_user(session, login_request.username, login_request.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
        
        response = Response(content='{"access_token": "' + access_token + '", "user": {"id": "' + user.id + '", "email": "' + user.email + '", "role": "' + user.role + '", "name": "' + user.name + '", "image": "' + (user.image or "") + '"}}', media_type="application/json")
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="strict")
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Body, Form, HTTPException, Response
from sqlmodel import select

from app.utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token
from app.utils.crypt import get_password_hash
from app.utils.db import SessionDependency
from app.models.user import User, UserCreateRequest, UserLoginRequest
import random

router = APIRouter()

@router.post("/username_exists")
async def username_exists(username: Annotated[str, Body()], session: SessionDependency):
    user = session.exec(select(User).where(User.username == username)).first()
    if user:
        return {"exists": True}
    return {"exists": False}

@router.post("/signup")
async def signup(user_create_request: Annotated[UserCreateRequest, Form()], session: SessionDependency):
    user = session.exec(select(User).where(User.username == user_create_request.username)).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = User(
        username=user_create_request.username,
        password=get_password_hash(user_create_request.password),
        avatar=random.randint(1, 34)
    )
    # print(f"Creating new user: {new_user}")
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "User created successfully", "user": new_user.username}

@router.post("/login")
async def login(login_request: Annotated[UserLoginRequest, Form()], session: SessionDependency):
    
    user = authenticate_user(session, login_request.username, login_request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    response = Response(content='{"access_token": "' + access_token + '"}', media_type="application/json")
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="strict")
    return response
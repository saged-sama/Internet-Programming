from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlmodel import Session, select

from app.models.user import UserRoles, User
from app.utils.db import get_session
from app.utils.config import settings

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm

class RBACMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        pathname = request.url.path
        
        if pathname.startswith("/staff-api"):
            # Extract token from Authorization header
            authorization = request.headers.get("Authorization")
            if not authorization or not authorization.startswith("Bearer "):
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Authorization header missing or invalid"}
                )
            
            token = authorization.split(" ")[1]
            
            try:
                # Decode JWT token
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                username = payload.get("sub")
                
                if not username:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "Invalid token"}
                    )
                
                # Get user from database
                session = next(get_session())
                user = session.exec(select(User).where(User.email == username)).first()
                
                if not user:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "User not found"}
                    )
                
                # Check if user has admin role
                if user.role != UserRoles.admin:
                    return JSONResponse(
                        status_code=status.HTTP_403_FORBIDDEN,
                        content={"detail": "Admin privileges required"}
                    )
                
            except jwt.PyJWTError:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid token"}
                )
            except Exception as e:
                return JSONResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    content={"detail": "Authentication error"}
                )

        response = await call_next(request)
        return response
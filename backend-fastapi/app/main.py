from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.utils.db import create_db_and_tables
from .routes import (
    auth,  
    courses,  
    programs, 
    
  
)
from .routes import auth, scheduling
from .routes import assignments

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(
    title="University Management System API",
    description="A comprehensive API for managing university operations including users, courses, assignments, grades, and more.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173", "https://gossip-sand.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Main entity routes
app.include_router(courses.router, prefix="/api")
app.include_router(programs.router, prefix="/api")




@app.get("/")
async def root():
    return {"message": "University Management System API", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "University Management System API is running"}
app.include_router(scheduling.router)
app.include_router(assignments.router)
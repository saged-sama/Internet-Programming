from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.utils.db import create_db_and_tables
from .routes import (
    files,
    auth,
    courses,
    faculty,
    programs,
    assignments,
    scheduling,
    rooms,
    exams,
    events,
    meetings,
    lab_equipments as equipments,
    financials,
    students,
    users,
    grades,
    notices,
    projects,
    results
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:4173", "https://gossip-sand.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Main entity routes
app.include_router(courses.router, prefix="/api")
app.include_router(programs.router, prefix="/api")
app.include_router(projects.router, prefix="/api")  # Add this line
app.include_router(scheduling.router)
app.include_router(rooms.router)
app.include_router(exams.router)
app.include_router(assignments.router)
app.include_router(events.router)
app.include_router(meetings.router)
app.include_router(equipments.router)
app.include_router(notices.router)

app.include_router(financials.router, prefix="/api/financials")
app.include_router(faculty.router)
app.include_router(users.router)
app.include_router(students.router)
app.include_router(files.router)
app.include_router(grades.router, tags=["Grades"])
app.include_router(results.router)
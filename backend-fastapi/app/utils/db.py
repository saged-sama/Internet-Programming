from sqlmodel import SQLModel, Session, create_engine
from typing import Annotated
from fastapi import Depends
from app.utils.config import settings

# Import all models to ensure they are registered with SQLModel before table creation
from app.models.user import User, FacultyProfile, StudentProfile, StaffProfile, UserEducation, UserPublication
from app.models.program import Program
from app.models.course import Course, CourseMaterial
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.class_schedule import ClassSchedule
from app.models.equipment import LabEquipment, Booking
from app.models.event import Event, EventCategoryEnum
from app.models.fee import Fee, FeePayment
from app.models.grades import Grade
from app.models.meeting import Meeting
from app.models.project import Project, ProjectTeamMember
from app.models.research import ResearchPaper, ResearchPaperAuthor
from app.models.room import Room, RoomAvailabilitySlot, RoomBooking
from app.models.all_models import AcademicResource, Announcement, Notice, ContactDepartment, ContactInfo, Award

db_url = settings.database_url
connect_args = {"check_same_thread": False}
engine = create_engine(db_url, echo=True)

def create_db_and_tables():
    print(f"Connecting to the database...{db_url}")
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDependency = Annotated[Session, Depends(get_session)]
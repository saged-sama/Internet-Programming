# Import all models to ensure they are registered with SQLModel
from .user import User, FacultyProfile, StudentProfile, StaffProfile, UserEducation, UserPublication, UserCreateRequest, UserLoginRequest, UserRoles, StudentTypeEnum
from .program import Program
from .course import Course, CourseType, CourseMaterial
from .assignment import Assignment, AssignmentSubmission
from .class_schedule import ClassSchedule
from .equipment import LabEquipment, Booking
from .event import Event, EventCategoryEnum
from .notice import Notice, NoticeCategoryEnum
from .exam import ExamTimeTable, ExamTypeEnum
from .fee import Fee, FeePayment, StudentFee, StripePaymentIntent, FeeTypeEnum, FeeStatusEnum, PaymentMethodEnum
from .grades import Grade
from .meeting import Meeting
from .project import Project, ProjectTeamMember
from .research import ResearchPaper, ResearchPaperAuthor
from .room import Room, RoomAvailabilitySlot, RoomBooking

from enum import Enum
from typing import Optional
from datetime import date
from sqlmodel import Field, SQLModel

class ContactSubjectEnum(str, Enum):
    General_Inquiry = "General Inquiry"
    Admissions = "Admissions"
    Academic = "Academic"
    Financial_Aid = "Financial Aid"
    Technical_Support = "Technical Support"
    Other = "Other"

class AcademicResource(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    icon: Optional[str]
    description: Optional[str]
    link: Optional[str]

class Announcement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    date: date
    category: Optional[str]
    description: Optional[str]

# Notice model is now imported from notice.py

class ContactDepartment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: Optional[str]
    phone: Optional[str]

class ContactInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    address_line1: Optional[str]
    address_line2: Optional[str]
    city: Optional[str]
    postal_code: Optional[str]
    campus: Optional[str]
    email: Optional[str]
    phone: Optional[str]

class Award(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: Optional[str]
    description: Optional[str]
    recipient: Optional[str] = Field(default=None, foreign_key="user.id")
    year: Optional[int]
    type: Optional[str]
    status: Optional[str]

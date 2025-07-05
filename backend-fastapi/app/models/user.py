from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, SQLModel

class UserRoles(str, Enum):
    student = "student"
    faculty = "faculty"
    staff = "staff"
    admin = "admin"

class User(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    name: str
    role: Optional[UserRoles] = Field(default=UserRoles.student, sa_column_kwargs={"server_default": UserRoles.student})
    department: Optional[str]
    title: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    image: Optional[str]
    bio: Optional[str]
    address: Optional[str]
    date_of_birth: Optional[date]

class FacultyProfile(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(foreign_key="user.id")
    specialization: Optional[str]
    research_interests: Optional[str]
    publications: Optional[str]
    courses_taught: Optional[str]
    office_hours: Optional[str]
    office_location: Optional[str]

class StudentProfile(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(foreign_key="user.id")
    student_id: Optional[str]
    major: Optional[str]
    admission_date: Optional[date]
    graduation_date: Optional[date]
    year_of_study: Optional[int]
    cgpa: Optional[float]
    extracurricular_activities: Optional[str]

class StaffProfile(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(foreign_key="user.id")
    position: Optional[str]
    department: Optional[str]
    responsibilities: Optional[str]
    office_location: Optional[str]
    joining_date: Optional[date]

class UserEducation(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(foreign_key="user.id")
    degree: Optional[str]
    institution: Optional[str]
    graduation_year: Optional[date]

class UserPublication(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(foreign_key="user.id")
    publication: Optional[str]

class UserCreateRequest(BaseModel):
    id: Optional[str] = None
    firstname: str
    lastname: str
    email: str
    role: Optional[UserRoles] = UserRoles.student
    password: str
    confirm_password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str
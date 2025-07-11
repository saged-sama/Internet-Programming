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

class StudentTypeEnum(str, Enum):
    Regular = "Regular"
    Transfer = "Transfer"
    Exchange = "Exchange"

class UserVerificationStatus(str, Enum):
    Pending = "Pending"
    Verified = "Verified"
    Rejected = "Rejected"

class User(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    role: UserRoles = Field(default=UserRoles.student, sa_column_kwargs={"server_default": UserRoles.student})
    department: Optional[str] = Field(default="Department of Computer Science and Engineering", sa_column_kwargs={"server_default": "Department of Computer Science and Engineering"})
    verification: Optional[UserVerificationStatus] = Field(
        default=UserVerificationStatus.Pending,
        sa_column_kwargs={"server_default": UserVerificationStatus.Pending}
    )
    email: str
    phone: Optional[str]
    image: Optional[str]
    bio: Optional[str]
    address: Optional[str]
    date_of_birth: Optional[date]
    hashed_password: str

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
    current_program: Optional[str] = Field(foreign_key="program.id")
    student_type: Optional[str]
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
    id: str
    firstname: str
    lastname: str
    email: str
    role: UserRoles = UserRoles.student
    password: str
    confirm_password: str

class UserLoginRequest(BaseModel):
    username: str = None
    password: str
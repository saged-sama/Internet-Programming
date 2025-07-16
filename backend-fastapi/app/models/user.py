from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, SQLModel

from app.models.course import CourseSemester

class UserRoles(str, Enum):
    student = "student"
    faculty = "faculty"
    admin = "admin"

class StudentTypeEnum(str, Enum):
    Regular = "Regular"
    Transfer = "Transfer"
    Exchange = "Exchange"

class FacultyRoleEnum(str, Enum):
    Lecturer = "Lecturer"
    Assistant_Professor = "Assistant Professor"
    Associate_Professor = "Associate Professor"
    Professor = "Professor"


class StudentDegreeEnum(str, Enum):
    BSc = "BSc"
    MSc = "MSc"
    PhD = "PhD"

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
    current_role: Optional[str] = Field(default=FacultyRoleEnum.Lecturer)
    specialization: Optional[str]
    research_interests: Optional[str]
    publications: Optional[str]
    courses_taught: Optional[str]
    office_hours: Optional[str]
    office_location: Optional[str]
    chairman: bool = Field(default=False)


# class StudentProfile(SQLModel, table=True):
#     id: Optional[str] = Field(default=None, primary_key=True)
#     user_id: Optional[str] = Field(foreign_key="user.id")
#     department: Optional[str]
#     responsibilities: Optional[str]
#     office_location: Optional[str]
#     joining_date: Optional[date]

class StudentProfile(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(foreign_key="user.id")
    student_id: Optional[str]
    major: Optional[str]
    current_degree: Optional[str] = Field(default=StudentDegreeEnum.BSc)
    admission_date: Optional[date]
    graduation_date: Optional[date]
    year_of_study: Optional[int]
    current_semester: Optional[CourseSemester] = Field(default="first")
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
    username: str
    password: str
    
    
class UserResponse(BaseModel):
    id: str
    name: str
    role: Optional[UserRoles]
    department: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    image: Optional[str]
    bio: Optional[str]
    address: Optional[str]
    date_of_birth: Optional[date]
    
    model_config = {
        "from_attributes": True
    }
    

class FacultyResponse(BaseModel):
    id: str
    user_id: str
    current_role: Optional[str]
    specialization: Optional[str]
    research_interests: Optional[str]
    publications: Optional[str]
    courses_taught: Optional[str]
    office_hours: Optional[str]
    office_location: Optional[str]
    chairman: bool
    user: UserResponse
    
    model_config = {
        "from_attributes": True
    }
    

class FacultyProfileCreateRequest(BaseModel):
    user_id: str
    current_role: Optional[str] = None
    specialization: Optional[str] = None
    research_interests: Optional[str] = None
    publications: Optional[str] = None
    courses_taught: Optional[str] = None
    office_hours: Optional[str] = None
    office_location: Optional[str] = None
    chairman: bool = False


class FacultyProfileUpdateRequest(BaseModel):
    current_role: Optional[str] = None
    specialization: Optional[str] = None
    research_interests: Optional[str] = None
    publications: Optional[str] = None
    courses_taught: Optional[str] = None
    office_hours: Optional[str] = None
    office_location: Optional[str] = None
    chairman: bool = False
    

class StudentResponse(BaseModel):
    id: str
    user_id: str
    student_id: Optional[str]
    major: Optional[str]
    current_degree: Optional[str]
    admission_date: Optional[date]
    graduation_date: Optional[date]
    year_of_study: Optional[int]
    current_semester: Optional[CourseSemester] = Field(default="first")
    student_type: Optional[str]
    cgpa: Optional[float]
    extracurricular_activities: Optional[str]
    user: UserResponse

    model_config = { "from_attributes": True }


class StudentProfileCreateRequest(BaseModel):
    user_id: str
    student_id: Optional[str] = None
    major: Optional[str] = None
    current_degree: Optional[str] = None
    admission_date: Optional[date] = None
    graduation_date: Optional[date] = None
    year_of_study: Optional[int] = None
    current_semester: Optional[CourseSemester] = None
    student_type: Optional[str] = None
    cgpa: Optional[float] = None
    extracurricular_activities: Optional[str] = None


class StudentProfileUpdateRequest(BaseModel):
    student_id: Optional[str] = None
    major: Optional[str] = None
    current_degree: Optional[str] = None
    admission_date: Optional[date] = None
    graduation_date: Optional[date] = None
    year_of_study: Optional[int] = None
    student_type: Optional[str] = None
    cgpa: Optional[float] = None
    extracurricular_activities: Optional[str] = None
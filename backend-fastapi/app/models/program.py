from datetime import date
from typing import Optional, List, Dict
from sqlmodel import Field, SQLModel, JSON, Column
from enum import Enum

class DegreeLevel(str, Enum):
    undergraduate = "undergraduate"
    graduate = "graduate"
    doctorate = "doctorate"

class Curriculum(SQLModel):
    coreCourses: List[str] = []
    electiveCourses: Optional[List[str]] = []
    totalCredits: Optional[int] = None

class Program(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str = Field(max_length=200)
    level: DegreeLevel
    description: str = Field(max_length=1000)
    creditsRequired: int
    duration: str  # e.g., "4 years", "1.5-2 years"
    department: Optional[str] = None
    concentrations: Optional[List[str]] = Field(default=[], sa_column=Column(JSON))
    admissionRequirements: List[str] = Field(default=[], sa_column=Column(JSON))
    careerOpportunities: List[str] = Field(default=[], sa_column=Column(JSON))
    curriculum: Optional[Dict] = Field(default={}, sa_column=Column(JSON))  # Will store Curriculum structure
    updatedAt: Optional[date] = None
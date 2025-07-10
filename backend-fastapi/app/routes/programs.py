from typing import List, Optional, Dict
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from pydantic import BaseModel

from app.utils.db import SessionDependency
from app.models.program import Program, DegreeLevel

router = APIRouter(prefix="/programs", tags=["programs"])

# Response models for frontend compatibility
class DegreeResponse(BaseModel):
    id: str
    title: str
    level: str
    description: str
    creditsRequired: int
    duration: str
    concentrations: List[str] = []
    admissionRequirements: List[str] = []
    careerOpportunities: List[str] = []
    curriculum: Dict = {}
    updatedAt: Optional[str] = None
    departmentId: Optional[str] = None

class DegreeApiResponse(BaseModel):
    data: List[DegreeResponse]
    total: int
    page: Optional[int] = None
    limit: Optional[int] = None

def program_to_response(program: Program) -> DegreeResponse:
    """Convert backend Program model to frontend DegreeResponse"""
    return DegreeResponse(
        id=program.id,
        title=program.title,
        level=program.level.value,
        description=program.description,
        creditsRequired=program.creditsRequired,
        duration=program.duration,
        concentrations=program.concentrations or [],
        admissionRequirements=program.admissionRequirements or [],
        careerOpportunities=program.careerOpportunities or [],
        curriculum=program.curriculum or {},
        updatedAt=program.updatedAt.isoformat() if program.updatedAt else None,
        departmentId=program.department
    )

@router.get("/", response_model=DegreeApiResponse)
async def get_programs(
    session: SessionDependency,
    level: Optional[DegreeLevel] = Query(None),
    searchQuery: Optional[str] = Query(None),
    departmentId: Optional[str] = Query(None),
    skip: int = Query(0, ge=0, alias="offset"),
    limit: int = Query(100, le=100)
):
    """Get all degree programs with filtering"""
    query = select(Program)
    
    # Apply filters
    if level:
        query = query.where(Program.level == level)
    
    if departmentId:
        query = query.where(Program.department == departmentId)
    
    if searchQuery:
        search_term = f"%{searchQuery}%"
        query = query.where(
            Program.title.contains(searchQuery) |
            Program.description.contains(searchQuery)
        )
    
    # Get total count for pagination
    total_query = select(Program)
    if level:
        total_query = total_query.where(Program.level == level)
    if departmentId:
        total_query = total_query.where(Program.department == departmentId)
    if searchQuery:
        total_query = total_query.where(
            Program.title.contains(searchQuery) |
            Program.description.contains(searchQuery)
        )
    
    total = len(session.exec(total_query).all())
    
    # Apply pagination
    programs = session.exec(query.offset(skip).limit(limit)).all()
    
    return DegreeApiResponse(
        data=[program_to_response(program) for program in programs],
        total=total,
        page=skip // limit + 1 if limit > 0 else 1,
        limit=limit
    )

@router.get("/{program_id}", response_model=DegreeResponse)
async def get_program(program_id: str, session: SessionDependency):
    """Get a specific program"""
    program = session.exec(select(Program).where(Program.id == program_id)).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program_to_response(program)

@router.post("/", response_model=DegreeResponse)
async def create_program(program: Program, session: SessionDependency):
    """Create a new program"""
    # Check if program already exists
    existing_program = session.exec(select(Program).where(Program.id == program.id)).first()
    if existing_program:
        raise HTTPException(status_code=400, detail="Program with this ID already exists")
    
    session.add(program)
    session.commit()
    session.refresh(program)
    return program_to_response(program)

@router.put("/{program_id}", response_model=DegreeResponse)
async def update_program(program_id: str, program_update: Program, session: SessionDependency):
    """Update program information"""
    program = session.exec(select(Program).where(Program.id == program_id)).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    program_data = program_update.model_dump(exclude_unset=True)
    for field, value in program_data.items():
        setattr(program, field, value)
    
    session.add(program)
    session.commit()
    session.refresh(program)
    return program_to_response(program)

@router.delete("/{program_id}")
async def delete_program(program_id: str, session: SessionDependency):
    """Delete a program"""
    program = session.exec(select(Program).where(Program.id == program_id)).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    session.delete(program)
    session.commit()
    return {"message": "Program deleted successfully"}

@router.get("/departments/list")
async def get_departments(session: SessionDependency):
    """Get list of unique departments"""
    result = session.exec(select(Program.department).distinct()).all()
    departments = [dept for dept in result if dept is not None]
    return {"departments": departments}

@router.get("/levels/list")
async def get_levels(session: SessionDependency):
    """Get list of available degree levels"""
    return {"levels": [level.value for level in DegreeLevel]} 
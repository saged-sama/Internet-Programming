from typing import Annotated, List, Optional
from uuid import uuid4
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlmodel import select
from pydantic import BaseModel

from app.models.user import User
from app.utils.auth import get_current_user
from app.utils.db import SessionDependency
from app.models.course import Course, CourseMaterial, CourseDegreeLevel, CourseMaterialCreateRequest, CourseSemester
from app.utils.file_handler import BaseFilePath, save_file

router = APIRouter(prefix="/courses", tags=["courses"])

# Request models for frontend compatibility
class CourseCreateRequest(BaseModel):
    course_code: str
    course_title: str
    course_description: Optional[str] = None
    course_credits: Optional[float] = None
    degree_level: Optional[str] = None
    semester: Optional[str] = None
    prerequisites: Optional[List[str]] = []
    topics: Optional[List[str]] = []
    objectives: Optional[List[str]] = []
    learning_outcomes: Optional[List[str]] = []

# Response models for frontend compatibility
class CourseResponse(BaseModel):
    id: str
    code: str
    name: str
    description: str
    credits: float
    degreeLevel: Optional[str] = None
    semester: Optional[str] = None
    instructor: Optional[str] = None
    prerequisites: List[str] = []
    topics: List[str] = []
    objectives: List[str] = []
    outcomes: List[str] = []

class CourseApiResponse(BaseModel):
    data: List[CourseResponse]
    total: int
    page: Optional[int] = None
    limit: Optional[int] = None

def course_to_response(course: Course) -> CourseResponse:
    """Convert backend Course model to frontend CourseResponse"""
    return CourseResponse(
        id=course.course_code,  # Use course_code as id for frontend
        code=course.course_code,
        name=course.course_title,
        description=course.course_description or "",
        credits=course.course_credits or 0,
        degreeLevel=course.degree_level.value if course.degree_level else None,
        semester=course.semester.value if course.semester else None,
        instructor=course.instructor,
        prerequisites=course.prerequisites or [],
        topics=course.topics or [],
        objectives=course.objectives or [],
        outcomes=course.learning_outcomes or []
    )

@router.get("/", response_model=CourseApiResponse)
async def get_courses(
    session: SessionDependency,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    searchQuery: Optional[str] = Query(None),
    degreeLevel: Optional[CourseDegreeLevel] = Query(None),
    semester: Optional[CourseSemester] = Query(None),
    departmentId: Optional[str] = Query(None)
):
    """Get all courses with filtering"""
    query = select(Course)
    
    # Apply filters
    if searchQuery:
        query = query.where(
            Course.course_title.contains(searchQuery) |
            Course.course_description.contains(searchQuery) |
            Course.course_code.contains(searchQuery)
        )
    
    if degreeLevel:
        query = query.where(Course.degree_level == degreeLevel)
    
    if semester:
        query = query.where(Course.semester == semester)
    
    # Get total count for pagination
    total_query = select(Course)
    if searchQuery:
        total_query = total_query.where(
            Course.course_title.contains(searchQuery) |
            Course.course_description.contains(searchQuery) |
            Course.course_code.contains(searchQuery)
        )
    if degreeLevel:
        total_query = total_query.where(Course.degree_level == degreeLevel)
    if semester:
        total_query = total_query.where(Course.semester == semester)
    
    total = len(session.exec(total_query).all())
    
    # Apply pagination
    courses = session.exec(query.offset(skip).limit(limit)).all()
    
    return CourseApiResponse(
        data=[course_to_response(course) for course in courses],
        total=total,
        page=skip // limit + 1 if limit > 0 else 1,
        limit=limit
    )

@router.get("/codes", response_model=List[str])
async def get_course_codes(session: SessionDependency):
    """Get a list of all course codes"""
    codes = session.exec(select(Course.course_code)).all()
    return codes

@router.get("/{course_code}", response_model=CourseResponse)
async def get_course(course_code: str, session: SessionDependency):
    """Get a specific course by code"""
    course = session.exec(select(Course).where(Course.course_code == course_code)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course_to_response(course)

@router.post("/", response_model=CourseResponse)
async def create_course(course_data: CourseCreateRequest, session: SessionDependency, current_user: Annotated[User, Depends(get_current_user)]):
    if not current_user or current_user.role == "student":
        raise HTTPException(status_code=403, detail="Only instructors can create courses")
    """Create a new course"""
    # Check if course already exists
    existing_course = session.exec(select(Course).where(Course.course_code == course_data.course_code)).first()
    if existing_course:
        raise HTTPException(status_code=400, detail="Course with this code already exists")
    
    # Convert string enum values to proper enum types
    degree_level = None
    if course_data.degree_level:
        try:
            degree_level = CourseDegreeLevel(course_data.degree_level)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid degree level: {course_data.degree_level}")
    
    semester = None
    if course_data.semester:
        try:
            semester = CourseSemester(course_data.semester)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid semester: {course_data.semester}")
    
    # Create Course object
    course = Course(
        course_code=course_data.course_code,
        course_title=course_data.course_title,
        course_description=course_data.course_description,
        course_credits=course_data.course_credits,
        degree_level=degree_level,
        semester=semester,
        instructor=current_user.id,
        prerequisites=course_data.prerequisites or [],
        topics=course_data.topics or [],
        objectives=course_data.objectives or [],
        learning_outcomes=course_data.learning_outcomes or []
    )
    
    session.add(course)
    session.commit()
    session.refresh(course)
    return course_to_response(course)

@router.put("/{course_code}", response_model=CourseResponse)
async def update_course(course_code: str, course_update: Course, session: SessionDependency):
    """Update course information"""
    course = session.exec(select(Course).where(Course.course_code == course_code)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course_data = course_update.model_dump(exclude_unset=True)
    for field, value in course_data.items():
        setattr(course, field, value)
    
    session.add(course)
    session.commit()
    session.refresh(course)
    return course_to_response(course)

@router.delete("/{course_code}")
async def delete_course(course_code: str, session: SessionDependency):
    """Delete a course"""
    course = session.exec(select(Course).where(Course.course_code == course_code)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    session.delete(course)
    session.commit()
    return {"message": "Course deleted successfully"}

# Course Materials endpoints
@router.get("/{course_code}/materials", response_model=List[CourseMaterial])
async def get_course_materials(course_code: str, session: SessionDependency):
    """Get all materials for a course"""
    materials = session.exec(select(CourseMaterial).where(CourseMaterial.course_code == course_code)).all()
    return materials

@router.post("/{course_code}/materials", response_model=CourseMaterial)
async def add_course_material(
    session: SessionDependency,
    current_user: Annotated[User, Depends(get_current_user)],
    course_code: str,
    title: Annotated[str, Form()],
    type: Annotated[str, Form()],
    description: Annotated[Optional[str], Form()] = None,
    file: Annotated[Optional[UploadFile], File()] = None
):
    # Permission check
    if (not current_user) or (current_user.role == "student"):
        raise HTTPException(status_code=403, detail="Only instructors can add materials")

    course = session.exec(select(Course).where(Course.course_code == course_code)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    filename, file_type, file_size = save_file(file) if file else (None, None, None)
    file_url = f"/api/files/{filename}" if filename else None

    new_material = CourseMaterial(
        id=uuid4().hex,
        course_code=course_code,
        title=title,
        type=type,
        description=description,
        file_url=file_url,
        file_type=file_type,
        file_size=file_size,
        uploaded_by=current_user.id
    )

    session.add(new_material)
    session.commit()
    session.refresh(new_material)
    return new_material


@router.get("/materials/{material_id}", response_model=CourseMaterial)
async def get_course_material(material_id: str, session: SessionDependency):
    """Get a specific course material"""
    material = session.exec(select(CourseMaterial).where(CourseMaterial.id == material_id)).first()
    if not material:
        raise HTTPException(status_code=404, detail="Course material not found")
    return material

@router.put("/materials/{material_id}", response_model=CourseMaterial)
async def update_course_material(material_id: str, material_update: CourseMaterial, session: SessionDependency):
    """Update course material"""
    material = session.exec(select(CourseMaterial).where(CourseMaterial.id == material_id)).first()
    if not material:
        raise HTTPException(status_code=404, detail="Course material not found")
    
    material_data = material_update.model_dump(exclude_unset=True)
    for field, value in material_data.items():
        setattr(material, field, value)
    
    session.add(material)
    session.commit()
    session.refresh(material)
    return material

@router.delete("/materials/{material_id}")
async def delete_course_material(material_id: str, session: SessionDependency):
    """Delete course material"""
    material = session.exec(select(CourseMaterial).where(CourseMaterial.id == material_id)).first()
    if not material:
        raise HTTPException(status_code=404, detail="Course material not found")
    
    session.delete(material)
    session.commit()
    return {"message": "Course material deleted successfully"} 
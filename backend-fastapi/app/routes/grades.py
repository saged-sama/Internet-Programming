import uuid
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select
from typing import Optional, List

from app.models.user import UserRoles
from app.utils.auth import roled_access
from app.utils.db import get_session
from app.models.grades import Grade, GradeCreateRequest, GradeUpdateRequest, GradeResponse

router = APIRouter(
    prefix="/staff-api/grades"
)

@router.get("/", response_model=List[GradeResponse])
def get_grades(
    session: Session = Depends(get_session),
    student_id: Optional[str] = Query(None),
    course_code: Optional[str] = Query(None),
    semester: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    query = select(Grade)
    
    if student_id:
        query = query.where(Grade.student_id == student_id)
    if course_code:
        query = query.where(Grade.course_code == course_code)
    if semester:
        query = query.where(Grade.semester == semester)
    
    query = query.offset(skip).limit(limit)
    grades = session.exec(query).all()
    return grades

@router.get("/{id}", response_model=GradeResponse)
def get_grade(id: int, session: Session = Depends(get_session)):
    grade = session.get(Grade, id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade

@router.post("/", response_model=GradeResponse, dependencies=[Depends(roled_access(UserRoles.faculty))])
def create_grade(grade_data: GradeCreateRequest, session: Session = Depends(get_session)):
    grade = Grade(
        id=uuid.uuid4().hex,
        **grade_data.model_dump()
    )
    session.add(grade)
    session.commit()
    session.refresh(grade)
    return grade

@router.put("/{id}", response_model=GradeResponse, dependencies=[Depends(roled_access(UserRoles.faculty))])
def update_grade(id: int, grade_data: GradeUpdateRequest, session: Session = Depends(get_session)):
    grade = session.get(Grade, id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    update_data = grade_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(grade, field, value)
    
    session.add(grade)
    session.commit()
    session.refresh(grade)
    return grade

@router.delete("/{id}")
def delete_grade(id: int, session: Session = Depends(get_session)):
    grade = session.get(Grade, id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    session.delete(grade)
    session.commit()
    return {"message": "Grade deleted successfully"}
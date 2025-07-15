from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from app.utils.db import get_session
from app.utils.auth import get_current_user
from app.models.assignment import Assignment
from app.models.assignment import AssignmentSubmission
from app.models.user import User

router = APIRouter(prefix="/api/staff-api/assignments", tags=["assignments"])

class AssignmentCreateRequest(BaseModel):
    title: str
    course_code: str
    course_title: str
    batch: str
    semester: str
    deadline: datetime
    description: str = ""
    created_by: str

class AssignmentUpdateRequest(BaseModel):
    title: Optional[str] = None
    course_code: Optional[str] = None
    course_title: Optional[str] = None
    batch: Optional[str] = None
    semester: Optional[str] = None
    deadline: Optional[datetime] = None
    description: Optional[str] = None

@router.post("", response_model=dict)
async def create_assignment(
    assignment_data: AssignmentCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Optionally, check if current_user is faculty or admin
    if current_user.role not in ("faculty"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty or admin can create assignments"
        )

    assignment = Assignment(
        title=assignment_data.title,
        course_code=assignment_data.course_code,
        course_title=assignment_data.course_title,
        batch=assignment_data.batch,
        semester=assignment_data.semester,
        deadline=assignment_data.deadline,
        description=assignment_data.description,
        created_by=assignment_data.created_by
    )
    session.add(assignment)
    session.commit()
    session.refresh(assignment)
    return {"message": "Assignment created successfully", "assignment_id": assignment.id}

@router.put("/{assignment_id}", response_model=dict)
async def update_assignment(
    assignment_id: str,
    assignment_data: AssignmentUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    assignment = session.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if current_user.role not in ("faculty", "admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    for field, value in assignment_data.dict(exclude_unset=True).items():
        setattr(assignment, field, value)
    session.add(assignment)
    session.commit()
    session.refresh(assignment)
    return {"message": "Assignment updated successfully", "assignment_id": assignment.id}

@router.delete("/{assignment_id}", response_model=dict)
async def delete_assignment(
    assignment_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    assignment = session.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if current_user.role not in ("faculty", "admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    session.delete(assignment)
    session.commit()
    return {"message": "Assignment deleted successfully"}

@router.get("", response_model=List[Assignment])
async def list_assignments(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    assignments = session.exec(select(Assignment)).all()
    return assignments

@router.post("/{assignment_id}/submit", response_model=dict)
async def submit_assignment(
    assignment_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    assignment = session.get(Assignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    # Check if the student has already submitted
    existing_submission = session.exec(
        select(AssignmentSubmission).where(
            AssignmentSubmission.assignment_id == assignment_id,
            AssignmentSubmission.student_id == current_user.id
        )
    ).first()
    if existing_submission:
        raise HTTPException(status_code=400, detail="You have already submitted this assignment.")
    # Create a new submission record
    submission = AssignmentSubmission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        submission_time=datetime.utcnow(),
        status="Submitted"
    )
    session.add(submission)
    # Increment submission_count (initialize if None)
    if assignment.submission_count is None:
        assignment.submission_count = 1
    else:
        assignment.submission_count += 1
    session.add(assignment)
    session.commit()
    session.refresh(assignment)
    return {"message": "Assignment submitted successfully", "submission_count": assignment.submission_count, "submission_id": submission.id, "status": submission.status}

@router.get("/submissions/me", response_model=List[AssignmentSubmission])
async def get_my_submissions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return session.exec(
        select(AssignmentSubmission).where(AssignmentSubmission.student_id == current_user.id)
    ).all()

@router.get("/submissions/created-by-me", response_model=List[AssignmentSubmission])
async def get_submissions_for_my_assignments(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get all assignments created by the current user
    my_assignments = session.exec(
        select(Assignment.id).where(Assignment.created_by == current_user.name)
    ).all()
    if not my_assignments:
        return []
    # Get all submissions for those assignments
    submissions = session.exec(
        select(AssignmentSubmission).where(AssignmentSubmission.assignment_id.in_(my_assignments))
    ).all()
    return submissions 
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi import HTTPException
from typing import Optional

app = FastAPI(title="Test Assignments API", version="1.0.0")

# In-memory storage for assignments
test_assignments = []

class AssignmentCreateRequest(BaseModel):
    title: str
    course_code: str
    batch: str
    semester: str
    deadline: datetime
    description: str = ""
    created_by: str

class AssignmentResponse(BaseModel):
    message: str
    assignment_id: int

class AssignmentUpdateRequest(BaseModel):
    title: Optional[str] = None
    course_code: Optional[str] = None
    batch: Optional[str] = None
    semester: Optional[str] = None
    deadline: Optional[datetime] = None
    description: Optional[str] = None

@app.post("/staff-api/assignments", response_model=AssignmentResponse)
def create_assignment(assignment: AssignmentCreateRequest):
    assignment_id = len(test_assignments) + 1
    test_assignments.append({"id": assignment_id, **assignment.dict()})
    return {"message": "Assignment created successfully", "assignment_id": assignment_id}

@app.get("/staff-api/assignments", response_model=List[dict])
def list_assignments():
    return test_assignments

@app.put("/staff-api/assignments/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: int, assignment_data: AssignmentUpdateRequest):
    for assignment in test_assignments:
        if assignment["id"] == assignment_id:
            for field, value in assignment_data.dict(exclude_unset=True).items():
                assignment[field] = value
            return {"message": "Assignment updated successfully", "assignment_id": assignment_id}
    raise HTTPException(status_code=404, detail="Assignment not found")

@app.delete("/staff-api/assignments/{assignment_id}", response_model=AssignmentResponse)
def delete_assignment(assignment_id: int):
    for i, assignment in enumerate(test_assignments):
        if assignment["id"] == assignment_id:
            test_assignments.pop(i)
            return {"message": "Assignment deleted successfully", "assignment_id": assignment_id}
    raise HTTPException(status_code=404, detail="Assignment not found") 
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi import HTTPException
from typing import Optional

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Test Assignments API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for assignments
test_assignments = []

# In-memory storage for exams
test_exams = []

from enum import Enum

class ExamTypeEnum(str, Enum):
    Midterm = "Midterm"
    Final = "Final"
    Quiz = "Quiz"
    Oral = "Oral"
    Practical = "Practical"

class AssignmentCreateRequest(BaseModel):
    title: str
    course_code: str
    course_title: str
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
    course_title: Optional[str] = None
    batch: Optional[str] = None
    semester: Optional[str] = None
    deadline: Optional[datetime] = None
    description: Optional[str] = None

class ExamCreateRequest(BaseModel):
    course_code: str
    course_title: str
    batch: str
    semester: str
    exam_type: ExamTypeEnum
    date: str  # yyyy-mm-dd
    start_time: str  # HH:MM
    end_time: str    # HH:MM
    room: str
    invigilator: str

class ExamResponse(BaseModel):
    message: str
    exam_id: int

class ExamUpdateRequest(BaseModel):
    course_code: Optional[str] = None
    course_title: Optional[str] = None
    batch: Optional[str] = None
    semester: Optional[str] = None
    exam_type: Optional[ExamTypeEnum] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    room: Optional[str] = None
    invigilator: Optional[str] = None

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

@app.post("/staff-api/exams", response_model=ExamResponse)
def create_exam(exam: ExamCreateRequest):
    exam_id = len(test_exams) + 1
    test_exams.append({"id": exam_id, **exam.dict()})
    return {"message": "Exam created successfully", "exam_id": exam_id}

@app.get("/staff-api/exams", response_model=List[dict])
def list_exams():
    return test_exams 

@app.put("/staff-api/exams/{exam_id}", response_model=ExamResponse)
def update_exam(exam_id: int, exam_data: ExamUpdateRequest):
    for exam in test_exams:
        if exam["id"] == exam_id:
            for field, value in exam_data.dict(exclude_unset=True).items():
                exam[field] = value
            return {"message": "Exam updated successfully", "exam_id": exam_id}
    raise HTTPException(status_code=404, detail="Exam not found")

@app.delete("/staff-api/exams/{exam_id}", response_model=ExamResponse)
def delete_exam(exam_id: int):
    for i, exam in enumerate(test_exams):
        if exam["id"] == exam_id:
            test_exams.pop(i)
            return {"message": "Exam deleted successfully", "exam_id": exam_id}
    raise HTTPException(status_code=404, detail="Exam not found") 
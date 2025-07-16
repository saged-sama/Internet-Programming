from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from sqlmodel import Session, select
from datetime import date
import os
import csv
from uuid import uuid4

from app.models.user import UserRoles
from app.utils.auth import roled_access
from app.utils.db import get_session
from app.models.results import Results, ResultsReadQuery
from app.models.course import CourseSemester
from app.utils.file_handler import BaseFilePath, delete_file, save_file

router = APIRouter(prefix="/api/results", tags=["Results"])

@router.get("/all_results")
async def get_all_results(session: Session = Depends(get_session)
):
    results = session.exec(select(Results)).all()
    if not results:
        raise HTTPException(status_code=404, detail="No results found")
    return results

@router.get("/")
async def get_results(
    query: ResultsReadQuery = Depends(),
    session: Session = Depends(get_session)
):
    statement = select(Results)
    
    if query.year:
        statement = statement.where(Results.year == query.year)
    if query.semester:
        statement = statement.where(Results.semester == query.semester)
    
    results = session.exec(statement).all()
    
    # Filter by student_id if provided (requires parsing CSV)
    if query.student_id:
        filtered_results = []
        for result in results:
            filepath = BaseFilePath + result.file
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'r') as f:
                        reader = csv.reader(f)
                        header = next(reader)
                        for row in reader:
                            if row[1] == query.student_id:  # student_id is second column
                                filtered_results.append({
                                    "title": result.title,
                                    "year": result.year,
                                    "semester": result.semester,
                                    "student_data": dict(zip(header, row)),
                                    "file": result.file
                                })
                                break
                except Exception as e:
                    print(f"Error reading CSV file: {e}")
        return filtered_results
    
    return results

@router.post("/")
async def create_result(
    current_user: str = Depends(roled_access(UserRoles.admin)),
    title: str = Form(...),
    year: str = Form(...),
    semester: CourseSemester = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    # Save file
    filename, _, _ = save_file(file)
    if not filename:
        raise HTTPException(status_code=500, detail="Failed to save file")
    
    # Create result record
    result = Results(
        id=uuid4().hex,
        title=title,
        year=year,
        semester=semester,
        file=filename,
        published_by=current_user.id
    )
    
    session.add(result)
    session.commit()
    session.refresh(result)
    
    return result

@router.put("/{result_id}")
async def update_result(
    result_id: str,
    title: str = Form(None),
    file: UploadFile = File(None),
    session: Session = Depends(get_session)
):
    result = session.get(Results, result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    # Update title if provided
    if title:
        result.title = title
    
    # Update file if provided
    if file:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
        # Delete old file
        old_filepath = BaseFilePath + result.file
        delete_file(old_filepath)
        
        # Save new file
        filename, file_type, file_size = save_file(file)
        if not filename:
            raise HTTPException(status_code=500, detail="Failed to save file")
        
        result.file = filename
    
    result.updated_at = date.today()
    session.commit()
    session.refresh(result)
    
    return result

@router.delete("/{result_id}")
async def delete_result(
    result_id: str,
    session: Session = Depends(get_session)
):
    result = session.get(Results, result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    # Delete associated file
    filepath = BaseFilePath + result.file
    delete_file(filepath)
    
    # Delete database record
    session.delete(result)
    session.commit()
    
    return {"message": "Result deleted successfully"}

@router.get("/{result_id}/student/{student_id}")
async def get_student_result(
    result_id: str,
    student_id: str,
    session: Session = Depends(get_session)
):
    result = session.get(Results, result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    filepath = BaseFilePath + result.file
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Result file not found")
    
    try:
        with open(filepath, 'r') as f:
            reader = csv.reader(f)
            header = next(reader)
            
            for row in reader:
                if row[1] == student_id:  # student_id is second column
                    return {
                        "title": result.title,
                        "year": result.year,
                        "semester": result.semester,
                        "student_data": dict(zip(header, row))
                    }
        
        raise HTTPException(status_code=404, detail="Student not found in results")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading result file: {e}")

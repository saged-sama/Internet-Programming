import os
from typing import Annotated
from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import FileResponse

from app.utils.db import SessionDependency
from app.utils.file_handler import BaseFilePath

router = APIRouter(prefix="/api/files")

@router.get("/{filename}")
async def get_file(filename: Annotated[str, Path()], session: SessionDependency):
    try:
        # Construct the full file path
        full_path = BaseFilePath + filename
        # Check if the file exists
        if not os.path.exists(full_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Return the file as a response
        return FileResponse(full_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
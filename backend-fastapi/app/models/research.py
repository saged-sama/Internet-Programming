from datetime import date
from typing import Optional
from sqlmodel import Field, SQLModel

class ResearchPaper(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: Optional[str] = None
    abstract: Optional[str] = None
    publication_date: Optional[date] = None
    journal: Optional[str] = None
    doi: Optional[str] = None
    status: Optional[str] = None

class ResearchPaperAuthor(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    paper_id: Optional[str] = Field(default=None, foreign_key="researchpaper.id")
    author_name: Optional[str] = None
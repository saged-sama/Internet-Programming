from datetime import date
from typing import Optional
from sqlmodel import Field, SQLModel

class ResearchPaper(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: Optional[str]
    abstract: Optional[str]
    publication_date: Optional[date]
    journal: Optional[str]
    doi: Optional[str]
    status: Optional[str]

class ResearchPaperAuthor(SQLModel, table=True):
    paper_id: Optional[str] = Field(foreign_key="researchpaper.id")
    author_name: str
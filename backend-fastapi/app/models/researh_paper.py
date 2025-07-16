from typing import Optional, List
from sqlmodel import Field, SQLModel, Column, JSON
from enum import Enum

class PaperStatus(str, Enum):
    published = "published"
    accepted = "accepted"
    submitted = "submitted"
    in_review = "in-review"

class PublicationType(str, Enum):
    conference = "conference"
    journal = "journal"
    workshop = "workshop"
    poster = "poster"

class ResearchPaper(SQLModel, table=True):
    id: str = Field(primary_key=True)
    title: str
    year: int
    conference: Optional[str] = None
    journal: Optional[str] = None
    abstract: str
    doi: Optional[str] = None
    url: Optional[str] = None
    pdf_url: Optional[str] = None
    citations: Optional[int] = None
    status: PaperStatus
    publication_type: PublicationType
    authors: List[str] = Field(default=[], sa_column=Column(JSON))
    keywords: List[str] = Field(default=[], sa_column=Column(JSON))
    
class ResearchPaperAuthor(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    paper_id: str = Field(foreign_key="researchpaper.id")
    author_id: str = Field(foreign_key="user.id")
    author_order: int = 1
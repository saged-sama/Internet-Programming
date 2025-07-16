from sqlmodel import Session, create_engine
import datetime
from models.notice import Notice, NoticeCategoryEnum

DATABASE_URL = "postgresql://postgres:TSCaGcSJRhrwJgHpcaIyQOTgeDzHbtbF@yamabiko.proxy.rlwy.net:20746/railway"
engine = create_engine(DATABASE_URL)

def insert_mock_notices():
    mock_notices = [
        Notice(
            id=1,
            title="Fall Semester 2025 Registration Opens",
            notice_date=datetime.date(2025, 7, 1),
            category=NoticeCategoryEnum.Academic,
            description="Registration for Fall 2025 courses is now open. Students must enroll by August 15, 2025.",
            is_important=False,
        ),
        Notice(
            id=2,
            title="Final Exam Schedule Published",
            notice_date=datetime.date(2025, 7, 2),
            category=NoticeCategoryEnum.Academic,
            description="The schedule for end-of-term exams has been published. Review exam dates and venues on the academic portal.",
            is_important=True,
        ),
        Notice(
            id=3,
            title="Library Closure for Inventory",
            notice_date=datetime.date(2025, 7, 3),
            category=NoticeCategoryEnum.Administrative,
            description="The central library will be closed from July 10–12, 2025 for annual inventory. Plan your research accordingly.",
            is_important=True,
        ),
        Notice(
            id=4,
            title="Campus Safety Workshop",
            notice_date=datetime.date(2025, 7, 4),
            category=NoticeCategoryEnum.General,
            description="Join the campus safety workshop on July 8, 2025 to learn about emergency protocols and first aid.",
            is_important=False,
        ),
        Notice(
            id=5,
            title="Research Grant Application Deadline",
            notice_date=datetime.date(2025, 7, 5),
            category=NoticeCategoryEnum.Research,
            description="Applications for the university’s internal research grant must be submitted by July 15, 2025.",
            is_important=True,
        ),
        Notice(
            id=6,
            title="Midterm Feedback Survey",
            notice_date=datetime.date(2025, 7, 6),
            category=NoticeCategoryEnum.Academic,
            description="Please complete the midterm course feedback survey by July 10, 2025 to help us improve teaching quality.",
            is_important=False,
        ),
        Notice(
            id=7,
            title="IT Network Maintenance",
            notice_date=datetime.date(2025, 7, 7),
            category=NoticeCategoryEnum.Administrative,
            description="The campus network will be down for maintenance on July 9, 2025 from 1 AM to 5 AM.",
            is_important=True,
        ),
        Notice(
            id=8,
            title="New Scholarship Announced",
            notice_date=datetime.date(2025, 7, 8),
            category=NoticeCategoryEnum.General,
            description="A new merit-based scholarship for senior students has been announced. Details on the student affairs portal.",
            is_important=False,
        ),
        Notice(
            id=9,
            title="Call for Papers: AI Symposium 2025",
            notice_date=datetime.date(2025, 7, 9),
            category=NoticeCategoryEnum.Research,
            description="Submit abstracts for the Annual AI Symposium 2025 by August 1, 2025. All topics in AI/ML are welcome.",
            is_important=False,
        ),
        Notice(
            id=10,
            title="Department Faculty Meeting",
            notice_date=datetime.date(2025, 7, 10),
            category=NoticeCategoryEnum.Administrative,
            description="All CSE department faculty are requested to attend a meeting on July 12, 2025 at 10 AM in Room 210.",
            is_important=False,
        ),
    ]

    with Session(engine) as session:
        session.add_all(mock_notices)
        session.commit()
    print("Mock notices inserted successfully.")

if __name__ == "__main__":
    insert_mock_notices()


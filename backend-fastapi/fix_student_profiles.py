import sys
import os
sys.path.append('.')
from app.utils.db import create_db_and_tables, get_session
from app.models.user import User, StudentProfile, UserRoles, StudentDegreeEnum, StudentTypeEnum
from app.models.course import CourseSemester
from sqlmodel import select
import uuid
from datetime import date

create_db_and_tables()
session = next(get_session())

students = session.exec(select(User).where(User.role == UserRoles.student)).all()
print(f'Found {len(students)} students')

created = 0
for student in students:
    existing = session.exec(select(StudentProfile).where(StudentProfile.user_id == student.id)).first()
    if not existing:
        profile = StudentProfile(
            id=str(uuid.uuid4()),
            user_id=student.id,
            student_id=f'STU{student.id[-4:]}' if len(student.id) >= 4 else f'STU{student.id}',
            major='Computer Science and Engineering',
            current_degree=StudentDegreeEnum.BSc,
            admission_date=date(2024,1,1),
            year_of_study=1,
            current_semester=CourseSemester.first,
            student_type=StudentTypeEnum.Regular,
            cgpa=0.0,
            extracurricular_activities=''
        )
        session.add(profile)
        created += 1
        print(f'Created profile for: {student.name}')
session.commit()
print(f'Created {created} student profiles')
session.close() 
import sys
import os
sys.path.append('.')
from app.utils.db import create_db_and_tables, get_session
from app.models.user import StudentProfile
from app.models.fee import Fee, StudentFee, FeeStatusEnum
from sqlmodel import select
import uuid
from datetime import datetime

create_db_and_tables()
session = next(get_session())

students = session.exec(select(StudentProfile)).all()
fees = session.exec(select(Fee)).all()
print(f'Found {len(students)} students and {len(fees)} fees')

created = 0
for student in students:
    for fee in fees:
        existing = session.exec(select(StudentFee).where((StudentFee.student_id == student.id) & (StudentFee.fee_id == fee.id))).first()
        if not existing:
            student_fee = StudentFee(
                id=str(uuid.uuid4()),
                student_id=student.id,
                fee_id=fee.id,
                status=FeeStatusEnum.pending,
                amount_due=fee.amount,
                amount_paid=0.0,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            session.add(student_fee)
            created += 1
            print(f'Assigned fee {fee.title} to student {student.user_id}')
session.commit()
print(f'Created {created} StudentFee records')
session.close() 
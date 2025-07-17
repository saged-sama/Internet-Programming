#!/usr/bin/env python3
""
Script to create StudentProfile records for all students who don't have one yet.
This fixes the "Student profile not found" error when students try to access fees.
"""

import sys
import os
from datetime import date
from sqlmodel import Session, select
import uuid

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.utils.db import create_db_and_tables, get_session
from app.models.user import User, StudentProfile, UserRoles, StudentDegreeEnum, StudentTypeEnum
from app.models.course import CourseSemester

def create_student_profiles():
    """Creates StudentProfile records for all students who don't have one"""
    
    # Create database and tables
    create_db_and_tables()
    
    # Get database session
    session = next(get_session())
    
    try:
        # Find all users with role student
        students = session.exec(
            select(User).where(User.role == UserRoles.student)
        ).all()
        
        print(f"Found {len(students)} students in the database")
        
        # For each student, check if they have a profile
        created_count = 0
        for student in students:
            existing_profile = session.exec(
                select(StudentProfile).where(StudentProfile.user_id == student.id)
            ).first()
            
            if not existing_profile:
                # Create a new student profile
                student_profile = StudentProfile(
                    id=str(uuid.uuid4()),
                    user_id=student.id,
                    student_id=f"STU{student.id[-4:]}" if len(student.id) >= 4 else f"STU{student.id}",
                    major="Computer Science and Engineering",
                    current_degree=StudentDegreeEnum.BSc,
                    admission_date=date(2024,1,1), # Default admission date
                    year_of_study=1,
                    current_semester=CourseSemester.first,
                    student_type=StudentTypeEnum.Regular,
                    cgpa=0.0,
                    extracurricular_activities=                )
                
                session.add(student_profile)
                created_count +=1             print(f"Created profile for student: {student.name} ({student.email})")
            else:
                print(f"Profile already exists for student: {student.name} ({student.email})")
        
        # Commit all changes
        session.commit()
        print(f"\n✅ Successfully created {created_count} student profiles")
        
        # Show summary
        total_profiles = session.exec(select(StudentProfile)).all()
        print(f"Total student profiles in database: {len(total_profiles)}")
        
    except Exception as e:
        print(f"❌ Error creating student profiles: {e}")
        session.rollback()
        raise
    finally:
        session.close()

def show_student_profiles():
    """Shows all student profiles in the database"""    
    session = next(get_session())
    
    try:
        # Get all student profiles with user info
        profiles = session.exec(
            select(StudentProfile, User).join(User, StudentProfile.user_id == User.id)
        ).all()
        
        print(f"\n📋 Student Profiles in Database ({len(profiles)} total):")
        print("-" * 80)
        
        for profile, user in profiles:
            print(f"ID: {profile.id}")
            print(f"User: {user.name} ({user.email})")
            print(f"Student ID: {profile.student_id}")
            print(f"Major: {profile.major}")
            print(f"Degree: {profile.current_degree}")
            print(f"Year: {profile.year_of_study}")
            print(f"Semester: {profile.current_semester}")
            print(f"CGPA: {profile.cgpa}")
            print("-" *40)
            
    except Exception as e:
        print(f"❌ Error showing student profiles: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    print("🎓 Student Profile Creation Script")
    print("=" * 50)
    
    # Create profiles
    create_student_profiles()
    
    # Show results
    show_student_profiles()
    
    print("\n✅ Script completed successfully!") 
# Internet-Programming

# Frontend Use these credentials:
student@gmail.com / 123456
admin@gmail.com / 123456
faculty@gmail.com / 123456



(venv) diptajoymistry@Diptajoys-MacBook-Air Internet-Programming % python3 database_diagram.py
🔍 ANALYZING DATABASE RELATIONSHIPS

============================================================
📋 33 tables: academicresource, announcement, assignment, assignmentsubmission, award, classschedule, contactdepartment, contactinfo, course, coursematerial, equipmentbooking, event, examtimetable, facultyprofile, fee, feepayment, grade, labequipment, meeting, notice, program, project, projectteammember, researchpaper, researchpaperauthor, room, roomavailabilityslot, roombooking, staffprofile, studentprofile, user, usereducation, userpublication

🔗 FOREIGN KEY RELATIONSHIPS:

📊 ASSIGNMENT:
   └── course_code → course.course_code
   └── created_by → user.id
   └── semester → program.id

📊 ASSIGNMENTSUBMISSION:
   └── assignment_id → assignment.id
   └── student_id → user.id

📊 AWARD:
   └── recipient → user.id

📊 CLASSSCHEDULE:
   └── course_code → course.course_code
   └── instructor → user.id
   └── room → room.room
   └── semester → program.id

📊 COURSE:
   └── instructor → user.id

📊 COURSEMATERIAL:
   └── course_code → course.course_code
   └── uploaded_by → user.id

📊 EQUIPMENTBOOKING:
   └── equipment_id → labequipment.id
   └── user_id → user.id

📊 EXAMTIMETABLE:
   └── course_code → course.course_code
   └── room → room.room
   └── semester → program.id

📊 FACULTYPROFILE:
   └── user_id → user.id

📊 FEEPAYMENT:
   └── fee_id → fee.id
   └── user_id → user.id

📊 GRADE:
   └── course_code → course.course_code
   └── semester → program.id
   └── student_id → user.id

📊 PROJECT:
   └── supervisor → user.id

📊 PROJECTTEAMMEMBER:
   └── member → user.id
   └── project_id → project.id

📊 RESEARCHPAPERAUTHOR:
   └── paper_id → researchpaper.id

📊 ROOMAVAILABILITYSLOT:
   └── room → room.room

📊 ROOMBOOKING:
   └── requested_by → user.id
   └── room → room.room

📊 STAFFPROFILE:
   └── user_id → user.id

📊 STUDENTPROFILE:
   └── user_id → user.id

📊 USEREDUCAdsaION:
   └── user_id → user.id

📊 USERPUBLICATION:
   └── user_id → user.id

🏠 PARENT TABLES (no foreign keys): academicresource, announcement, contactdepartment, contactinfo, event, fee, labequipment, meeting, notice, program, researchpaper, room, user

🎯 TABLE PURPOSES BY CATEGORY:

👥 User Management:
   • user
   • studentprofile
   • facultyprofile
   • staffprofile
   • usereducation
   • userpublication

📚 Academic:
   • course
   • coursematerial
   • program
   • assignment
   • assignmentsubmission
   • grade

🏢 Facilities:
   • room
   • roomavailabilityslot
   • roombooking

📅 Scheduling:
   • classschedule
   • meeting
   • event

💰 Financial:
   • fee
   • feepayment

📢 Communication:
   • announcement
   • notice
   • contactinfo
   • contactdepartment

🏆 Recognition:
   • award
   • academicresource

🔬 Research:
   • project


📋 DETAILED TABLE ANALYSIS:

============================================================
📋 ACADEMICRESOURCE:
   • id: integer NOT NULL DEFAULT nextval('academicresource_id_seq'::regclass) (PRIMARY KEY)
   • title: character varying NOT NULL
   • icon: character varying NULL
   • description: character varying NULL
   • link: character varying NULL

📋 ANNOUNCEMENT:
   • id: integer NOT NULL DEFAULT nextval('announcement_id_seq'::regclass) (PRIMARY KEY)
   • title: character varying NOT NULL
   • date: date NOT NULL
   • category: character varying NULL
   • description: character varying NULL

📋 ASSIGNMENT:
   • id: character varying NOT NULL (PRIMARY KEY)
   • course_code: character varying NULL (FOREIGN KEY)
   • batch: character varying NULL
   • semester: character varying NULL (FOREIGN KEY)
   • title: character varying NOT NULL
   • description: character varying NULL
   • deadline: timestamp without time zone NULL
   • total_marks: integer NULL
   • status: character varying NULL
   • submission_count: integer NULL
   • created_by: character varying NULL (FOREIGN KEY)

📋 ASSIGNMENTSUBMISSION:
   • id: character varying NOT NULL (PRIMARY KEY)
   • assignment_id: character varying NULL (FOREIGN KEY)
   • student_id: character varying NULL (FOREIGN KEY)
   • submission_time: timestamp without time zone NULL
   • marks_obtained: integer NULL
   • feedback: character varying NULL
   • status: character varying NULL

📋 AWARD:
   • id: character varying NOT NULL (PRIMARY KEY)
   • title: character varying NULL
   • description: character varying NULL
   • recipient: character varying NULL (FOREIGN KEY)
   • year: integer NULL
   • type: character varying NULL
   • status: character varying NULL

📋 CLASSSCHEDULE:
   • id: integer NOT NULL DEFAULT nextval('classschedule_id_seq'::regclass) (PRIMARY KEY)
   • course_code: character varying NULL (FOREIGN KEY)
   • batch: character varying NULL
   • semester: character varying NULL (FOREIGN KEY)
   • room: character varying NULL (FOREIGN KEY)
   • schedule: timestamp without time zone NULL
   • duration: time without time zone NULL
   • instructor: character varying NULL (FOREIGN KEY)

📋 CONTACTDEPARTMENT:
   • id: integer NOT NULL DEFAULT nextval('contactdepartment_id_seq'::regclass) (PRIMARY KEY)
   • name: character varying NOT NULL
   • email: character varying NULL
   • phone: character varying NULL

📋 CONTACTINFO:
   • id: integer NOT NULL DEFAULT nextval('contactinfo_id_seq'::regclass) (PRIMARY KEY)
   • address_line1: character varying NULL
   • address_line2: character varying NULL
   • city: character varying NULL
   • postal_code: character varying NULL
   • campus: character varying NULL
   • email: character varying NULL
   • phone: character varying NULL

📋 COURSE:
   • course_code: character varying NOT NULL (PRIMARY KEY)
   • course_title: character varying NOT NULL
   • course_description: character varying NULL
   • course_credits: double precision NULL
   • degree_level: USER-DEFINED NULL
   • semester: USER-DEFINED NULL
   • instructor: character varying NULL (FOREIGN KEY)
   • prerequisites: json NULL
   • topics: json NULL
   • objectives: json NULL
   • learning_outcomes: json NULL

📋 COURSEMATERIAL:
   • id: character varying NOT NULL (PRIMARY KEY)
   • course_code: character varying NULL (FOREIGN KEY)
   • title: character varying NULL
   • type: character varying NULL
   • description: character varying NULL
   • upload_date: date NULL
   • file_url: character varying NULL
   • file_type: character varying NULL
   • file_size: character varying NULL
   • uploaded_by: character varying NULL (FOREIGN KEY)

📋 EQUIPMENTBOOKING:
   • id: character varying NOT NULL (PRIMARY KEY)
   • equipment_id: character varying NULL (FOREIGN KEY)
   • user_id: character varying NULL (FOREIGN KEY)
   • start_time: timestamp without time zone NULL
   • end_time: timestamp without time zone NULL
   • purpose: character varying NULL
   • status: character varying NULL
   • created_at: timestamp without time zone NULL

📋 EVENT:
   • id: integer NOT NULL DEFAULT nextval('event_id_seq'::regclass) (PRIMARY KEY)
   • title: character varying NOT NULL
   • event_date: date NOT NULL
   • start_time: time without time zone NULL
   • end_time: time without time zone NULL
   • location: character varying NULL
   • category: USER-DEFINED NULL
   • description: character varying NULL
   • image: character varying NULL
   • registration_required: boolean NOT NULL
   • registration_deadline: date NULL

📋 EXAMTIMETABLE:
   • id: character varying NOT NULL (PRIMARY KEY)
   • course_code: character varying NULL (FOREIGN KEY)
   • semester: character varying NULL (FOREIGN KEY)
   • exam_type: USER-DEFINED NULL
   • exam_schedule: timestamp without time zone NULL
   • duration: time without time zone NULL
   • room: character varying NULL (FOREIGN KEY)
   • invigilator: character varying NULL

📋 FACULTYPROFILE:
   • id: character varying NOT NULL (PRIMARY KEY)
   • user_id: character varying NULL (FOREIGN KEY)
   • specialization: character varying NULL
   • research_interests: character varying NULL
   • publications: character varying NULL
   • courses_taught: character varying NULL
   • office_hours: character varying NULL
   • office_location: character varying NULL

📋 FEE:
   • id: character varying NOT NULL (PRIMARY KEY)
   • title: character varying NULL
   • type: USER-DEFINED NULL
   • amount: double precision NULL
   • deadline: date NULL

📋 FEEPAYMENT:
   • id: character varying NOT NULL (PRIMARY KEY)
   • fee_id: character varying NULL (FOREIGN KEY)
   • user_id: character varying NULL (FOREIGN KEY)
   • amount_paid: double precision NULL
   • payment_date: date NULL
   • status: USER-DEFINED NULL

📋 GRADE:
   • id: integer NOT NULL DEFAULT nextval('grade_id_seq'::regclass) (PRIMARY KEY)
   • student_id: character varying NULL (FOREIGN KEY)
   • course_code: character varying NULL (FOREIGN KEY)
   • semester: character varying NULL (FOREIGN KEY)
   • incourse_marks: double precision NULL
   • final_marks: double precision NULL
   • total_marks: double precision NULL
   • grade: double precision NULL

📋 LABEQUIPMENT:
   • id: character varying NOT NULL (PRIMARY KEY)
   • name: character varying NULL
   • description: character varying NULL
   • status: character varying NULL
   • location: character varying NULL
   • category: character varying NULL

📋 MEETING:
   • id: integer NOT NULL DEFAULT nextval('meeting_id_seq'::regclass) (PRIMARY KEY)
   • title: character varying NOT NULL
   • description: character varying NULL
   • meeting_date: date NULL
   • start_time: time without time zone NULL
   • end_time: time without time zone NULL
   • location: character varying NULL
   • url: character varying NULL
   • organizer: character varying NULL
   • type: USER-DEFINED NULL
   • is_registration_required: boolean NOT NULL

📋 NOTICE:
   • id: integer NOT NULL DEFAULT nextval('notice_id_seq'::regclass) (PRIMARY KEY)
   • title: character varying NOT NULL
   • date: date NOT NULL
   • category: character varying NULL
   • description: character varying NULL
   • is_important: boolean NOT NULL

📋 PROGRAM:
   • id: character varying NOT NULL (PRIMARY KEY)
   • title: character varying NOT NULL
   • level: USER-DEFINED NOT NULL
   • description: character varying NOT NULL
   • creditsRequired: integer NOT NULL
   • duration: character varying NOT NULL
   • department: character varying NULL
   • concentrations: json NULL
   • admissionRequirements: json NULL
   • careerOpportunities: json NULL
   • curriculum: json NULL
   • updatedAt: date NULL

📋 PROJECT:
   • id: character varying NOT NULL (PRIMARY KEY)
   • title: character varying NULL
   • description: character varying NULL
   • supervisor: character varying NULL (FOREIGN KEY)
   • year: integer NULL
   • topic: character varying NULL
   • status: character varying NULL
   • abstract: character varying NULL

📋 PROJECTTEAMMEMBER:
   • id: integer NOT NULL DEFAULT nextval('projectteammember_id_seq'::regclass) (PRIMARY KEY)
   • project_id: character varying NULL (FOREIGN KEY)
   • member: character varying NULL (FOREIGN KEY)

📋 RESEARCHPAPER:
   • id: character varying NOT NULL (PRIMARY KEY)
   • title: character varying NULL
   • abstract: character varying NULL
   • publication_date: date NULL
   • journal: character varying NULL
   • doi: character varying NULL
   • status: character varying NULL

📋 RESEARCHPAPERAUTHOR:
   • id: integer NOT NULL DEFAULT nextval('researchpaperauthor_id_seq'::regclass) (PRIMARY KEY)
   • paper_id: character varying NULL (FOREIGN KEY)
   • author_name: character varying NULL

📋 ROOM:
   • room: character varying NOT NULL (PRIMARY KEY)
   • capacity: integer NULL

📋 ROOMAVAILABILITYSLOT:
   • id: character varying NOT NULL (PRIMARY KEY)
   • room: character varying NULL (FOREIGN KEY)
   • day: character varying NULL
   • start_time: time without time zone NULL
   • end_time: time without time zone NULL

📋 ROOMBOOKING:
   • id: character varying NOT NULL (PRIMARY KEY)
   • room: character varying NULL (FOREIGN KEY)
   • requested_by: character varying NULL (FOREIGN KEY)
   • purpose: character varying NULL
   • booking_date: date NULL
   • start_time: time without time zone NULL
   • end_time: time without time zone NULL
   • status: character varying NULL
   • request_date: date NULL

📋 STAFFPROFILE:
   • id: character varying NOT NULL (PRIMARY KEY)
   • user_id: character varying NULL (FOREIGN KEY)
   • position: character varying NULL
   • department: character varying NULL
   • responsibilities: character varying NULL
   • office_location: character varying NULL
   • joining_date: date NULL

📋 STUDENTPROFILE:
   • id: character varying NOT NULL (PRIMARY KEY)
   • user_id: character varying NULL (FOREIGN KEY)
   • student_id: character varying NULL
   • major: character varying NULL
   • admission_date: date NULL
   • graduation_date: date NULL
   • year_of_study: integer NULL
   • student_type: character varying NULL
   • cgpa: double precision NULL
   • extracurricular_activities: character varying NULL

📋 USER:
   • id: character varying NOT NULL (PRIMARY KEY)
   • name: character varying NOT NULL
   • role: USER-DEFINED NULL DEFAULT 'student'::userroles
   • department: character varying NULL
   • title: character varying NULL
   • email: character varying NULL
   • phone: character varying NULL
   • image: character varying NULL
   • bio: character varying NULL
   • address: character varying NULL
   • date_of_birth: date NULL
   • hashed_password: character varying NULL

📋 USEREDUCATION:
   • id: character varying NOT NULL (PRIMARY KEY)
   • user_id: character varying NULL (FOREIGN KEY)
   • degree: character varying NULL
   • institution: character varying NULL
   • graduation_year: date NULL

📋 USERPUBLICATION:
   • id: character varying NOT NULL (PRIMARY KEY)
   • user_id: character varying NULL (FOREIGN KEY)
   • publication: character varying NULL
(venv) diptajoymistry@Diptajoys-MacBook-Air Internet-Programming % 
export interface ClassSchedule {
  id: number;
  courseCode: string;
  courseTitle: string;
  batch: string;
  semester: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  instructor: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DaySlots {
  day: string;
  slots: TimeSlot[];
}

export interface RoomAvailability {
  id: number;
  roomNumber: string;
  capacity: number;
  facilities: string[];
  availableSlots: {
    day: string;
    slots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}

export interface RoomBooking {
  id: number;
  roomNumber: string;
  requestedBy: string;
  email: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  rejectionReason?: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  roomNumber: string;
}

// New types for exam timetables, assignments, and student grades
export interface ExamTimetable {
  id: number;
  courseCode: string;
  courseTitle: string;
  batch: string;
  semester: string;
  examType: 'Midterm' | 'Final' | 'Quiz';
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  invigilator: string;
}

export interface Assignment {
  id: number;
  courseCode: string;
  courseTitle: string;
  batch: string;
  semester: string;
  title: string;
  description: string;
  deadline: string;
  totalMarks: number;
  status: 'Open' | 'Closed';
  submissionCount: number;
  createdBy: string;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: string;
  studentName: string;
  submissionDate: string;
  attachments: string[];
  comments: string;
  status: 'Submitted' | 'Late' | 'Graded';
  marks?: number;
  feedback?: string;
}

export interface StudentGrade {
  id: number;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
  semester: string;
  assignmentMarks: number;
  midtermMarks: number;
  finalMarks: number;
  totalMarks: number;
  grade: string;
}

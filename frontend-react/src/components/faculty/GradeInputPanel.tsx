import { useState } from 'react';
import type { StudentGrade } from '@/types/scheduling';

interface GradeInputPanelProps {
  students: StudentGrade[];
  onSaveGrades: (updatedStudents: StudentGrade[]) => void;
}

export default function GradeInputPanel({ students, onSaveGrades }: GradeInputPanelProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [editableStudents, setEditableStudents] = useState<StudentGrade[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Get unique courses and semesters
  const courses = [...new Set(students.map(student => student.courseCode))];
  const semesters = [...new Set(students.map(student => student.semester))];

  const handleFilter = () => {
    const filtered = students.filter(
      student => 
        (selectedCourse === '' || student.courseCode === selectedCourse) && 
        (selectedSemester === '' || student.semester === selectedSemester)
    );
    setEditableStudents(JSON.parse(JSON.stringify(filtered)));
    setIsEditing(filtered.length > 0);
  };

  const handleMarkChange = (id: number, field: 'assignmentMarks' | 'midtermMarks' | 'finalMarks', value: number) => {
    setEditableStudents(prev => 
      prev.map(student => {
        if (student.id === id) {
          const updatedStudent = { ...student, [field]: value };
          
          // Recalculate total marks and grade
          const totalMarks = updatedStudent.assignmentMarks + updatedStudent.midtermMarks + updatedStudent.finalMarks;
          let grade = 'F';
          
          if (totalMarks >= 90) grade = 'A+';
          else if (totalMarks >= 85) grade = 'A';
          else if (totalMarks >= 80) grade = 'A-';
          else if (totalMarks >= 75) grade = 'B+';
          else if (totalMarks >= 70) grade = 'B';
          else if (totalMarks >= 65) grade = 'B-';
          else if (totalMarks >= 60) grade = 'C+';
          else if (totalMarks >= 55) grade = 'C';
          else if (totalMarks >= 50) grade = 'D';
          
          return { ...updatedStudent, totalMarks, grade };
        }
        return student;
      })
    );
  };

  const handleSave = () => {
    onSaveGrades(editableStudents);
    setIsEditing(false);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h3 className="mb-4 font-medium">Grade Input Panel</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="course-filter" className="block mb-2 text-sm text-muted-foreground">
            Course
          </label>
          <select
            id="course-filter"
            className="w-full p-2 border rounded-md bg-background"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="semester-filter" className="block mb-2 text-sm text-muted-foreground">
            Semester
          </label>
          <select
            id="semester-filter"
            className="w-full p-2 border rounded-md bg-background"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            className="w-full p-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={handleFilter}
          >
            Load Students
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Student</th>
                  <th className="py-3 px-4 text-left font-medium">Course</th>
                  <th className="py-3 px-4 text-center font-medium">Assignment (20)</th>
                  <th className="py-3 px-4 text-center font-medium">Midterm (30)</th>
                  <th className="py-3 px-4 text-center font-medium">Final (50)</th>
                  <th className="py-3 px-4 text-center font-medium">Total</th>
                  <th className="py-3 px-4 text-center font-medium">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {editableStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-muted-foreground text-sm">{student.studentId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{student.courseCode}</div>
                      <div className="text-muted-foreground text-sm">Semester {student.semester}</div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        className="w-16 p-1 border rounded-md text-center"
                        value={student.assignmentMarks}
                        onChange={(e) => handleMarkChange(student.id, 'assignmentMarks', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        className="w-16 p-1 border rounded-md text-center"
                        value={student.midtermMarks}
                        onChange={(e) => handleMarkChange(student.id, 'midtermMarks', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        className="w-16 p-1 border rounded-md text-center"
                        value={student.finalMarks}
                        onChange={(e) => handleMarkChange(student.id, 'finalMarks', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-medium">{student.totalMarks}</td>
                    <td className="py-3 px-4 text-center font-medium">{student.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              onClick={handleSave}
            >
              Save Grades
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Select a course and semester to load students and input grades.
        </div>
      )}
    </div>
  );
}

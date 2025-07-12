import { useState, useEffect } from 'react';

interface Course {
  course_code: string;
  course_title: string;
  credits: number;
}

interface ClassScheduleFilterProps {
  rooms: string[];
  courses?: Course[];
  onFilterChange: (filters: { batch: string; semester: string; room: string; courseCode: string }) => void | Promise<void>;
  currentSemester?: string; // For students, their current semester
  isStudent?: boolean; // Whether the user is a student
}

export default function ClassScheduleFilter({
  rooms,
  courses = [],
  onFilterChange,
  currentSemester = '',
  isStudent = false,
}: ClassScheduleFilterProps) {
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>(isStudent ? currentSemester : '');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('');
  
  // Predefined batch and semester options
  const batchOptions = ['27', '28', '29', '30', '31'];
  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    onFilterChange({
      batch: selectedBatch,
      semester: selectedSemester,
      room: selectedRoom,
      courseCode: selectedCourseCode,
    });
  }, [selectedBatch, selectedSemester, selectedRoom, selectedCourseCode, onFilterChange]);

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
      <div className={`grid grid-cols-1 gap-4 ${isStudent ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
        <div>
          <label htmlFor="batch-filter" className="block mb-2 text-muted-foreground">
            Batch
          </label>
          <select
            id="batch-filter"
            className="w-full p-2 border rounded-md bg-background"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">All Batches</option>
            {batchOptions.map((batch) => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>
        </div>

        {!isStudent && (
        <div>
          <label htmlFor="semester-filter" className="block mb-2 text-muted-foreground">
            Semester
          </label>
          <select
            id="semester-filter"
            className="w-full p-2 border rounded-md bg-background"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="course-filter" className="block mb-2 text-muted-foreground">
            Course
          </label>
          <select
            id="course-filter"
            className="w-full p-2 border rounded-md bg-background"
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.course_code} value={course.course_code}>
                {course.course_code} - {course.course_title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="room-filter" className="block mb-2 text-muted-foreground">
            Room
          </label>
          <select
            id="room-filter"
            className="w-full p-2 border rounded-md bg-background"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">All Rooms</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

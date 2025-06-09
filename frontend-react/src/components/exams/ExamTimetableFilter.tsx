import { useState, useEffect } from 'react';

interface ExamTimetableFilterProps {
  rooms: string[];
  onFilterChange: (filters: { batch: string; semester: string; course: string; room: string }) => void;
}

export default function ExamTimetableFilter({
  rooms,
  onFilterChange,
}: ExamTimetableFilterProps) {
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  
  // Predefined batch and semester options
  const batchOptions = ['27', '28', '29', '30', '31'];
  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const courseOptions = [
    'CSE101', 'CSE201', 'CSE301', 'CSE401', 
    'CSE501', 'CSE601', 'CSE701', 'CSE801'
  ];

  useEffect(() => {
    onFilterChange({
      batch: selectedBatch,
      semester: selectedSemester,
      course: selectedCourse,
      room: selectedRoom,
    });
  }, [selectedBatch, selectedSemester, selectedCourse, selectedRoom, onFilterChange]);

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
      <h3 className="mb-4 font-medium">Filter Exam Timetables</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div>
          <label htmlFor="course-filter" className="block mb-2 text-muted-foreground">
            Course
          </label>
          <select
            id="course-filter"
            className="w-full p-2 border rounded-md bg-background"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
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

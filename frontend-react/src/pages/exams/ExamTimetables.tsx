import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ExamTimetableFilter from '@/components/exams/ExamTimetableFilter';
import ExamTimetableTable from '@/components/exams/ExamTimetableTable';
import type { ExamTimetable } from '@/types/scheduling';
import examTimetablesData from '@/assets/examTimetables.json';

export default function ExamTimetablesPage() {
  const [exams, setExams] = useState<ExamTimetable[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamTimetable[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    // Load exams from JSON data
    const loadedExams = examTimetablesData as ExamTimetable[];
    setExams(loadedExams);
    setFilteredExams(loadedExams);

    // Extract unique room values
    const uniqueRooms = [...new Set(loadedExams.map((exam) => exam.room))];
    setRooms(uniqueRooms);
  }, []);

  const handleFilterChange = (filters: { batch: string; semester: string; course: string; room: string }) => {
    let filtered = [...exams];

    if (filters.batch) {
      filtered = filtered.filter((exam) => exam.batch === filters.batch);
    }

    if (filters.semester) {
      filtered = filtered.filter((exam) => exam.semester === filters.semester);
    }

    if (filters.course) {
      filtered = filtered.filter((exam) => exam.courseCode === filters.course);
    }

    if (filters.room) {
      filtered = filtered.filter((exam) => exam.room === filters.room);
    }

    setFilteredExams(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="mb-2">Exam Timetables</h1>
          <p className="text-muted-foreground">
            View and filter exam schedules by batch, semester, course, and room.
          </p>
        </div>

        <ExamTimetableFilter
          rooms={rooms}
          onFilterChange={handleFilterChange}
        />

        <ExamTimetableTable exams={filteredExams} />
      </div>
    </Layout>
  );
}

import { useState, useEffect, useCallback } from 'react';
import ExamTimetableFilter from '@/components/exams/ExamTimetableFilter';
import ExamTimetableTable from '@/components/exams/ExamTimetableTable';
import type { ExamTimetable } from '@/types/scheduling';
import examTimetablesData from '@/assets/examTimetables.json';

export default function ExamTimetablesPage() {
  const [exams, setExams] = useState<ExamTimetable[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamTimetable[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<{ batch: string; semester: string; course: string; room: string }>({
    batch: '',
    semester: '',
    course: '',
    room: ''
  });

  useEffect(() => {
    // Load exams from JSON data
    const loadedExams = examTimetablesData as ExamTimetable[];
    setExams(loadedExams);
    setFilteredExams(loadedExams);

    // Extract unique room values
    const uniqueRooms = [...new Set(loadedExams.map((exam) => exam.room))];
    setRooms(uniqueRooms);
  }, []);

  const handleFilterChange = useCallback((filters: { batch: string; semester: string; course: string; room: string }) => {
    setCurrentFilters(filters);
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
  }, [exams]);

  // Calculate summary statistics
  const getExamStats = () => {
    const totalExams = filteredExams.length;
    const uniqueCourses = new Set(filteredExams.map(e => e.courseCode)).size;
    const uniqueInvigilators = new Set(filteredExams.map(e => e.invigilator)).size;
    const batchesInvolved = new Set(filteredExams.map(e => e.batch)).size;
    const examTypes = new Set(filteredExams.map(e => e.examType)).size;
    const midtermCount = filteredExams.filter(e => e.examType === 'Midterm').length;
    const finalCount = filteredExams.filter(e => e.examType === 'Final').length;
    
    return {
      totalExams,
      uniqueCourses,
      uniqueInvigilators,
      batchesInvolved,
      examTypes,
      midtermCount,
      finalCount
    };
  };

  const stats = getExamStats();

  // Get filter descriptions
  const getFilterDescription = () => {
    const parts = [];
    if (currentFilters.batch) parts.push(`Batch ${currentFilters.batch}`);
    if (currentFilters.semester) parts.push(`Semester ${currentFilters.semester}`);
    if (currentFilters.course) parts.push(`Course ${currentFilters.course}`);
    if (currentFilters.room) parts.push(`Room ${currentFilters.room}`);
    
    return parts.length > 0 ? parts.join(', ') : 'All exams';
  };

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h1 className="text-primary mb-1">Exam Timetables</h1>
              <p className="text-muted-foreground">
                View and manage exam schedules with comprehensive filtering options
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.totalExams}</p>
                  <p className="text-sm text-muted-foreground">Total Exams</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-1/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-chart-1">{stats.uniqueCourses}</p>
                  <p className="text-sm text-muted-foreground">Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👨‍🏫</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">{stats.uniqueInvigilators}</p>
                  <p className="text-sm text-muted-foreground">Invigilators</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎓</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-chart-2">{stats.batchesInvolved}</p>
                  <p className="text-sm text-muted-foreground">Batches</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⏰</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-chart-3">{stats.examTypes}</p>
                  <p className="text-sm text-muted-foreground">Exam Types</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Type Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-chart-4">{stats.midtermCount}</p>
                  <p className="text-sm text-muted-foreground">Midterm Exams</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-5/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-chart-5">{stats.finalCount}</p>
                  <p className="text-sm text-muted-foreground">Final Exams</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Filter Display */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-primary">Currently showing:</span>
              <span className="bg-secondary/10 text-primary px-3 py-1 rounded-full border border-secondary/20">
                {getFilterDescription()}
              </span>
              {(currentFilters.batch || currentFilters.semester || currentFilters.course || currentFilters.room) && (
                <button
                  onClick={() => {
                    setCurrentFilters({ batch: '', semester: '', course: '', room: '' });
                    setFilteredExams(exams);
                  }}
                  className="text-muted-foreground hover:text-primary underline transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <ExamTimetableFilter
            rooms={rooms}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Exam Table */}
        <ExamTimetableTable exams={filteredExams} />
      </div>
    
  );
}

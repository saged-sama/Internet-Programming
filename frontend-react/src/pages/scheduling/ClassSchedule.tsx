import { useState, useEffect } from 'react';
import ClassScheduleFilter from '@/components/scheduling/ClassScheduleFilter';
import ClassScheduleTable from '@/components/scheduling/ClassScheduleTable';
import type { ClassSchedule } from '@/types/scheduling';
import classScheduleData from '@/assets/classSchedule.json';

export default function ClassSchedulePage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ClassSchedule[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<{ batch: string; semester: string; room: string }>({
    batch: '',
    semester: '',
    room: ''
  });

  useEffect(() => {
    // Load schedules from JSON data
    const loadedSchedules = classScheduleData as ClassSchedule[];
    setSchedules(loadedSchedules);
    setFilteredSchedules(loadedSchedules);

    // Extract unique room values only (batches and semesters are now predefined)
    const uniqueRooms = [...new Set(loadedSchedules.map((schedule) => schedule.room))];
    setRooms(uniqueRooms);
  }, []);

  const handleFilterChange = (filters: { batch: string; semester: string; room: string }) => {
    setCurrentFilters(filters);
    let filtered = [...schedules];

    if (filters.batch) {
      filtered = filtered.filter((schedule) => schedule.batch === filters.batch);
    }

    if (filters.semester) {
      filtered = filtered.filter((schedule) => schedule.semester === filters.semester);
    }

    if (filters.room) {
      filtered = filtered.filter((schedule) => schedule.room === filters.room);
    }

    setFilteredSchedules(filtered);
  };

  // Calculate summary statistics
  const getScheduleStats = () => {
    const totalClasses = filteredSchedules.length;
    const uniqueCourses = new Set(filteredSchedules.map(s => s.courseCode)).size;
    const uniqueInstructors = new Set(filteredSchedules.map(s => s.instructor)).size;
    const batchesInvolved = new Set(filteredSchedules.map(s => s.batch)).size;
    const daysWithClasses = new Set(filteredSchedules.map(s => s.day)).size;
    
    return {
      totalClasses,
      uniqueCourses,
      uniqueInstructors,
      batchesInvolved,
      daysWithClasses
    };
  };

  const stats = getScheduleStats();

  // Get filter descriptions
  const getFilterDescription = () => {
    const parts = [];
    if (currentFilters.batch) parts.push(`Batch ${currentFilters.batch}`);
    if (currentFilters.semester) parts.push(`Semester ${currentFilters.semester}`);
    if (currentFilters.room) parts.push(`Room ${currentFilters.room}`);
    
    return parts.length > 0 ? parts.join(', ') : 'All schedules';
  };

  return (
  
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h1 className="text-primary mb-1">Class Schedule</h1>
              <p className="text-muted-foreground">
                View and manage weekly class schedules with interactive timetable and filters
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.totalClasses}</p>
                  <p className="text-sm text-muted-foreground">Total Classes</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-1/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎓</span>
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
                  <p className="text-2xl font-bold text-secondary">{stats.uniqueInstructors}</p>
                  <p className="text-sm text-muted-foreground">Instructors</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏛️</span>
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
                  <span className="text-lg">📆</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-chart-3">{stats.daysWithClasses}</p>
                  <p className="text-sm text-muted-foreground">Active Days</p>
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
              {(currentFilters.batch || currentFilters.semester || currentFilters.room) && (
                <button
                  onClick={() => {
                    setCurrentFilters({ batch: '', semester: '', room: '' });
                    setFilteredSchedules(schedules);
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
          <ClassScheduleFilter
            rooms={rooms}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Schedule Table */}
        <ClassScheduleTable schedules={filteredSchedules} />


      </div>
    
  );
}

import { useState, useEffect, useCallback } from 'react';
import ClassScheduleFilter from '@/components/scheduling/ClassScheduleFilter';
import ClassScheduleTable from '@/components/scheduling/ClassScheduleTable';
import type { ClassSchedule } from '@/types/scheduling';
import { schedulingApi } from '@/lib/schedulingApi';
import { getCurrentUser } from '@/lib/auth';

export default function ClassSchedulePage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ClassSchedule[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [courses, setCourses] = useState<Array<{ course_code: string; course_title: string; credits: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<{ batch: string; semester: string; room: string; courseCode: string }>({
    batch: '',
    semester: '',
    room: '',
    courseCode: ''
  });

  // Get current user info
  const currentUser = getCurrentUser();
  
  // Get student's current semester (hardcoded for now)
  const getStudentCurrentSemester = () => {
    // TODO: In future, get this from user profile or API
    // For now, hardcode based on user role or return a default
    if (currentUser?.role === 'student') {
      // Hardcoded current semester for students
      return '5'; // Assuming 5th semester
    }
    return ''; // Show all for non-students
  };

  const studentCurrentSemester = getStudentCurrentSemester();

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For students, automatically filter by their current semester
      const initialFilters = currentUser?.role === 'student' && studentCurrentSemester 
        ? { semester: studentCurrentSemester } 
        : {};
      
      // Load schedules, rooms, and courses in parallel
      const [schedulesData, roomsData, coursesData] = await Promise.all([
        schedulingApi.classSchedule.getAll(initialFilters),
        schedulingApi.classSchedule.getRooms(),
        schedulingApi.classSchedule.getCourses()
      ]);
      
      setSchedules(schedulesData);
      setFilteredSchedules(schedulesData);
      setRooms(roomsData);
      setCourses(coursesData);
      
      // Set initial filters for students
      if (currentUser?.role === 'student' && studentCurrentSemester) {
        setCurrentFilters(prev => ({ 
          ...prev, 
          semester: studentCurrentSemester 
        }));
      }
    } catch (err) {
      setError('Failed to load class schedule data');
      console.error('Error loading schedule data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduleData();
  }, []);

  const handleFilterChange = useCallback(async (filters: { batch: string; semester: string; room: string; courseCode: string }) => {
    setCurrentFilters(filters);
    
    try {
      // Use API filtering for better performance
      const filteredData = await schedulingApi.classSchedule.getAll(filters);
      setFilteredSchedules(filteredData);
    } catch (err) {
      console.error('Error filtering schedules:', err);
      // Fallback to client-side filtering
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

      if (filters.courseCode) {
        filtered = filtered.filter((schedule) => schedule.courseCode === filters.courseCode);
      }

    setFilteredSchedules(filtered);
    }
  }, [schedules]);

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
    if (currentFilters.semester) {
      if (currentUser?.role === 'student' && currentFilters.semester === studentCurrentSemester) {
        parts.push(`Current Semester (${currentFilters.semester})`);
      } else {
        parts.push(`Semester ${currentFilters.semester}`);
      }
    }
    if (currentFilters.courseCode) {
      const course = courses.find(c => c.course_code === currentFilters.courseCode);
      parts.push(`Course ${currentFilters.courseCode}${course ? ` - ${course.course_title}` : ''}`);
    }
    if (currentFilters.room) parts.push(`Room ${currentFilters.room}`);
    
    if (parts.length === 0) {
      return currentUser?.role === 'student' && studentCurrentSemester 
        ? `Current Semester (${studentCurrentSemester})` 
        : 'All schedules';
    }
    
    return parts.join(', ');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading class schedules...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card p-8 rounded-lg shadow-sm border text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-destructive text-lg mb-2">{error}</p>
          <button 
            onClick={loadScheduleData} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
  
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl">📅</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
              <h1 className="text-primary mb-1">Class Schedule</h1>
                {currentUser?.role === 'student' && studentCurrentSemester && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                    Semester {studentCurrentSemester}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">
                {currentUser?.role === 'student' && studentCurrentSemester 
                  ? `Your current semester class schedule and timetable`
                  : `View and manage weekly class schedules with interactive timetable and filters`
                }
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
              {((currentFilters.batch || currentFilters.room || currentFilters.courseCode) || 
                (currentFilters.semester && (currentUser?.role !== 'student' || currentFilters.semester !== studentCurrentSemester))) && (
                <button
                  onClick={() => {
                    // For students, preserve their current semester filter
                    const preservedSemester = currentUser?.role === 'student' && studentCurrentSemester 
                      ? studentCurrentSemester 
                      : '';
                    
                    setCurrentFilters({ 
                      batch: '', 
                      semester: preservedSemester, 
                      room: '',
                      courseCode: ''
                    });
                    
                    // Reload data with preserved filters
                    if (preservedSemester) {
                      handleFilterChange({ batch: '', semester: preservedSemester, room: '', courseCode: '' });
                    } else {
                    setFilteredSchedules(schedules);
                    }
                  }}
                  className="text-muted-foreground hover:text-primary underline transition-colors"
                >
                  Clear additional filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          {currentUser?.role === 'student' && studentCurrentSemester && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-primary">ℹ️</span>
                <span className="text-primary font-medium">
                  Showing your current semester ({studentCurrentSemester}) classes only.
                </span>
                <span className="text-muted-foreground">
                  Use the filters below to narrow down by batch or room.
                </span>
              </div>
            </div>
          )}
          <ClassScheduleFilter
            rooms={rooms}
            courses={courses}
            onFilterChange={handleFilterChange}
            currentSemester={studentCurrentSemester}
            isStudent={currentUser?.role === 'student'}
          />
        </div>

        {/* Schedule Table */}
        <ClassScheduleTable schedules={filteredSchedules} />


      </div>
    
  );
}

import { useState, useEffect } from 'react';
import type { ClassSchedule } from '@/types/scheduling';
import { schedulingApi } from '@/lib/schedulingApi';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ScheduleFormData {
  course_code: string;
  batch: string;
  semester: string;
  room: string;
  day: string;
  start_time: string;
  end_time: string;
  instructor: string;
}

export default function ClassScheduleAdmin() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [formData, setFormData] = useState<ScheduleFormData>({
    course_code: '',
    batch: '',
    semester: '',
    room: '',
    day: '',
    start_time: '',
    end_time: '',
    instructor: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const batchOptions = ['27', '28', '29', '30', '31'];
  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    loadSchedules();
    loadRooms();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchTerm, filterBatch, filterSemester, filterRoom]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCreateForm) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showCreateForm]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await schedulingApi.classSchedule.getAll();
      setSchedules(data);
    } catch (err) {
      setError('Failed to load schedules');
      console.error('Error loading schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      setLoadingRooms(true);
      const roomData = await schedulingApi.roomAvailability.getAll();
      const availableRooms = roomData.map(room => room.room).sort();
      setRoomOptions(availableRooms);
    } catch (err) {
      console.error('Error loading rooms:', err);
      // Fallback to default rooms if API fails
      setRoomOptions(['A101', 'A102', 'A103', 'B201', 'B202', 'B203', 'C301', 'C302', 'Lab1', 'Lab2']);
    } finally {
      setLoadingRooms(false);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;

    if (searchTerm) {
      filtered = filtered.filter(schedule =>
        schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBatch) {
      filtered = filtered.filter(schedule => schedule.batch === filterBatch);
    }

    if (filterSemester) {
      filtered = filtered.filter(schedule => schedule.semester === filterSemester);
    }

    if (filterRoom) {
      filtered = filtered.filter(schedule => schedule.room === filterRoom);
    }

    setFilteredSchedules(filtered);
  };

  const resetForm = () => {
    setFormData({
      course_code: '',
      batch: '',
      semester: '',
      room: '',
      day: '',
      start_time: '',
      end_time: '',
      instructor: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    resetForm();
    setEditingSchedule(null);
    setShowCreateForm(true);
  };

  const handleEdit = (schedule: ClassSchedule) => {
    setFormData({
      course_code: schedule.courseCode,
      batch: schedule.batch,
      semester: schedule.semester,
      room: schedule.room,
      day: schedule.day,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      instructor: schedule.instructor,
    });
    setEditingSchedule(schedule);
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSchedule) {
        // Update existing schedule
        await schedulingApi.classSchedule.admin.update(editingSchedule.id, formData);
      } else {
        // Create new schedule
        await schedulingApi.classSchedule.admin.create(formData);
      }
      
      setShowCreateForm(false);
      resetForm();
      setEditingSchedule(null);
      await loadSchedules();
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert('Failed to save schedule. Please try again.');
    }
  };

  const handleDelete = async (schedule: ClassSchedule) => {
    if (window.confirm(`Are you sure you want to delete the schedule for ${schedule.courseCode}?`)) {
      try {
        await schedulingApi.classSchedule.admin.delete(schedule.id);
        await loadSchedules();
      } catch (err) {
        console.error('Error deleting schedule:', err);
        alert('Failed to delete schedule. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    resetForm();
    setEditingSchedule(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading schedules...</p>
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
            onClick={() => window.location.reload()} 
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
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="mb-2">Class Schedule Administration</h1>
            <p className="text-muted-foreground">
              Manage class schedules - create, edit, and delete schedule entries.
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
            + Create New Schedule
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label htmlFor="search" className="block mb-2 text-muted-foreground text-sm">
                Search
              </label>
              <Input
                id="search"
                placeholder="Course code, title, or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filter-batch" className="block mb-2 text-muted-foreground text-sm">
                Batch
              </label>
              <select
                id="filter-batch"
                className="w-full p-2 border rounded-md bg-background"
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
              >
                <option value="">All Batches</option>
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>Batch {batch}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-semester" className="block mb-2 text-muted-foreground text-sm">
                Semester
              </label>
              <select
                id="filter-semester"
                className="w-full p-2 border rounded-md bg-background"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>Semester {semester}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-room" className="block mb-2 text-muted-foreground text-sm">
                Room
              </label>
              <select
                id="filter-room"
                className="w-full p-2 border rounded-md bg-background"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
                disabled={loadingRooms}
              >
                <option value="">
                  {loadingRooms ? 'Loading rooms...' : 'All Rooms'}
                </option>
                {roomOptions.map((room) => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterBatch('');
                  setFilterSemester('');
                  setFilterRoom('');
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-primary font-semibold">
            Class Schedules ({filteredSchedules.length} of {schedules.length})
          </h3>
        </div>
        
        {filteredSchedules.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-muted-foreground text-lg">No schedules found.</p>
            <p className="text-muted-foreground/70 text-sm mt-2">
              {schedules.length === 0 ? 'Create your first schedule to get started.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Course</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Batch</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Semester</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Room</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Day</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Time</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Instructor</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-primary">{schedule.courseCode}</div>
                        <div className="text-sm text-muted-foreground">{schedule.courseTitle}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-chart-1/10 text-chart-1 px-2 py-1 rounded-full text-xs font-medium">
                        Batch {schedule.batch}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                        Sem {schedule.semester}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-chart-2/10 text-chart-2 px-2 py-1 rounded-full text-xs font-medium">
                        {schedule.room}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{schedule.day}</td>
                    <td className="px-4 py-3 font-mono text-sm">{schedule.startTime} - {schedule.endTime}</td>
                    <td className="px-4 py-3 text-sm">{schedule.instructor}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(schedule)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(schedule)}
                          size="sm"
                          variant="destructive"
                          className="text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <div 
            className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary">
                {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="course_code" className="block mb-2 text-muted-foreground">
                    Course Code
                  </label>
                  <Input
                    id="course_code"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleInputChange}
                    placeholder="e.g., CSE101"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="instructor" className="block mb-2 text-muted-foreground">
                    Instructor
                  </label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="Instructor name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="batch" className="block mb-2 text-muted-foreground">
                    Batch
                  </label>
                  <select
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Select Batch</option>
                    {batchOptions.map((batch) => (
                      <option key={batch} value={batch}>Batch {batch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="semester" className="block mb-2 text-muted-foreground">
                    Semester
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesterOptions.map((semester) => (
                      <option key={semester} value={semester}>Semester {semester}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="room" className="block mb-2 text-muted-foreground">
                    Room
                  </label>
                  <select
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-background"
                    required
                    disabled={loadingRooms}
                  >
                    <option value="">
                      {loadingRooms ? 'Loading rooms...' : 'Select Room'}
                    </option>
                    {roomOptions.map((room) => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="day" className="block mb-2 text-muted-foreground">
                    Day
                  </label>
                  <select
                    id="day"
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Select Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="start_time" className="block mb-2 text-muted-foreground">
                    Start Time
                  </label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="end_time" className="block mb-2 text-muted-foreground">
                    End Time
                  </label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
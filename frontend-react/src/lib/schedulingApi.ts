import type { 
  RoomAvailability, 
  RoomBooking, 
  BookingFormData, 
  ClassSchedule 
} from '@/types/scheduling';

// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE = "http://localhost:8000";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function to make authenticated requests
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Try to get error details from response body
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Keep the default error message if response is not JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('❌ Failed to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Room Availability API
export const roomAvailabilityApi = {
  // Get all room availability
  getAll: async (): Promise<RoomAvailability[]> => {
    return apiRequest('/scheduling/rooms/availability');
  },

  // Create sample room data (for development)
  createSampleData: async (): Promise<{ message: string }> => {
    return apiRequest('/scheduling/sample-data/rooms', { method: 'POST' });
  },

  // Admin CRUD operations
  admin: {
    // Get all rooms for admin management
    getAll: async (): Promise<RoomAvailability[]> => {
      return apiRequest('/scheduling/admin/rooms');
    },

    // Create a new room
    create: async (roomData: {
      room: string;
      capacity: number;
      facilities: string[];
      availableSlots?: Array<{
        day: string;
        slots: Array<{ startTime: string; endTime: string }>;
      }>;
    }): Promise<{ message: string; room_id: number }> => {
      return apiRequest('/scheduling/admin/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
      });
    },

    // Update an existing room
    update: async (roomId: number, roomData: {
      room?: string;
      capacity?: number;
      facilities?: string[];
      availableSlots?: Array<{
        day: string;
        slots: Array<{ startTime: string; endTime: string }>;
      }>;
    }): Promise<{ message: string; room_id: number }> => {
      return apiRequest(`/scheduling/admin/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify(roomData),
      });
    },

    // Delete a room
    delete: async (roomId: number): Promise<{ message: string }> => {
      return apiRequest(`/scheduling/admin/rooms/${roomId}`, {
        method: 'DELETE',
      });
    },

    // Get a specific room by ID
    getById: async (roomId: number): Promise<RoomAvailability> => {
      return apiRequest(`/scheduling/admin/rooms/${roomId}`);
    },
  },
};

// Room Booking API
export const roomBookingApi = {
  // Create a new booking
  create: async (bookingData: BookingFormData): Promise<{ message: string; booking_id: number }> => {
    return apiRequest('/scheduling/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get all bookings (optionally filtered by status)
  getAll: async (status?: string): Promise<RoomBooking[]> => {
    const url = status ? `/scheduling/bookings?status=${status}` : '/scheduling/bookings';
    return apiRequest(url);
  },

  // Get pending bookings
  getPending: async (): Promise<RoomBooking[]> => {
    return apiRequest('/scheduling/bookings?status=Pending');
  },

  // Approve a booking
  approve: async (bookingId: number): Promise<{ message: string }> => {
    return apiRequest(`/scheduling/bookings/${bookingId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'approve' }),
    });
  },

  // Reject a booking
  reject: async (bookingId: number, rejectionReason: string): Promise<{ message: string }> => {
    return apiRequest(`/scheduling/bookings/${bookingId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ 
        action: 'reject',
        rejectionReason 
      }),
    });
  },
};

// Class Schedule API
export const classScheduleApi = {
  // Get all schedules with optional filters
  getAll: async (filters?: {
    batch?: string;
    semester?: string;
    room?: string;
    courseCode?: string;
  }): Promise<ClassSchedule[]> => {
    const params = new URLSearchParams();
    if (filters?.batch) params.append('batch', filters.batch);
    if (filters?.semester) params.append('semester', filters.semester);
    if (filters?.room) params.append('room', filters.room);
    if (filters?.courseCode) params.append('course_code', filters.courseCode);
    
    const url = `/scheduling/schedules${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Get all rooms used in schedules (for filtering)
  getRooms: async (): Promise<string[]> => {
    return apiRequest('/scheduling/schedules/rooms');
  },

  // Get all courses available for scheduling
  getCourses: async (): Promise<Array<{ course_code: string; course_title: string; credits: number }>> => {
    return apiRequest('/scheduling/schedules/courses');
  },

  // Get all batches used in schedules (for filtering)
  getBatches: async (): Promise<string[]> => {
    return apiRequest('/scheduling/schedules/batches');
  },

  // Get all semesters used in schedules (for filtering)
  getSemesters: async (): Promise<string[]> => {
    return apiRequest('/scheduling/schedules/semesters');
  },

  // Get all instructors for scheduling
  getInstructors: async (): Promise<Array<{ id: string; name: string; email: string }>> => {
    return apiRequest('/scheduling/schedules/instructors');
  },

  // Admin CRUD operations
  admin: {
    // Create a new schedule
    create: async (scheduleData: {
      course_code: string;
      batch: string;
      semester: string;
      room: string;
      day: string;
      start_time: string;
      end_time: string;
      instructor: string;
    }): Promise<{ message: string; schedule_id: number }> => {
      return apiRequest('/scheduling/admin/schedules', {
        method: 'POST',
        body: JSON.stringify(scheduleData),
      });
    },

    // Update an existing schedule
    update: async (scheduleId: number, scheduleData: {
      course_code?: string;
      batch?: string;
      semester?: string;
      room?: string;
      day?: string;
      start_time?: string;
      end_time?: string;
      instructor?: string;
    }): Promise<{ message: string }> => {
      return apiRequest(`/scheduling/admin/schedules/${scheduleId}`, {
        method: 'PUT',
        body: JSON.stringify(scheduleData),
      });
    },

    // Delete a schedule
    delete: async (scheduleId: number): Promise<{ message: string }> => {
      return apiRequest(`/scheduling/admin/schedules/${scheduleId}`, {
        method: 'DELETE',
      });
    },

    // Get a specific schedule by ID
    getById: async (scheduleId: number): Promise<ClassSchedule> => {
      return apiRequest(`/scheduling/admin/schedules/${scheduleId}`);
    },
  },
};

export async function fetchAssignments() {
  return apiRequest('/staff-api/assignments');
}

export async function createAssignment(data: any) {
  return apiRequest('/staff-api/assignments', {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAssignment(id: string, data: any) {
  return apiRequest(`/staff-api/assignments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAssignment(id: string) {
  return apiRequest(`/staff-api/assignments/${id}`, {
    method: "DELETE"
  });
}

export async function createExam(data: any) {
  return apiRequest('/api/exams/staff-api/create', {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExam(id: string | number, data: any) {
  const res = await fetch(`${API_BASE}/staff-api/exams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update exam");
  return res.json();
}

export async function deleteExam(id: string | number) {
  const res = await fetch(`${API_BASE}/staff-api/exams/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete exam");
  return res.json();
}

export async function fetchExams() {
  return apiRequest('/api/exams/staff-api/list');
}

export async function fetchMyAssignmentSubmissions() {
  return apiRequest('/staff-api/assignments/submissions/me');
}

// Courses API (from courses.py)
export const coursesApi = {
  // Get all courses for dropdowns
  getAll: async (): Promise<Array<{ 
    id: string; 
    code: string; 
    name: string; 
    description: string; 
    credits: number 
  }>> => {
    const response = await fetch('http://127.0.0.1:8000/api/courses/', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const data = await response.json();
    return data.data; // courses.py returns { data: [...], total: number }
  },
};

// Export all APIs
export const schedulingApi = {
  roomAvailability: roomAvailabilityApi,
  roomBooking: roomBookingApi,
  classSchedule: classScheduleApi,
}; 
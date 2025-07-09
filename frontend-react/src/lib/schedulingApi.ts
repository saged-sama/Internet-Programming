import type { 
  RoomAvailability, 
  RoomBooking, 
  BookingFormData, 
  ClassSchedule 
} from '@/types/scheduling';

const API_BASE_URL = 'http://127.0.0.1:8000/api/scheduling';
const API_BASE = "http://localhost:8000";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function to make authenticated requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

// Room Availability API
export const roomAvailabilityApi = {
  // Get all room availability
  getAll: async (): Promise<RoomAvailability[]> => {
    return apiRequest('/rooms/availability');
  },

  // Create sample room data (for development)
  createSampleData: async (): Promise<{ message: string }> => {
    return apiRequest('/sample-data/rooms', { method: 'POST' });
  },

  // Admin CRUD operations
  admin: {
    // Get all rooms for admin management
    getAll: async (): Promise<RoomAvailability[]> => {
      return apiRequest('/admin/rooms');
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
      return apiRequest('/admin/rooms', {
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
    }): Promise<{ message: string }> => {
      return apiRequest(`/admin/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify(roomData),
      });
    },

    // Delete a room
    delete: async (roomId: number): Promise<{ message: string }> => {
      return apiRequest(`/admin/rooms/${roomId}`, {
        method: 'DELETE',
      });
    },

    // Get a specific room by ID
    getById: async (roomId: number): Promise<RoomAvailability> => {
      return apiRequest(`/admin/rooms/${roomId}`);
    },
  },
};

// Room Booking API
export const roomBookingApi = {
  // Create a new booking
  create: async (bookingData: BookingFormData): Promise<{ message: string; booking_id: number }> => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get all bookings (optionally filtered by status)
  getAll: async (status?: string): Promise<RoomBooking[]> => {
    const url = status ? `/bookings?status=${status}` : '/bookings';
    return apiRequest(url);
  },

  // Get pending bookings
  getPending: async (): Promise<RoomBooking[]> => {
    return apiRequest('/bookings?status=Pending');
  },

  // Approve a booking
  approve: async (bookingId: number): Promise<{ message: string }> => {
    return apiRequest(`/bookings/${bookingId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'approve' }),
    });
  },

  // Reject a booking
  reject: async (bookingId: number, rejectionReason: string): Promise<{ message: string }> => {
    return apiRequest(`/bookings/${bookingId}/approve`, {
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
  }): Promise<ClassSchedule[]> => {
    const params = new URLSearchParams();
    if (filters?.batch) params.append('batch', filters.batch);
    if (filters?.semester) params.append('semester', filters.semester);
    if (filters?.room) params.append('room', filters.room);
    
    const url = `/schedules${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest(url);
  },

  // Get all rooms used in schedules (for filtering)
  getRooms: async (): Promise<string[]> => {
    return apiRequest('/schedules/rooms');
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
      return apiRequest('/admin/schedules', {
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
      return apiRequest(`/admin/schedules/${scheduleId}`, {
        method: 'PUT',
        body: JSON.stringify(scheduleData),
      });
    },

    // Delete a schedule
    delete: async (scheduleId: number): Promise<{ message: string }> => {
      return apiRequest(`/admin/schedules/${scheduleId}`, {
        method: 'DELETE',
      });
    },

    // Get a specific schedule by ID
    getById: async (scheduleId: number): Promise<ClassSchedule> => {
      return apiRequest(`/admin/schedules/${scheduleId}`);
    },
  },
};

export async function fetchAssignments() {
  const res = await fetch(`${API_BASE}/staff-api/assignments`);
  if (!res.ok) throw new Error("Failed to fetch assignments");
  return res.json();
}

export async function createAssignment(data: any) {
  const res = await fetch(`${API_BASE}/staff-api/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create assignment");
  return res.json();
}

export async function updateAssignment(id: number, data: any) {
  const res = await fetch(`${API_BASE}/staff-api/assignments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update assignment");
  return res.json();
}

export async function deleteAssignment(id: number) {
  const res = await fetch(`${API_BASE}/staff-api/assignments/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete assignment");
  return res.json();
}

// Export all APIs
export const schedulingApi = {
  roomAvailability: roomAvailabilityApi,
  roomBooking: roomBookingApi,
  classSchedule: classScheduleApi,
}; 
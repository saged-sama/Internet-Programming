import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Meeting {
  id: number;
  title: string;
  description: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  location: string;
  url?: string;
  organizer: string;
  type: 'Faculty' | 'Department' | 'Student' | 'Administrative';
  is_registration_required: boolean;
}

export interface MeetingsResponse {
  data: Meeting[];
  total: number;
  page: number;
  limit: number;
}

export interface MeetingFilters {
  skip?: number;
  limit?: number;
  search_query?: string;
  meeting_type?: string;
  start_date?: string;
  end_date?: string;
  organizer?: string;
}

export const getMeetings = async (filters: MeetingFilters = {}): Promise<MeetingsResponse> => {
  const params = new URLSearchParams();
  
  // Add all filters to params
  if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters.search_query) params.append('search_query', filters.search_query);
  if (filters.meeting_type) params.append('meeting_type', filters.meeting_type);
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.organizer) params.append('organizer', filters.organizer);
  
  const response = await axios.get(`${API_URL}/staff-api/meetings/?${params.toString()}`);
  return response.data;
};

export const getMeeting = async (id: number): Promise<Meeting> => {
  const response = await axios.get(`${API_URL}/staff-api/meetings/${id}`);
  return response.data;
};

export const createMeeting = async (meetingData: Omit<Meeting, 'id'>): Promise<Meeting> => {
  const response = await axios.post(`${API_URL}/staff-api/meetings/`, meetingData);
  return response.data;
};

export const updateMeeting = async (id: number, meetingData: Partial<Meeting>): Promise<Meeting> => {
  const response = await axios.put(`${API_URL}/staff-api/meetings/${id}`, meetingData);
  return response.data;
};

export const deleteMeeting = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/staff-api/meetings/${id}`);
};

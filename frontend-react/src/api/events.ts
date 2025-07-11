import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Event {
  id: number;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  registration_required: boolean;
  registration_deadline: string | null;
}

export interface EventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
}

export interface EventFilters {
  skip?: number;
  limit?: number;
  search_query?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
}

export const getEvents = async (filters: EventFilters = {}): Promise<EventsResponse> => {
  const params = new URLSearchParams();
  
  // Add all filters to params
  if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters.search_query) params.append('search_query', filters.search_query);
  if (filters.category) params.append('category', filters.category);
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  
  const response = await axios.get(`${API_URL}/staff-api/events/?${params.toString()}`);
  return response.data;
};

export const getEvent = async (id: number): Promise<Event> => {
  const response = await axios.get(`${API_URL}/staff-api/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  const response = await axios.post(`${API_URL}/staff-api/events/`, eventData);
  return response.data;
};

export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<Event> => {
  const response = await axios.put(`${API_URL}/staff-api/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/staff-api/events/${id}`);
};

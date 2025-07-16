import type { Notice, NoticeFilterOptions } from '../types/notice';
import { getAuthToken } from './auth';

const API_BASE_URL = 'http://localhost:8000';

// Generic API request function for notices
async function noticeApiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get authentication token
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if token exists
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: You need to be logged in as an admin to perform this action');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Notice API request failed:', error);
    throw error;
  }
}

// Fetch all notices with optional filtering
export async function getNotices(filters: NoticeFilterOptions = {}): Promise<any[]> {
  const searchParams = new URLSearchParams();
  
  if (filters.category) searchParams.append('category', filters.category);
  if (filters.skip !== undefined) searchParams.append('skip', filters.skip.toString());
  if (filters.limit !== undefined) searchParams.append('limit', filters.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = `/staff-api/notices${queryString ? `?${queryString}` : ''}`;
  
  return noticeApiRequest<any[]>(endpoint);
}

// Fetch a specific notice by ID
export async function getNoticeById(noticeId: number): Promise<Notice> {
  return noticeApiRequest<Notice>(`/staff-api/notices/${noticeId}`);
}

// Create a new notice
export async function createNotice(noticeData: {
  title: string;
  category: string;
  description: string;
  is_important?: boolean;
}): Promise<Notice> {
  // Add a timestamp to help make each request unique
  // This can help avoid ID conflicts on the backend
  const dataWithTimestamp = {
    ...noticeData,
    _timestamp: new Date().getTime() // This won't affect the actual notice data, just helps make the request unique
  };
  
  return noticeApiRequest<Notice>('/staff-api/notices', {
    method: 'POST',
    body: JSON.stringify(dataWithTimestamp),
  });
}

// Update an existing notice
export async function updateNotice(noticeId: number, noticeData: Partial<{
  title: string;
  category: string;
  description: string;
  is_important: boolean;
}>): Promise<Notice> {
  return noticeApiRequest<Notice>(`/staff-api/notices/${noticeId}`, {
    method: 'PATCH',
    body: JSON.stringify(noticeData),
  });
}

// Delete a notice
export async function deleteNotice(noticeId: number): Promise<void> {
  return noticeApiRequest<void>(`/staff-api/notices/${noticeId}`, {
    method: 'DELETE',
  });
}

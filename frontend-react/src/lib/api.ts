import type { 
  Course, 
  CourseApiResponse, 
  CourseFilterOptions,
  CourseDegreeLevel,
  CourseSemester 
} from '../types/course';
import type { 
  DegreeProgram, 
  DegreeApiResponse, 
  DegreeFilterOptions,
  DegreeLevel 
} from '../types/degree';

export const ABSOLUTE_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API_BASE_URL = `${ABSOLUTE_BASE_URL}/api`;

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ===============================
// COURSES API
// ===============================

export async function getCourses(filters: CourseFilterOptions = {}): Promise<CourseApiResponse> {
  const searchParams = new URLSearchParams();
  
  if (filters.searchQuery) searchParams.append('searchQuery', filters.searchQuery);
  if (filters.degreeLevel) searchParams.append('degreeLevel', filters.degreeLevel);
  if (filters.semester) searchParams.append('semester', filters.semester);
  if (filters.departmentId) searchParams.append('departmentId', filters.departmentId);
  if (filters.limit) searchParams.append('limit', filters.limit.toString());
  if (filters.offset) searchParams.append('skip', filters.offset.toString());

  const queryString = searchParams.toString();
  const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<CourseApiResponse>(endpoint);
}

export async function getCourse(courseCode: string): Promise<Course> {
  return apiRequest<Course>(`/courses/${courseCode}`);
}

export async function createCourse(courseData: {
  course_code: string;
  course_title: string;
  course_description?: string;
  course_credits?: number;
  degree_level?: CourseDegreeLevel;
  semester?: CourseSemester;
  instructor?: string;
  prerequisites?: string[];
  topics?: string[];
  objectives?: string[];
  learning_outcomes?: string[];
}): Promise<Course> {
  return apiRequest<Course>('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
}

export async function updateCourse(courseCode: string, courseData: Partial<{
  course_title: string;
  course_description?: string;
  course_credits?: number;
  degree_level?: CourseDegreeLevel;
  semester?: CourseSemester;
  instructor?: string;
  prerequisites?: string[];
  topics?: string[];
  objectives?: string[];
  learning_outcomes?: string[];
}>): Promise<Course> {
  return apiRequest<Course>(`/courses/${courseCode}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
}

export async function deleteCourse(courseCode: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/courses/${courseCode}`, {
    method: 'DELETE',
  });
}

// ===============================
// DEGREE PROGRAMS API
// ===============================

export async function getDegreePrograms(filters: DegreeFilterOptions = {}): Promise<DegreeApiResponse> {
  const searchParams = new URLSearchParams();
  
  if (filters.searchQuery) searchParams.append('searchQuery', filters.searchQuery);
  if (filters.level) searchParams.append('level', filters.level);
  if (filters.departmentId) searchParams.append('departmentId', filters.departmentId);
  if (filters.limit) searchParams.append('limit', filters.limit.toString());
  if (filters.offset) searchParams.append('offset', filters.offset.toString());

  const queryString = searchParams.toString();
  const endpoint = `/programs${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<DegreeApiResponse>(endpoint);
}

export async function getDegreeProgram(programId: string): Promise<DegreeProgram> {
  return apiRequest<DegreeProgram>(`/programs/${programId}`);
}

export async function createDegreeProgram(programData: {
  id: string;
  title: string;
  level: DegreeLevel;
  description: string;
  creditsRequired: number;
  duration: string;
  department?: string;
  concentrations?: string[];
  admissionRequirements: string[];
  careerOpportunities: string[];
  curriculum?: object;
}): Promise<DegreeProgram> {
  return apiRequest<DegreeProgram>('/programs', {
    method: 'POST',
    body: JSON.stringify(programData),
  });
}

export async function updateDegreeProgram(programId: string, programData: Partial<{
  title: string;
  level: DegreeLevel;
  description: string;
  creditsRequired: number;
  duration: string;
  department?: string;
  concentrations?: string[];
  admissionRequirements: string[];
  careerOpportunities: string[];
  curriculum?: object;
}>): Promise<DegreeProgram> {
  return apiRequest<DegreeProgram>(`/programs/${programId}`, {
    method: 'PUT',
    body: JSON.stringify(programData),
  });
}

export async function deleteDegreeProgram(programId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/programs/${programId}`, {
    method: 'DELETE',
  });
}

// ===============================
// UTILITY API FUNCTIONS
// ===============================

export async function getDepartments(): Promise<{ departments: string[] }> {
  return apiRequest<{ departments: string[] }>('/programs/departments/list');
}

export async function getDegreeLevels(): Promise<{ levels: string[] }> {
  return apiRequest<{ levels: string[] }>('/programs/levels/list');
} 
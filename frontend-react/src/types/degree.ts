/**
 * Possible degree levels offered by the department
 */
export type DegreeLevel = 'undergraduate' | 'graduate' | 'doctorate';

/**
 * Interface for a course in the curriculum
 */
export interface Course {
  id?: string;
  name: string;
  code?: string;
  credits?: number;
  description?: string;
}

/**
 * Interface for the curriculum structure of a degree program
 */
export interface Curriculum {
  coreCourses: string[];
  electiveCourses?: string[];
  totalCredits?: number;
}

/**
 * Interface for a complete degree program
 * This structure aligns with expected backend API responses
 */
export interface DegreeProgram {
  id: string;
  title: string;
  level: DegreeLevel;
  description: string;
  creditsRequired: number;
  duration: string;
  concentrations?: string[];
  admissionRequirements: string[];
  careerOpportunities: string[];
  curriculum: Curriculum;
  updatedAt?: string;
  departmentId?: string;
}

/**
 * Interface for degree program filtering options
 * Used for both UI state and API query parameters
 */
export interface DegreeFilterOptions {
  level?: DegreeLevel;
  searchQuery?: string;
  departmentId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Interface for API responses when fetching degree programs
 */
export interface DegreeApiResponse {
  data: DegreeProgram[];
  total: number;
  page?: number;
  limit?: number;
} 
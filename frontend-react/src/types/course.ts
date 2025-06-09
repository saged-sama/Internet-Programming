/**
 * The different levels a course can be offered at
 */
export type CourseDegreeLevel = 'undergraduate' | 'graduate' | 'doctorate' | 'all';

/**
 * The difficulty level of a course
 */
export type CourseDifficulty = 'introductory' | 'intermediate' | 'advanced';

/**
 * The semesters a course can be offered in
 */
export type CourseSemester = '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th';

/**
 * Represents a course in the curriculum
 */
export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  degreeLevel: CourseDegreeLevel;
  semester: CourseSemester;
  instructor?: string;
  prerequisites: string[];
  topics: string[];
  objectives: string[];
  outcomes: string[];
}

/**
 * Options for filtering courses
 */
export interface CourseFilterOptions {
  searchQuery?: string;
  degreeLevel?: CourseDegreeLevel;
  semester?: CourseSemester;
  departmentId?: string;
  limit?: number;
  offset?: number;
}

/**
 * API response format for course endpoints
 */
export interface CourseApiResponse {
  data: Course[];
  total: number;
  page?: number;
  limit?: number;
} 
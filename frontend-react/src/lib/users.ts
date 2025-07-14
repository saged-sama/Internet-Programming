export interface UserResponse {
  id: string;
  name: string;
  role?: "student" | "faculty" | "admin";
  department?: string;
  email?: string;
  phone?: string;
  image?: string;
  bio?: string;
  address?: string;
  date_of_birth?: string;  // ISO date
}

export interface FacultyResponse {
  id: string;
  user_id: string;
  specialization?: string;
  research_interests?: string;
  publications?: string;
  courses_taught?: string;
  office_hours?: string;
  office_location?: string;
  chairman: boolean;
  user: UserResponse;
}

export interface StudentResponse {
  id: string;
  user_id: string;
  student_id?: string;
  major?: string;
  admission_date?: string;   // ISO date
  graduation_date?: string;  // ISO date
  year_of_study?: number;
  student_type?: string;
  cgpa?: number;
  extracurricular_activities?: string;
  user: UserResponse;
}

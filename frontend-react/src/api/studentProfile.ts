import type { CourseSemester } from "@/types/course";

export interface User {
    id: string;
    name: string;
    role?: 'student' | 'faculty' | 'admin';
    department?: string;
    email?: string;
    phone?: string;
    image?: string;
    bio?: string;
    address?: string;
    date_of_birth?: string;
}

export interface StudentProfile {
    id: string;
    user_id: string;
    student_id?: string;
    major?: string;
    admission_date?: string;
    graduation_date?: string;
    year_of_study?: number;
    current_semester?: CourseSemester;
    student_type?: string;
    cgpa?: number;
    extracurricular_activities?: string;
    user: User;
}

export interface StudentProfileCreateRequest {
    user_id: string;
    student_id?: string;
    major?: string;
    admission_date?: string;
    graduation_date?: string;
    year_of_study?: number;
    current_semester?: string;
    student_type?: string;
    cgpa?: number;
    extracurricular_activities?: string;
}

export interface StudentProfileUpdateRequest {
    student_id?: string;
    major?: string;
    admission_date?: string;
    graduation_date?: string;
    year_of_study?: number;
    student_type?: string;
    cgpa?: number;
    extracurricular_activities?: string;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const studentProfileApi = {
    getAllStudents: async (): Promise<StudentProfile[]> => {
        try {
            const response = await fetch(`${BASE_URL}/staff-api/student/`);
            if (!response.ok) throw new Error(`Failed to fetch students: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    getStudent: async (studentId: string): Promise<StudentProfile> => {
        try {
            const response = await fetch(`${BASE_URL}/staff-api/student/${studentId}`);
            if (!response.ok) throw new Error(`Failed to fetch student: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching student:', error);
            throw error;
        }
    },

    createStudentProfile: async (data: StudentProfileCreateRequest): Promise<{ message: string; student_id: string }> => {
        try {
            const response = await fetch(`${BASE_URL}/staff-api/student/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`Failed to create student profile: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating student profile:', error);
            throw error;
        }
    },

    updateStudentProfile: async (studentId: string, data: StudentProfileUpdateRequest): Promise<StudentProfile> => {
        try {
            const response = await fetch(`${BASE_URL}/staff-api/student/${studentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`Failed to update student profile: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error updating student profile:', error);
            throw error;
        }
    },
};
import { getAuthToken } from "@/lib/auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface Grade {
    id: string;
    student_id?: string;
    course_code?: string;
    semester?: string;
    incourse_marks?: number;
    final_marks?: number;
    total_marks?: number;
    grade?: number;
}

export interface GradeCreateRequest {
    student_id: string;
    course_code: string;
    semester: string;
    incourse_marks?: number;
    final_marks?: number;
    total_marks?: number;
    grade?: number;
}

export interface GradeUpdateRequest {
    student_id?: string;
    course_code?: string;
    semester?: string;
    incourse_marks?: number;
    final_marks?: number;
    total_marks?: number;
    grade?: number;
}

export interface GradeResponse {
    id: string;
    student: any;
    course: any;
    semester: any;
    incourse_marks?: number;
    final_marks?: number;
    total_marks?: number;
    grade?: number;
}

export interface GetGradesParams {
    student_id?: string;
    course_code?: string;
    semester?: string;
    skip?: number;
    limit?: number;
}

export const getGrades = async (params?: GetGradesParams): Promise<GradeResponse[]> => {
    try {
        const token = getAuthToken();
        const queryParams = new URLSearchParams();
        
        if (params?.student_id) queryParams.append('student_id', params.student_id);
        if (params?.course_code) queryParams.append('course_code', params.course_code);
        if (params?.semester) queryParams.append('semester', params.semester);
        if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
        if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${BASE_URL}/staff-api/grades?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch grades: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching grades:', error);
        throw error;
    }
};

export const getGrade = async (id: string): Promise<GradeResponse> => {
    try {
        const token = getAuthToken();
        
        const response = await fetch(`${BASE_URL}/staff-api/grades/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch grade: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching grade:', error);
        throw error;
    }
};

export const createGrade = async (gradeData: GradeCreateRequest): Promise<GradeResponse> => {
    try {
        const token = getAuthToken();
        
        const response = await fetch(`${BASE_URL}/staff-api/grades/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gradeData)
        });

        if (!response.ok) {
            throw new Error(`Failed to create grade: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating grade:', error);
        throw error;
    }
};

export const updateGrade = async (id: string, gradeData: GradeUpdateRequest): Promise<GradeResponse> => {
    try {
        const token = getAuthToken();
        
        const response = await fetch(`${BASE_URL}/staff-api/grades/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gradeData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update grade: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating grade:', error);
        throw error;
    }
};

export const deleteGrade = async (id: string): Promise<{ message: string }> => {
    try {
        const token = getAuthToken();
        
        const response = await fetch(`${BASE_URL}/staff-api/grades/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete grade: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting grade:', error);
        throw error;
    }
};
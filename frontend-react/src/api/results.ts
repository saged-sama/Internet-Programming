import { getAuthToken } from "@/lib/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface ResultsReadQuery {
    year?: string;
    semester?: string;
    student_id?: string;
}

export interface Result {
    id: string;
    title: string;
    year: string;
    semester: string;
    file: string;
    created_at: string;
    updated_at: string;
    published_by: string;
}

export interface StudentResult {
    title: string;
    year: string;
    semester: string;
    student_data: Record<string, string>;
}

export interface StudentsGrades {
    title: string;
    year: string;
    semester: string;
    student_data: {
        student_id: string;
        title: string;
        total_gpa: number;
        cgpa: number;
        [courseCode: string]: string | number;
    },
    file: string;
}

// Get all results with optional filters
export const getResults = async (query?: ResultsReadQuery): Promise<StudentsGrades[]> => {
    const params = new URLSearchParams();
    if (query?.year) params.append('year', query.year);
    if (query?.semester) params.append('semester', query.semester);
    if (query?.student_id) params.append('student_id', query.student_id);

    const url = `${BACKEND_URL}/api/results${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`);
    }
    
    return response.json();
};

// Create a new result
export const createResult = async (title: string, year: string, semester: string, file: File): Promise<Result> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('year', year);
    formData.append('semester', semester);
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/api/results/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to create result: ${response.statusText}`);
    }

    return response.json();
};

// Update a result
export const updateResult = async (resultId: string, title?: string, file?: File): Promise<Result> => {
    const formData = new FormData();
    if (title) formData.append('title', title);
    if (file) formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/api/results/${resultId}`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to update result: ${response.statusText}`);
    }

    return response.json();
};

// Delete a result
export const deleteResult = async (resultId: string): Promise<{ message: string }> => {
    const response = await fetch(`${BACKEND_URL}/api/results/${resultId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete result: ${response.statusText}`);
    }

    return response.json();
};

// Get student result
export const getStudentResult = async (resultId: string, studentId: string): Promise<StudentResult> => {
    const response = await fetch(`${BACKEND_URL}/api/results/${resultId}/student/${studentId}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch student result: ${response.statusText}`);
    }

    return response.json();
};
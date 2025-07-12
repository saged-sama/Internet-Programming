// API functions for Course Materials

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface CourseMaterial {
    id: string;
    course_code?: string;
    title?: string;
    type?: string;
    description?: string;
    upload_date?: string;
    file_url?: string;
    file_type?: string;
    file_size?: string;
    uploaded_by?: string;
}

// Get all materials for a specific course
export const getCourseMaterials = async (courseCode: string): Promise<CourseMaterial[]> => {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseCode}/materials`);
    if (!response.ok) {
        throw new Error('Failed to fetch course materials');
    }
    return await response.json();
};

// Add material to a course
export const addCourseMaterial = async (courseCode: string, material: Omit<CourseMaterial, 'id' | 'course_code'>): Promise<CourseMaterial> => {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseCode}/materials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(material),
    });
    if (!response.ok) {
        throw new Error('Failed to add course material');
    }
    return await response.json();
};

// Get a specific course material
export const getCourseMaterial = async (materialId: string): Promise<CourseMaterial> => {
    const response = await fetch(`${API_BASE_URL}/api/courses/materials/${materialId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch course material');
    }
    return await response.json();
};

// Update course material
export const updateCourseMaterial = async (materialId: string, material: Partial<CourseMaterial>): Promise<CourseMaterial> => {
    const response = await fetch(`${API_BASE_URL}/api/courses/materials/${materialId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(material),
    });
    if (!response.ok) {
        throw new Error('Failed to update course material');
    }
    return await response.json();
};

// Delete course material
export const deleteCourseMaterial = async (materialId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/courses/materials/${materialId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete course material');
    }
    return await response.json();
};
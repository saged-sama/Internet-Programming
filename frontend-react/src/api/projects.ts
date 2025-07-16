// API functions for Research Projects

import type { Project, ProjectCreateRequest, ProjectsApiResponse } from "../types/research";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Get auth token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// Get all projects with optional filters
export const getProjects = async (params?: {
    skip?: number;
    limit?: number;
    searchQuery?: string;
    year?: number;
    topic?: string;
    supervisor?: string;
}): Promise<ProjectsApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
    }

    const response = await fetch(`${API_BASE_URL}/api/projects?${queryParams}`, {
        headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    return await response.json();
};

// Get a specific project
export const getProject = async (projectId: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch project');
    }
    return await response.json();
};

// Create a new project
export const createProject = async (project: ProjectCreateRequest): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(project),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create project');
    }
    return await response.json();
};

// Update a project
export const updateProject = async (projectId: string, project: Partial<ProjectCreateRequest>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(project),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update project');
    }
    return await response.json();
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete project');
    }
    return await response.json();
};

// Add team member to project
export const addTeamMember = async (projectId: string, userId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/team/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add team member');
    }
    return await response.json();
};

// Remove team member from project
export const removeTeamMember = async (projectId: string, userId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/team/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to remove team member');
    }
    return await response.json();
};
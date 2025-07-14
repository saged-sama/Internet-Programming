import { getAuthToken, type User } from "@/lib/auth";

export interface UserProfile {
    id: string;
    name: string | null;
    role: string | null;
    department: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
    bio: string | null;
    address: string | null;
    date_of_birth: string | null;
}

export async function getUserProfile(currerntUser: User): Promise<UserProfile | null> {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users-api/profiles/${currerntUser.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        console.log('User profile fetched:', data);
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
export async function updateUserProfile(
    formData: FormData,
    userId: string,
    name: string | null
): Promise<UserProfile | null> {
    try {
        const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/users-api/profiles/${userId}`);
        if (name) {
            url.searchParams.append('name', name);
        }

        const response = await fetch(url.toString(), {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`
            },
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }

        const data = await response.json();
        console.log('User profile updated:', data);
        return data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return null;
    }
}
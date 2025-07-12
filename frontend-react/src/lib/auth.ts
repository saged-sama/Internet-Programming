// Authentication and role management utilities

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'faculty' | 'staff';
  access_token?: string;
  token?: string;
}

export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch {
    return null;
  }
};

export const getCurrentUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const isLoggedIn = (): boolean => {
  const user = getCurrentUser();
  return user !== null;
};

export const isAdmin = (): boolean => {
  const role = getCurrentUserRole();
  return role === 'admin';
};

export const isStudent = (): boolean => {
  const role = getCurrentUserRole();
  return role === 'student';
};

export const isFaculty = (): boolean => {
  const role = getCurrentUserRole();
  return role === 'faculty';
};

export const getAuthToken = (): string | null => {
  // Try multiple possible token storage locations
  let token = localStorage.getItem('token') || localStorage.getItem('access_token');
  
  // Also try to get token from user data
  const userData = localStorage.getItem('user');
  if (!token && userData) {
    try {
      const user = JSON.parse(userData);
      token = user.access_token || user.token;
    } catch {
      // Ignore JSON parse errors
    }
  }
  
  return token;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
  window.location.href = '/auth/login';
};

export const requireAuth = (): User => {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/auth/login';
    throw new Error('Authentication required');
  }
  return user;
};

export const requireRole = (allowedRoles: string[]): User => {
  const user = requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
  }
  return user;
};

export const requireAdmin = (): User => {
  return requireRole(['admin']);
};

export const requireStudent = (): User => {
  return requireRole(['student']);
};

export const login = async (formData: FormData): Promise<User | null> => {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Store user data and token (matching backend response format)
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      access_token: data.access_token,
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token', data.access_token);

    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const getDashboardRoute = (): string => {
  const user = getCurrentUser();
  if (!user) {
    return '/auth/login';
  }

  switch (user.role) {
    case 'admin':
      return '/dashboard/admin';
    case 'faculty':
      return '/dashboard/faculty';
    case 'student':
      return '/dashboard/student';
    default:
      return '/dashboard';
  }
}; 
// Simple demo auth utility

const USERS = [
  { email: 'student@gmail.com', password: '123456', role: 'student' },
  { email: 'admin@gmail.com', password: '123456', role: 'admin' },
  { email: 'faculty@gmail.com', password: '123456', role: 'faculty' },
];

export async function login(formData: FormData) {
  let user: string | null = null;;
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      body: formData,
    })
    if(!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    user = data.user;
  }
  catch (error) {
    console.error('Login error:', error);
  }
  return user;
}

export function logout() {
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  const access_token = localStorage.getItem('access_token');
  if(!access_token) return false;
  return true;
}

export function getDashboardRoute() {
  const user = getCurrentUser();
  if (!user) return '/auth/login';
  if (user.role === 'student') return '/dashboard/student';
  if (user.role === 'admin') return '/dashboard/admin';
  if (user.role === 'faculty') return '/dashboard/faculty';
  return '/auth/login';
} 
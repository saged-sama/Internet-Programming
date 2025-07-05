// Simple demo auth utility

const USERS = [
  { email: 'student@gmail.com', password: '123456', role: 'student' },
  { email: 'admin@gmail.com', password: '123456', role: 'admin' },
  { email: 'faculty@gmail.com', password: '123456', role: 'faculty' },
];

export function login(email: string, password: string) {
  const user = USERS.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('user', JSON.stringify({ email: user.email, role: user.role }));
    return { email: user.email, role: user.role };
  }
  return null;
}

export function logout() {
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

export function getDashboardRoute() {
  const user = getCurrentUser();
  if (!user) return '/auth/login';
  if (user.role === 'student') return '/dashboard/student';
  if (user.role === 'admin') return '/dashboard/admin';
  if (user.role === 'faculty') return '/dashboard/faculty';
  return '/auth/login';
} 
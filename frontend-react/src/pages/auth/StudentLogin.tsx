import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import GradeInputPanel from '@/components/faculty/GradeInputPanel';
import type { StudentGrade } from '@/types/scheduling';
import studentGradesData from '@/assets/studentGrades.json';

export default function StudentLoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFaculty, setIsFaculty] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple login check - in a real app this would be an API call
    if (username && password) {
      // Check if faculty login
      if (username.toLowerCase().includes('faculty')) {
        setIsFaculty(true);
        // Load student grades for faculty
        setStudentGrades(studentGradesData as StudentGrade[]);
      } else {
        setIsFaculty(false);
      }
      
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Please enter both username and password');
    }
  };

  const handleSaveGrades = (updatedGrades: StudentGrade[]) => {
    // In a real app, this would be an API call
    setStudentGrades(updatedGrades);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-sm">
            <h1 className="mb-6 text-center">Student Login</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-muted-foreground">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full p-2 border rounded-md bg-background"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (use 'faculty' for faculty access)"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-muted-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full p-2 border rounded-md bg-background"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              
              <button
                type="submit"
                className="w-full p-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Login
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <Link to="/" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        ) : isFaculty ? (
          <div>
            <div className="mb-6">
              <h1 className="mb-2">Faculty Grade Input Panel</h1>
              <p className="text-muted-foreground">
                Manage and submit student grades for your courses.
              </p>
            </div>
            
            {showSuccessMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                Grades saved successfully!
              </div>
            )}
            
            <GradeInputPanel 
              students={studentGrades}
              onSaveGrades={handleSaveGrades}
            />
            
            <div className="mt-6 text-center">
              <button
                className="px-4 py-2 border border-muted rounded-md hover:bg-muted"
                onClick={() => setIsLoggedIn(false)}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="mb-2">Student Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome, {username}! View your courses and grades.
              </p>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="mb-4 font-medium">Your Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="font-medium mb-1">CSE101 - Introduction to Computer Science</div>
                    <div className="text-sm text-muted-foreground">Semester 1</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="font-medium mb-1">CSE201 - Data Structures</div>
                    <div className="text-sm text-muted-foreground">Semester 2</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="font-medium mb-1">CSE301 - Database Systems</div>
                    <div className="text-sm text-muted-foreground">Semester 3</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="font-medium mb-1">CSE401 - Artificial Intelligence</div>
                    <div className="text-sm text-muted-foreground">Semester 4</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="mb-4 font-medium">Your Grades</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Course</th>
                        <th className="py-3 px-4 text-center font-medium">Assignment</th>
                        <th className="py-3 px-4 text-center font-medium">Midterm</th>
                        <th className="py-3 px-4 text-center font-medium">Final</th>
                        <th className="py-3 px-4 text-center font-medium">Total</th>
                        <th className="py-3 px-4 text-center font-medium">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted">
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">CSE101</div>
                          <div className="text-muted-foreground text-sm">Introduction to Computer Science</div>
                        </td>
                        <td className="py-3 px-4 text-center">18/20</td>
                        <td className="py-3 px-4 text-center">25/30</td>
                        <td className="py-3 px-4 text-center">45/50</td>
                        <td className="py-3 px-4 text-center font-medium">88</td>
                        <td className="py-3 px-4 text-center font-medium">A</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">CSE201</div>
                          <div className="text-muted-foreground text-sm">Data Structures</div>
                        </td>
                        <td className="py-3 px-4 text-center">16/20</td>
                        <td className="py-3 px-4 text-center">22/30</td>
                        <td className="py-3 px-4 text-center">40/50</td>
                        <td className="py-3 px-4 text-center font-medium">78</td>
                        <td className="py-3 px-4 text-center font-medium">B+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                className="px-4 py-2 border border-muted rounded-md hover:bg-muted"
                onClick={() => setIsLoggedIn(false)}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

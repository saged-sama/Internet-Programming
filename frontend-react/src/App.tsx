import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/landing";
import NoticesPage from "./pages/notices";
import NoticeDetailPage from "./pages/notices/NoticeDetail";
import EventsPage from "./pages/events";
import ContactPage from "./pages/contact";
import DirectoryPage from "./pages/directory";
import DirectoryDetailPage from "./pages/directory/detail";
import MeetingsPage from "./pages/meetings";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import RegistrationSuccessPage from "./pages/auth/registration-success";
import DegreesPage from "./pages/degrees";
import CoursesPage from "./pages/courses";
import ClassSchedulePage from "./pages/scheduling/ClassSchedule";
import ClassScheduleAdmin from "./pages/scheduling/ClassScheduleAdmin";
import RoomAvailabilityPage from "./pages/scheduling/RoomAvailability";
import RoomAvailabilityAdmin from "./pages/scheduling/RoomAvailabilityAdmin";
import AdminApprovalPage from "./pages/scheduling/AdminApproval";
import { ResourcesPage } from "./pages/resources/ResourcesPage";
import { ResearchPage } from "./pages/research/ResearchPage";
import { AwardsPage } from "./pages/awards/AwardsPage";
import ExamTimetablesPage from "./pages/exams/ExamTimetables";
import ExamManagementPage from "./pages/exams/ExamManagement";
import AssignmentsPage from "./pages/assignments/Assignments";
import StudentLoginPage from "./pages/auth/StudentLogin";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import FacultyDashboard from "./pages/dashboard/FacultyDashboard";
import DashboardIndex from "./pages/dashboard";
import FinancialsPage from "./pages/financials";
import FeeCreatePage from "./pages/financials/FeeCreatePage";
import { getCurrentUser } from "./lib/auth";
import Layout from "./components/layout/Layout";
import React from "react";
import GradesPage from "./pages/grades";
import ResultsPage from "./pages/results";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/auth/login" replace />;
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/notices/:id" element={<NoticeDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/directory/:id" element={<DirectoryDetailPage />} />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route path="/degrees" element={<DegreesPage />} />
        <Route path="/degrees/:id" element={<DegreesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:degreeId" element={<CoursesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        
        {/* Financial Routes */}
        <Route 
          path="/financials" 
          element={
            <ProtectedRoute>
              <FinancialsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fees/create" 
          element={
            <ProtectedRoute>
              <FeeCreatePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Authentication Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/registration-success"
          element={<RegistrationSuccessPage />}
        />
        
        {/* Scheduling Routes */}
        <Route
          path="/scheduling/class-schedule"
          element={<ClassSchedulePage />}
        />
        <Route
          path="/scheduling/admin/class-schedule"
          element={
            <ProtectedRoute>
              <ClassScheduleAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduling/admin/room-availability"
          element={
            <ProtectedRoute>
              <RoomAvailabilityAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduling/room-availability"
          element={<RoomAvailabilityPage />}
        />
        <Route
          path="/scheduling/admin-approval"
          element={<AdminApprovalPage />}
        />
        
        {/* Exam and Assignment Routes */}
        <Route path="/exams/timetables" element={<ExamTimetablesPage />} />
        <Route 
          path="/exams/management" 
          element={
            <ProtectedRoute>
              <ExamManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/auth/student-login" element={<StudentLoginPage />} />
        
        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/faculty"
          element={
            <ProtectedRoute>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/grading"
          element={
            <ProtectedRoute>
              <GradesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;

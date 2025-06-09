import "./App.css";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/landing";
import NoticesPage from "./pages/notices";
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
import RoomAvailabilityPage from "./pages/scheduling/RoomAvailability";
import AdminApprovalPage from "./pages/scheduling/AdminApproval";
import { ResourcesPage } from "./pages/resources/ResourcesPage";
import ExamTimetablesPage from "./pages/exams/ExamTimetables";
import AssignmentsPage from "./pages/assignments/Assignments";
import StudentLoginPage from "./pages/auth/StudentLogin";


function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/notices' element={<NoticesPage />} />
      <Route path='/events' element={<EventsPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/directory' element={<DirectoryPage />} />
      <Route path='/directory/:id' element={<DirectoryDetailPage />} />
      <Route path='/meetings' element={<MeetingsPage />} />
      <Route path='/degrees' element={<DegreesPage />} />
      <Route path='/degrees/:id' element={<DegreesPage />} />
      <Route path='/courses' element={<CoursesPage />} />
      <Route path='/courses/:degreeId' element={<CoursesPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      {/* Authentication Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/auth/registration-success"
        element={<RegistrationSuccessPage />}
      />
      {/* Scheduling Routes */}
      <Route path="/scheduling/class-schedule" element={<ClassSchedulePage />} />
      <Route path="/scheduling/room-availability" element={<RoomAvailabilityPage />} />
      <Route path="/scheduling/admin-approval" element={<AdminApprovalPage />} />
      {/* Exam and Assignment Routes */}
      <Route path="/exams/timetables" element={<ExamTimetablesPage />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/auth/student-login" element={<StudentLoginPage />} />
    </Routes>
  );
}

export default App;

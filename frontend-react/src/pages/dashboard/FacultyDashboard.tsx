import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MarksUpload from "@/components/faculty/MarksUpload";
import { fetchSubmissionsForMyAssignments } from "@/lib/schedulingApi";
import { getCurrentUser } from "@/lib/auth";
import { apiRequest2 } from "@/lib/schedulingApi";

// Mock data for faculty dashboard
const facultyStats = [
  { title: "Active Courses", value: "4", change: "+1", changeType: "positive" },
  {
    title: "Total Students",
    value: "156",
    change: "+12",
    changeType: "positive",
  },
  {
    title: "Pending Grades",
    value: "23",
    change: "-5",
    changeType: "negative",
  },
  { title: "Office Hours", value: "8", change: "0", changeType: "neutral" },
];

const currentCourses = [
  {
    id: 1,
    code: "CSE 2101",
    name: "Data Structures and Algorithms",
    students: 45,
    assignments: 3,
    avgGrade: 85.2,
  },
  {
    id: 2,
    code: "CSE 2203",
    name: "Computer Organization",
    students: 38,
    assignments: 2,
    avgGrade: 82.7,
  },
  {
    id: 3,
    code: "CSE 3107",
    name: "Operating Systems",
    students: 42,
    assignments: 4,
    avgGrade: 78.9,
  },
  {
    id: 4,
    code: "CSE 4101",
    name: "Software Engineering",
    students: 31,
    assignments: 1,
    avgGrade: 87.3,
  },
];

// Recent submissions will be fetched from backend
const recentExams = [
  {
    id: 1,
    courseCode: "CSE 2101",
    courseTitle: "Data Structures and Algorithms",
    examType: "Midterm",
    date: "2024-01-15",
    time: "10:00 - 12:00",
    room: "301",
    status: "Scheduled",
  },
  {
    id: 2,
    courseCode: "CSE 2203",
    courseTitle: "Computer Organization",
    examType: "Final",
    date: "2024-01-20",
    time: "14:00 - 17:00",
    room: "302",
    status: "Scheduled",
  },
  {
    id: 3,
    courseCode: "CSE 3107",
    courseTitle: "Operating Systems",
    examType: "Quiz",
    date: "2024-01-18",
    time: "09:00 - 10:00",
    room: "303",
    status: "Scheduled",
  },
];

const quickActions = [
  {
    title: "Assignment",
    icon: "📝",
    route: "/assignments",
    color: "bg-blue-500",
  },
  {
    title: "Exam Management",
    icon: "📋",
    route: "/exams/management",
    color: "bg-indigo-500",
  },
  {
    title: "Upload Marks",
    icon: "📊",
    action: "upload-marks",
    color: "bg-green-500",
  },
  {
    title: "Grade Submissions",
    icon: "📈",
    route: "/faculty/grading",
    color: "bg-purple-500",
  },
  {
    title: "Course Materials",
    icon: "📚",
    route: "/faculty/materials",
    color: "bg-orange-500",
  },
  {
    title: "Office Hours",
    icon: "🕐",
    route: "/faculty/office-hours",
    color: "bg-red-500",
  },
  {
    title: "Course Settings",
    icon: "⚙️",
    route: "/faculty/settings",
    color: "bg-gray-500",
  },
];

// Fetch all user profiles
async function fetchAllUserProfiles() {
  return apiRequest2("/users-api/profiles/");
}

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [showMarksUpload, setShowMarksUpload] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [assignmentsMap, setAssignmentsMap] = useState<Record<string, any>>({});
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all submissions for assignments created by this faculty
        const submissions = await fetchSubmissionsForMyAssignments();
        setRecentSubmissions(submissions);
        // Fetch all user profiles and build a map
        const users = await fetchAllUserProfiles();
        const userMap: Record<string, string> = {};
        users.forEach((user: any) => {
          userMap[user.id] = user.name;
        });
        setUsersMap(userMap);
      } catch (err) {
        setRecentSubmissions([]);
        setUsersMap({});
      }
    }
    fetchData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const handleQuickAction = (action: any) => {
    if (action.action === "upload-marks") {
      setShowMarksUpload(true);
    } else if (action.route) {
      navigate(action.route);
    }
  };

  const handleGradeSubmission = (id: number) => {
    // Handle grading logic
    console.log(`Grading submission ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#25345D]">
                Faculty Dashboard
              </h1>
              <p className="text-[#25345D] text-lg">
                Welcome back, Dr. Sarah Johnson
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-[#25345D] font-semibold">Computer Science</p>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-[#EAB308] text-[#25345D] font-bold px-4 py-2 rounded hover:bg-[#F5C940] transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {facultyStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-[#25345D] mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-[#25345D] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-[#EAB308] hover:shadow-md transition-all"
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <span className="text-sm text-[#25345D] font-medium text-center">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Courses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Current Courses
            </h2>
            <div className="space-y-4">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#25345D]">
                        {course.code}
                      </h3>
                      <p className="text-sm text-gray-600">{course.name}</p>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {course.students} students
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Assignments:</span>
                      <span className="ml-2 font-medium">
                        {course.assignments}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Grade:</span>
                      <span className="ml-2 font-medium">
                        {course.avgGrade}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="text-sm text-[#EAB308] hover:text-[#F5C940] font-medium">
                      View Details
                    </button>
                    <button className="text-sm text-[#EAB308] hover:text-[#F5C940] font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Recent Submissions
            </h2>
            <div className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <div className="text-gray-500">
                  No recent submissions found.
                </div>
              ) : (
                recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-[#25345D]">
                          Student:{" "}
                          {usersMap[submission.student_id] ||
                            submission.student_id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Assignment ID: {submission.assignment_id}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          submission.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {submission.status || "Submitted"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {submission.submission_time
                          ? new Date(
                              submission.submission_time
                            ).toLocaleString()
                          : ""}
                      </span>
                      {submission.status === "Pending" && (
                        <button
                          onClick={() => handleGradeSubmission(submission.id)}
                          className="text-sm bg-[#EAB308] text-[#25345D] px-3 py-1 rounded hover:bg-[#F5C940] transition"
                        >
                          Grade
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Exams Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#25345D]">Recent Exams</h2>
            <button
              onClick={() => navigate("/exams/management")}
              className="text-sm text-[#EAB308] hover:text-[#F5C940] font-medium"
            >
              Manage All Exams →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentExams.map((exam) => (
              <div
                key={exam.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-[#25345D]">
                      {exam.courseCode}
                    </h3>
                    <p className="text-sm text-gray-600">{exam.courseTitle}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      exam.examType === "Midterm"
                        ? "bg-blue-100 text-blue-800"
                        : exam.examType === "Final"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {exam.examType}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>📅 {new Date(exam.date).toLocaleDateString()}</div>
                  <div>⏰ {exam.time}</div>
                  <div>🏠 Room {exam.room}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs text-[#EAB308] hover:text-[#F5C940] font-medium">
                    Edit
                  </button>
                  <button className="text-xs text-[#EAB308] hover:text-[#F5C940] font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#25345D]">
              Upcoming Deadlines
            </h2>
            <button
              onClick={() => navigate("/exams/management")}
              className="text-sm text-[#EAB308] hover:text-[#F5C940] font-medium"
            >
              Manage Exams →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-sm font-medium text-[#25345D]">
                Assignment 2 - CSE 2101
              </p>
              <p className="text-xs text-gray-600">Due: Tomorrow, 11:59 PM</p>
              <p className="text-xs text-gray-500">45 students enrolled</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-sm font-medium text-[#25345D]">
                Project Proposal - CSE 4101
              </p>
              <p className="text-xs text-gray-600">Due: Jan 20, 2024</p>
              <p className="text-xs text-gray-500">31 students enrolled</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm font-medium text-[#25345D]">
                Midterm Exam - CSE 3107
              </p>
              <p className="text-xs text-gray-600">Due: Jan 25, 2024</p>
              <p className="text-xs text-gray-500">42 students enrolled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Upload Modal */}
      {showMarksUpload && (
        <MarksUpload onClose={() => setShowMarksUpload(false)} />
      )}
    </div>
  );
}

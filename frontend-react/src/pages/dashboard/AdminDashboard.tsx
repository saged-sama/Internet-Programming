import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock data for dashboard
const stats = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
  },
  {
    title: "Total Faculty",
    value: "156",
    change: "+3%",
    changeType: "positive",
  },
  {
    title: "Active Courses",
    value: "89",
    change: "+5%",
    changeType: "positive",
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "-8%",
    changeType: "negative",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "course",
    action: "New course added",
    item: "CSE 401 - Advanced Web Development",
    time: "2 hours ago",
    user: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    type: "notice",
    action: "Notice published",
    item: "Academic Calendar Update",
    time: "4 hours ago",
    user: "Admin Team",
  },
  {
    id: 3,
    type: "event",
    action: "Event created",
    item: "Tech Career Fair 2024",
    time: "6 hours ago",
    user: "Career Services",
  },
  {
    id: 4,
    type: "student",
    action: "Student registered",
    item: "Ahmed Hassan - CSE",
    time: "1 day ago",
    user: "System",
  },
  {
    id: 5,
    type: "faculty",
    action: "Faculty profile updated",
    item: "Dr. Michael Chen",
    time: "1 day ago",
    user: "HR Department",
  },
];

const pendingApprovals = [
  {
    id: 1,
    type: "Room Booking",
    title: "Conference Room A - 2pm",
    requester: "Dr. Emily Brown",
    department: "Computer Science",
    date: "2024-01-15",
  },
  {
    id: 2,
    type: "Event",
    title: "Student Workshop",
    requester: "Student Council",
    department: "Student Affairs",
    date: "2024-01-18",
  },
  {
    id: 3,
    type: "Notice",
    title: "Department Meeting Notice",
    requester: "Dr. James Wilson",
    department: "Electrical Engineering",
    date: "2024-01-16",
  },
  {
    id: 4,
    type: "Course",
    title: "New Elective Course",
    requester: "Dr. Lisa Park",
    department: "Mathematics",
    date: "2024-01-20",
  },
];

const quickActions = [
  {
    title: "Add New Course",
    icon: "📚",
    route: "/courses",
    color: "bg-blue-500",
  },
  {
    title: "Manage Schedules",
    icon: "🗓️",
    route: "/scheduling/admin/class-schedule",
    color: "bg-indigo-500",
  },
  {
    title: "Manage Rooms",
    icon: "🏢",
    route: "/scheduling/admin/room-availability",
    color: "bg-cyan-500",
  },
  {
    title: "Booking Approvals",
    icon: "✅",
    route: "/scheduling/admin-approval",
    color: "bg-yellow-500",
  },
  {
    title: "Publish Notice",
    icon: "📢",
    route: "/notices",
    color: "bg-green-500",
  },
  {
    title: "Create Event",
    icon: "📅",
    route: "/events",
    color: "bg-purple-500",
  },
  {
    title: "Manage Users",
    icon: "👥",
    route: "/admin/users",
    color: "bg-orange-500",
  },
  {
    title: "View Reports",
    icon: "📊",
    route: "/admin/reports",
    color: "bg-red-500",
  },
];

const departmentStats = [
  { name: "Computer Science", students: 456, faculty: 23, courses: 34 },
  { name: "Electrical Engineering", students: 389, faculty: 19, courses: 28 },
  { name: "Mechanical Engineering", students: 312, faculty: 16, courses: 25 },
  { name: "Mathematics", students: 234, faculty: 12, courses: 18 },
  { name: "Physics", students: 198, faculty: 10, courses: 15 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  const handleApproval = (id: number, approved: boolean) => {
    // Handle approval logic here
    console.log(`Approval ${approved ? "approved" : "rejected"} for ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#25345D]">
                Admin Dashboard
              </h1>
              <p className="text-[#25345D] text-lg">
                Welcome back, Administrator
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Last login</p>
                <p className="text-[#25345D] font-semibold">Today, 9:30 AM</p>
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
          {stats.map((stat, index) => (
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
                      : "text-red-600"
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
                onClick={() => handleQuickAction(action.route)}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Approvals */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Pending Approvals
            </h2>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#25345D]">
                        {approval.title}
                      </h3>
                      <p className="text-sm text-gray-600">{approval.type}</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Pending
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>
                      <strong>Requester:</strong> {approval.requester}
                    </p>
                    <p>
                      <strong>Department:</strong> {approval.department}
                    </p>
                    <p>
                      <strong>Date:</strong> {approval.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(approval.id, true)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(approval.id, false)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-[#EAB308] pl-4"
                >
                  <p className="text-sm font-medium text-[#25345D]">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{activity.item}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {activity.user}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-[#25345D] mb-4">
            Department Statistics
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-[#25345D]">
                    Department
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Students
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Faculty
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Courses
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-[#25345D]">
                      {dept.name}
                    </td>
                    <td className="py-3 px-4 text-center">{dept.students}</td>
                    <td className="py-3 px-4 text-center">{dept.faculty}</td>
                    <td className="py-3 px-4 text-center">{dept.courses}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-[#EAB308] hover:text-[#F5C940] text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              System Health
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="text-sm font-medium text-green-600">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium text-green-600">
                  Healthy
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Storage Usage</span>
                <span className="text-sm font-medium text-yellow-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium text-blue-600">1,234</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Upcoming Events
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-medium text-[#25345D]">
                  Faculty Meeting
                </p>
                <p className="text-xs text-gray-600">Tomorrow, 10:00 AM</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm font-medium text-[#25345D]">
                  Student Registration Deadline
                </p>
                <p className="text-xs text-gray-600">Jan 20, 2024</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm font-medium text-[#25345D]">
                  System Maintenance
                </p>
                <p className="text-xs text-gray-600">Jan 25, 2024, 2:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { financialApi } from "../../lib/financialApi";

// Types for API responses
interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  degreeLevel?: string;
  semester?: string;
  instructor?: string;
  prerequisites: string[];
  topics: string[];
  objectives: string[];
  outcomes: string[];
}

interface Program {
  id: string;
  title: string;
  level: string;
  description: string;
  creditsRequired: number;
  duration: string;
  concentrations: string[];
  admissionRequirements: string[];
  careerOpportunities: string[];
  curriculum: Record<string, unknown>;
  updatedAt?: string;
  departmentId?: string;
}

interface Fee {
  id: string;
  title: string;
  description?: string;
  type: string;
  amount: number;
  deadline: string;
  semester?: string;
  academic_year?: string;
  is_installment_available: boolean;
  installment_count?: number;
  installment_amount?: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

interface CreateCourseRequest {
  course_code: string;
  course_title: string;
  course_description?: string;
  course_credits?: number;
  degree_level?: string;
  semester?: string;
  instructor?: string;
  prerequisites?: string[];
  topics?: string[];
  objectives?: string[];
  learning_outcomes?: string[];
}

interface CreateFeeRequest {
  title: string;
  description?: string;
  type: string;
  amount: number;
  deadline: string;
  semester?: string;
  academic_year?: string;
  is_installment_available?: boolean;
  installment_count?: number;
  installment_amount?: number;
}

// API functions
const api = {
  async getCourses(): Promise<ApiResponse<Course>> {
    const response = await fetch('http://localhost:8000/api/courses/');
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async getPrograms(): Promise<ApiResponse<Program>> {
    const response = await fetch('http://localhost:8000/api/programs/');
    if (!response.ok) throw new Error('Failed to fetch programs');
    return response.json();
  },

  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    console.log('Sending course data to backend:', courseData);
    
    const response = await fetch('http://localhost:8000/api/courses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Failed to create course';
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      console.error('Course creation failed:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('Course creation response:', result);
    return result;
  },

  async getFees(): Promise<Fee[]> {
    return financialApi.getAllFees();
  },

  async createFee(feeData: CreateFeeRequest): Promise<Fee> {
    return financialApi.createFee(feeData);
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [courseFormData, setCourseFormData] = useState<CreateCourseRequest>({
    course_code: '',
    course_title: '',
    course_description: '',
    course_credits: 3,
    degree_level: '',
    semester: '',
    instructor: '',
    prerequisites: [],
    topics: [],
    objectives: [],
    learning_outcomes: []
  });
  const [feeFormData, setFeeFormData] = useState<CreateFeeRequest>({
    title: '',
    description: '',
    type: 'tuition_fee',
    amount: 0,
    deadline: '',
    semester: '',
    academic_year: '',
    is_installment_available: false,
    installment_count: undefined,
    installment_amount: undefined
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, programsResponse, feesResponse] = await Promise.all([
          api.getCourses(),
          api.getPrograms(),
          api.getFees()
        ]);
        
        setCourses(coursesResponse.data);
        setPrograms(programsResponse.data);
        setFees(feesResponse);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate real statistics from API data
  const stats = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Programs",
      value: programs.length.toString(),
      change: "+3%",
      changeType: "positive" as const,
    },
    {
      title: "Active Fees",
      value: fees.length.toString(),
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Total Fee Amount",
      value: `$${fees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()}`,
      change: "+12%",
      changeType: "positive" as const,
    },
  ];

  // Calculate department statistics from real data
  const departmentStats = programs.reduce((acc, program) => {
    const dept = program.departmentId || 'General';
    if (!acc[dept]) {
      acc[dept] = {
        name: dept,
        programs: 0,
        courses: 0,
        credits: 0
      };
    }
    acc[dept].programs += 1;
    acc[dept].credits += program.creditsRequired;
    return acc;
  }, {} as Record<string, { name: string; programs: number; courses: number; credits: number }>);

  // Add course counts to department stats
  courses.forEach(course => {
    const dept = course.degreeLevel || 'General';
    if (departmentStats[dept]) {
      departmentStats[dept].courses += 1;
    }
  });

  const departmentStatsArray = Object.values(departmentStats);

  // Recent activities from real data (recent courses, programs, and fees)
  const recentActivities = [
    ...courses.slice(0, 2).map((course, index) => ({
      id: `course-${course.id}`,
      type: "course",
      action: "Course available",
      item: `${course.code} - ${course.name}`,
      time: `${index + 1} days ago`,
      user: course.instructor || "System",
    })),
    ...programs.slice(0, 2).map((program, index) => ({
      id: `program-${program.id}`,
      type: "program",
      action: "Program offered",
      item: `${program.title} (${program.level})`,
      time: `${index + 2} days ago`,
      user: "Academic Office",
    })),
    ...fees.slice(0, 2).map((fee, index) => ({
      id: `fee-${fee.id}`,
      type: "fee",
      action: "Fee created",
      item: `${fee.title} - $${fee.amount}`,
      time: `${index + 3} days ago`,
      user: "Financial Office",
    }))
];

const quickActions = [
  {
    title: "Add New Course",
    icon: "📚",
      action: () => setShowCourseModal(true),
    color: "bg-blue-500",
  },
    {
      title: "Manage Programs",
      icon: "🎓",
      action: () => navigate("/degrees"),
      color: "bg-indigo-500",
    },
    {
      title: "Manage Schedules",
      icon: "🗓️",
      action: () => navigate("/scheduling/admin/class-schedule"),
      color: "bg-cyan-500",
    },
    {
      title: "Manage Rooms",
      icon: "🏢",
      action: () => navigate("/scheduling/admin/room-availability"),
      color: "bg-yellow-500",
    },
    {
      title: "Financial Management",
      icon: "💳",
      action: () => navigate("/financials"),
    color: "bg-green-500",
  },
    {
      title: "Booking Approvals",
      icon: "✅",
      action: () => navigate("/scheduling/admin-approval"),
      color: "bg-teal-500",
    },
    {
      title: "Publish Notice",
      icon: "📢",
      action: () => navigate("/notices"),
      color: "bg-pink-500",
    },
  {
    title: "Create Event",
    icon: "📅",
      action: () => navigate("/events"),
    color: "bg-purple-500",
  },
  {
    title: "View Reports",
    icon: "📊",
      action: () => navigate("/admin/reports"),
    color: "bg-red-500",
  },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const handleCourseFormChange = (field: keyof CreateCourseRequest, value: string | number | string[]) => {
    setCourseFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeeFormChange = (field: keyof CreateFeeRequest, value: string | number | boolean) => {
    setFeeFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: 'prerequisites' | 'topics' | 'objectives' | 'learning_outcomes', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setCourseFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseFormData.course_code || !courseFormData.course_title) {
      setError('Course code and title are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null); // Clear any previous errors
      
      console.log('Creating course with data:', courseFormData);
      const newCourse = await api.createCourse(courseFormData);
      console.log('Course created successfully:', newCourse);
      
      // Add to local state to update UI immediately
      setCourses(prev => [...prev, newCourse]);
      
      // Reset form
      setCourseFormData({
        course_code: '',
        course_title: '',
        course_description: '',
        course_credits: 3,
        degree_level: '',
        semester: '',
        instructor: '',
        prerequisites: [],
        topics: [],
        objectives: [],
        learning_outcomes: []
      });
      
      setShowCourseModal(false);
      
      // Show success message temporarily
      alert(`Course "${newCourse.name}" created successfully!`);
      
    } catch (err) {
      console.error('Course creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feeFormData.title || !feeFormData.amount || !feeFormData.deadline) {
      setError('Fee title, amount, and deadline are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Creating fee with data:', feeFormData);
      const newFee = await api.createFee(feeFormData);
      console.log('Fee created successfully:', newFee);
      
      // Add to local state to update UI immediately
      setFees(prev => [...prev, newFee]);
      
      // Reset form
      setFeeFormData({
        title: '',
        description: '',
        type: 'tuition_fee',
        amount: 0,
        deadline: '',
        semester: '',
        academic_year: '',
        is_installment_available: false,
        installment_count: undefined,
        installment_amount: undefined
      });
      
      setShowFeeModal(false);
      
      // Show success message
      alert(`Fee "${newFee.title}" created successfully!`);
      
    } catch (err) {
      console.error('Fee creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create fee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAB308] mx-auto mb-4"></div>
          <p className="text-[#25345D]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !showCourseModal) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#EAB308] text-[#25345D] px-4 py-2 rounded hover:bg-[#F5C940]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-[#25345D] font-semibold">Online</p>
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

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

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
                onClick={action.action}
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
          {/* Recent Courses & Programs */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Recent Courses & Programs
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#25345D]">
                        {activity.item}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">{activity.type}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>
                      <strong>Managed by:</strong> {activity.user}
                    </p>
                    <p>
                      <strong>Added:</strong> {activity.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (activity.type === 'course') navigate('/courses');
                        else if (activity.type === 'program') navigate('/degrees');
                        else if (activity.type === 'fee') navigate('/financials');
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-gray-500 text-center py-8">No recent activities</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[#EAB308] pl-4">
                <p className="text-sm font-medium text-[#25345D]">
                  Courses by Level
                </p>
                <div className="text-xs text-gray-600 mt-1">
                  <p>Undergraduate: {courses.filter(c => c.degreeLevel?.toLowerCase().includes('bachelor')).length}</p>
                  <p>Graduate: {courses.filter(c => c.degreeLevel?.toLowerCase().includes('master') || c.degreeLevel?.toLowerCase().includes('phd')).length}</p>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-medium text-[#25345D]">
                  Programs by Level
                </p>
                <div className="text-xs text-gray-600 mt-1">
                  <p>Bachelor: {programs.filter(p => p.level.toLowerCase().includes('bachelor')).length}</p>
                  <p>Master: {programs.filter(p => p.level.toLowerCase().includes('master')).length}</p>
                  <p>PhD: {programs.filter(p => p.level.toLowerCase().includes('phd')).length}</p>
                </div>
              </div>

              <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-sm font-medium text-[#25345D]">
                  Fee Categories
                </p>
                <div className="text-xs text-gray-600 mt-1">
                  <p>Tuition: {fees.filter(f => f.type === 'tuition_fee').length}</p>
                  <p>Development: {fees.filter(f => f.type === 'development').length}</p>
                  <p>Admission: {fees.filter(f => f.type === 'admission').length}</p>
                  <p>Other: {fees.filter(f => f.type === 'other').length}</p>
                </div>
                  </div>

              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm font-medium text-[#25345D]">
                  Financial Overview
                </p>
                <div className="text-xs text-gray-600 mt-1">
                  <p>Total Fees: {fees.length}</p>
                  <p>Average Amount: ${fees.length > 0 ? (fees.reduce((sum, fee) => sum + fee.amount, 0) / fees.length).toLocaleString() : '0'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department/Category Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-[#25345D] mb-4">
            Academic Statistics
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-[#25345D]">
                    Category
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Programs
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Courses
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Total Credits
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[#25345D]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentStatsArray.length > 0 ? departmentStatsArray.map((dept, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-[#25345D]">
                      {dept.name}
                    </td>
                    <td className="py-3 px-4 text-center">{dept.programs}</td>
                    <td className="py-3 px-4 text-center">{dept.courses}</td>
                    <td className="py-3 px-4 text-center">{dept.credits}</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => navigate('/degrees')}
                        className="text-[#EAB308] hover:text-[#F5C940] text-sm font-medium"
                      >
                        View Programs
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No academic data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Academic System Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Courses API</span>
                <span className="text-sm font-medium text-green-600">
                  Online ({courses.length} courses)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Programs API</span>
                <span className="text-sm font-medium text-green-600">
                  Online ({programs.length} programs)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium text-green-600">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-blue-600">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#25345D] mb-4">
              Quick Management
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/courses')}
                className="w-full text-left border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition"
              >
                <p className="text-sm font-medium text-[#25345D]">
                  Manage Courses
                </p>
                <p className="text-xs text-gray-600">{courses.length} total courses</p>
              </button>
              <button
                onClick={() => navigate('/degrees')}
                className="w-full text-left border-l-4 border-indigo-500 pl-4 py-2 hover:bg-gray-50 transition"
              >
                <p className="text-sm font-medium text-[#25345D]">
                  Manage Programs
                </p>
                <p className="text-xs text-gray-600">{programs.length} total programs</p>
              </button>
              <button
                onClick={() => navigate('/financials')}
                className="w-full text-left border-l-4 border-emerald-500 pl-4 py-2 hover:bg-gray-50 transition"
              >
                <p className="text-sm font-medium text-[#25345D]">
                  Financial Management
                </p>
                <p className="text-xs text-gray-600">{fees.length} active fees • $${fees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()} total</p>
              </button>
              <button
                onClick={() => navigate('/scheduling/admin/class-schedule')}
                className="w-full text-left border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 transition"
              >
                <p className="text-sm font-medium text-[#25345D]">
                  Manage Schedules
                </p>
                <p className="text-xs text-gray-600">Class scheduling system</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#25345D]">Add New Course</h2>
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      value={courseFormData.course_code}
                      onChange={(e) => handleCourseFormChange('course_code', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                      placeholder="e.g., CSE101"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Credits
                    </label>
                    <input
                      type="number"
                      value={courseFormData.course_credits}
                      onChange={(e) => handleCourseFormChange('course_credits', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                      min="1"
                      max="6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={courseFormData.course_title}
                    onChange={(e) => handleCourseFormChange('course_title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    placeholder="e.g., Introduction to Computer Science"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Description
                  </label>
                  <textarea
                    value={courseFormData.course_description}
                    onChange={(e) => handleCourseFormChange('course_description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    rows={3}
                    placeholder="Course description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                     <label className="block text-sm font-medium text-[#25345D] mb-2">
                       Degree Level
                     </label>
                     <select
                       value={courseFormData.degree_level}
                       onChange={(e) => handleCourseFormChange('degree_level', e.target.value)}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                     >
                       <option value="">Select Level</option>
                       <option value="undergraduate">Undergraduate</option>
                       <option value="graduate">Graduate</option>
                       <option value="doctorate">Doctorate</option>
                       <option value="all">All Levels</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-[#25345D] mb-2">
                       Semester
                     </label>
                     <select
                       value={courseFormData.semester}
                       onChange={(e) => handleCourseFormChange('semester', e.target.value)}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                     >
                       <option value="">Select Semester</option>
                       <option value="1st">1st Semester</option>
                       <option value="2nd">2nd Semester</option>
                       <option value="3rd">3rd Semester</option>
                       <option value="4th">4th Semester</option>
                       <option value="5th">5th Semester</option>
                       <option value="6th">6th Semester</option>
                       <option value="7th">7th Semester</option>
                       <option value="8th">8th Semester</option>
                     </select>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={courseFormData.instructor}
                    onChange={(e) => handleCourseFormChange('instructor', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    placeholder="Instructor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Prerequisites (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={courseFormData.prerequisites?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('prerequisites', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    placeholder="e.g., CSE100, MATH101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={courseFormData.topics?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('topics', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    placeholder="e.g., Programming, Data Structures"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Learning Objectives (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={courseFormData.objectives?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('objectives', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    placeholder="e.g., Understand basic concepts, Apply programming skills"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Learning Outcomes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={courseFormData.learning_outcomes?.join(', ')}
                    onChange={(e) => handleArrayFieldChange('learning_outcomes', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    placeholder="e.g., Write efficient code, Solve complex problems"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-[#EAB308] text-[#25345D] font-medium rounded-lg hover:bg-[#F5C940] transition disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Fee Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#25345D]">Create New Fee</h2>
                <button
                  onClick={() => setShowFeeModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateFee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Fee Title *
                    </label>
                    <input
                      type="text"
                      value={feeFormData.title}
                      onChange={(e) => handleFeeFormChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                      placeholder="e.g., Semester Tuition Fee"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Amount ($) *
                    </label>
                    <input
                      type="number"
                      value={feeFormData.amount}
                      onChange={(e) => handleFeeFormChange('amount', parseFloat(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Description
                  </label>
                  <textarea
                    value={feeFormData.description}
                    onChange={(e) => handleFeeFormChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    rows={3}
                    placeholder="Fee description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Fee Type *
                    </label>
                    <select
                      value={feeFormData.type}
                      onChange={(e) => handleFeeFormChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                      required
                    >
                      <option value="tuition_fee">Tuition Fee</option>
                      <option value="development">Development Fee</option>
                      <option value="admission">Admission Fee</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      value={feeFormData.deadline}
                      onChange={(e) => handleFeeFormChange('deadline', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Semester
                    </label>
                    <select
                      value={feeFormData.semester}
                      onChange={(e) => handleFeeFormChange('semester', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                    >
                      <option value="">Select Semester</option>
                      <option value="1st">1st Semester</option>
                      <option value="2nd">2nd Semester</option>
                      <option value="3rd">3rd Semester</option>
                      <option value="4th">4th Semester</option>
                      <option value="5th">5th Semester</option>
                      <option value="6th">6th Semester</option>
                      <option value="7th">7th Semester</option>
                      <option value="8th">8th Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#25345D] mb-2">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={feeFormData.academic_year}
                      onChange={(e) => handleFeeFormChange('academic_year', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                      placeholder="e.g., 2024-2025"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="installment"
                      checked={feeFormData.is_installment_available}
                      onChange={(e) => handleFeeFormChange('is_installment_available', e.target.checked)}
                      className="rounded border-gray-300 focus:ring-[#EAB308]"
                    />
                    <label htmlFor="installment" className="text-sm font-medium text-[#25345D]">
                      Allow installment payments
                    </label>
                  </div>

                  {feeFormData.is_installment_available && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#25345D] mb-2">
                          Number of Installments
                        </label>
                        <input
                          type="number"
                          value={feeFormData.installment_count || ''}
                          onChange={(e) => handleFeeFormChange('installment_count', parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                          min="2"
                          max="12"
                          placeholder="e.g., 3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#25345D] mb-2">
                          Installment Amount
                        </label>
                        <input
                          type="number"
                          value={feeFormData.installment_amount || ''}
                          onChange={(e) => handleFeeFormChange('installment_amount', parseFloat(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                          min="0"
                          step="0.01"
                          placeholder="Leave empty for auto-calculate"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          If empty, will be calculated as total amount ÷ installments
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFeeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-[#EAB308] text-[#25345D] font-medium rounded-lg hover:bg-[#F5C940] transition disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Fee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

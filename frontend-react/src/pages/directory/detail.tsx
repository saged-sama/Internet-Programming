import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';
import { apiRequest2 } from '../../lib/schedulingApi';

// Define types based on backend API responses
type UserResponse = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  image?: string;
  bio?: string;
  address?: string;
  date_of_birth?: string;
};

type FacultyResponse = {
  id: string;
  user_id: string;
  current_role?: string;
  specialization?: string;
  research_interests?: string;
  publications?: string;
  courses_taught?: string;
  office_hours?: string;
  office_location?: string;
  chairman: boolean;
  user: UserResponse;
};

type StudentResponse = {
  id: string;
  user_id: string;
  student_id: string;
  major?: string;
  current_degree?: string;
  admission_date?: string;
  graduation_date?: string;
  year_of_study?: number;
  student_type?: string;
  cgpa?: number;
  extracurricular_activities?: string;
  user: UserResponse;
};

type ProfileType = 'faculty' | 'student';

export default function DirectoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState<ProfileType>('faculty');
  const [profile, setProfile] = useState<FacultyResponse | StudentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'office' | 'courses'>('overview');

  // No mock data - using real API calls

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to find the profile in faculty data
        try {
          const facultyResponse = await apiRequest2(`/staff-api/faculty/${id}`, {
            method: 'GET'
          });
          
          if (facultyResponse) {
            setProfile(facultyResponse as FacultyResponse);
            setProfileType('faculty');
            setLoading(false);
            return;
          }
        } catch (facultyErr) {
          console.error('Error fetching faculty profile:', facultyErr);
        }
        
        // If not found in faculty, try student data
        try {
          const studentResponse = await apiRequest2(`/staff-api/student/${id}`, {
            method: 'GET'
          });
          
          if (studentResponse) {
            setProfile(studentResponse as StudentResponse);
            setProfileType('student');
            setLoading(false);
            return;
          }
        } catch (studentErr) {
          console.error('Error fetching student profile:', studentErr);
        }
        
        // If no profile found in either endpoint
        setError('Profile not found');
        setLoading(false);
      } catch (err) {
        console.error('Error finding profile:', err);
        setError('Error loading profile data');
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13274D]"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The profile you are looking for does not exist.'}</p>
          <Button
            className={`${themeClasses.bgPrimary} text-white hover:bg-[#0c1b36]`}
            onClick={() => navigate('/directory')}
          >
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  // Get user data from profile
  const user = profile.user;
  const isFaculty = profileType === 'faculty';
  const faculty = isFaculty ? profile as FacultyResponse : null;
  const student = !isFaculty ? profile as StudentResponse : null;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#13274D] bg-gray-100 flex items-center justify-center">
            {user.image ? (
              <img
                src={`${user.image.startsWith("http") ? user.image : import.meta.env.VITE_BACKEND_URL+user.image}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl text-gray-400">👤</span>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#13274D] mb-2">{user.name}</h1>
            {isFaculty && faculty?.current_role && (
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {faculty.current_role}
                </span>
              </div>
            )}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
              {!isFaculty && (
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`}>
                  Student
                </span>
              )}
              <span className="text-sm text-gray-500">{user.department}</span>
              {isFaculty && faculty?.chairman && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Chairman
                </span>
              )}
            </div>
            {isFaculty && faculty?.specialization && (
              <div className="flex flex-wrap gap-2 mb-2">
                <p className="text-gray-600">{faculty.specialization}</p>
              </div>
            )}
            {!isFaculty && (
              <div className="flex flex-wrap gap-2 mb-2">
                {student?.current_degree && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    {student.current_degree}
                  </span>
                )}
                {student?.major && (
                  <p className="text-gray-600 hidden">Major: {student.major}</p>
                )}
              </div>
            )}
            {user.email && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            )}
            {user.phone && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {user.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        {/* Bio Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#13274D] border-b pb-2">Biography</h2>
          <p className="text-gray-700 text-base">{user.bio || 'No biography available.'}</p>
        </div>

        {/* Tabs for faculty, direct content for students */}
        {isFaculty ? (
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="bg-gray-100 p-2 rounded-lg mb-4">
              <TabsTrigger 
                value="overview" 
                onClick={() => setActiveTab('overview')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary font-medium text-base px-5 py-2"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="publications" 
                onClick={() => setActiveTab('publications')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary font-medium text-base px-5 py-2"
              >
                Publications
              </TabsTrigger>
              <TabsTrigger 
                value="office" 
                onClick={() => setActiveTab('office')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary font-medium text-base px-5 py-2"
              >
                Office
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                onClick={() => setActiveTab('courses')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary font-medium text-base px-5 py-2"
              >
                Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="space-y-6">
                {faculty?.specialization && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Specialization</h3>
                    <p className="text-base font-normal text-gray-800">{faculty.specialization}</p>
                  </div>
                )}
                {faculty?.research_interests && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Research Interests</h3>
                    <p className="text-base font-normal text-gray-800">{faculty.research_interests}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="publications" className="mt-4">
              {faculty?.publications ? (
                <div className="text-base font-normal text-gray-800" dangerouslySetInnerHTML={{ __html: faculty.publications }} />
              ) : (
                <p className="text-base font-normal text-gray-800">No publications available.</p>
              )}
            </TabsContent>

            <TabsContent value="office" className="mt-4">
              <div className="space-y-6">
                {faculty?.office_location && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Office Location</h3>
                    <p className="text-base font-normal text-gray-800">{faculty.office_location}</p>
                  </div>
                )}
                {faculty?.office_hours && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Office Hours</h3>
                    <p className="text-base font-normal text-gray-800">{faculty.office_hours}</p>
                  </div>
                )}
                {!faculty?.office_location && !faculty?.office_hours && (
                  <p className="text-base font-normal text-gray-800">No office information available.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="mt-4">
              {faculty?.courses_taught ? (
                <div className="text-base font-normal text-gray-800" dangerouslySetInnerHTML={{ __html: faculty.courses_taught }} />
              ) : (
                <p className="text-base font-normal text-gray-800">No courses information available.</p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // For students, just show the overview directly without tabs
          <div className="mt-6 space-y-6">
            {student?.current_degree && (
              <div>
                <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Current Degree</h3>
                <p className="text-base font-normal text-gray-800">{student.current_degree}</p>
              </div>
            )}
            {student?.student_id && (
              <div>
                <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Student ID</h3>
                <p className="text-base font-normal text-gray-800">{student.student_id}</p>
              </div>
            )}
            {student?.year_of_study && (
              <div>
                <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Year of Study</h3>
                <p className="text-base font-normal text-gray-800">Year {student.year_of_study}</p>
              </div>
            )}
            {student?.extracurricular_activities && (
              <div>
                <h3 className="text-lg font-semibold text-[#13274D] mb-2 border-b border-gray-200 pb-1">Extracurricular Activities</h3>
                <p className="text-base font-normal text-gray-800">{student.extracurricular_activities}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';

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
  student_id?: string;
  major?: string;
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

  // Mock data for faculty
  const mockFacultyData: FacultyResponse[] = [
    {
      id: "1",
      user_id: "101",
      specialization: "Artificial Intelligence",
      research_interests: "Machine Learning, Deep Learning, Computer Vision",
      publications: "<p>1. Smith, J. (2023). 'Advances in Deep Learning'. Journal of AI, 45(2), 112-128.</p><p>2. Smith, J., & Johnson, A. (2022). 'Neural Networks for Image Recognition'. IEEE Transactions, 18(3), 45-60.</p>",
      courses_taught: "<p>CSE 401: Introduction to AI</p><p>CSE 505: Advanced Machine Learning</p><p>CSE 610: Neural Networks</p>",
      office_hours: "Monday and Wednesday: 2:00 PM - 4:00 PM",
      office_location: "Science Building, Room 305",
      chairman: true,
      user: {
        id: "101",
        name: "Dr. John Smith",
        role: "faculty",
        department: "Department of Computer Science and Engineering",
        email: "john.smith@university.edu",
        phone: "+1-555-123-4567",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        bio: "Professor with 15 years of experience in AI and Machine Learning. Dr. Smith has led numerous research projects in deep learning applications and has mentored over 20 PhD students throughout his career. His work has been published in top-tier journals and conferences in the field of artificial intelligence."
      }
    },
    {
      id: "2",
      user_id: "102",
      specialization: "Database Systems",
      research_interests: "Data Mining, Big Data Analytics, Database Optimization",
      publications: "<p>1. Johnson, E. (2023). 'Optimizing NoSQL Databases'. Journal of Database Systems, 32(1), 78-92.</p><p>2. Johnson, E., & Lee, R. (2022). 'Big Data Processing Frameworks'. ACM Transactions, 14(2), 34-49.</p>",
      courses_taught: "<p>CSE 310: Database Management Systems</p><p>CSE 510: Advanced Database Concepts</p><p>CSE 615: Big Data Analytics</p>",
      office_hours: "Tuesday and Thursday: 1:00 PM - 3:00 PM",
      office_location: "Science Building, Room 310",
      chairman: false,
      user: {
        id: "102",
        name: "Dr. Emily Johnson",
        role: "faculty",
        department: "Department of Computer Science and Engineering",
        email: "emily.johnson@university.edu",
        phone: "+1-555-234-5678",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        bio: "Associate Professor specializing in database systems and data mining. Dr. Johnson has worked extensively with industry partners to develop efficient database solutions for big data problems. Her research focuses on optimizing query performance in distributed database systems."
      }
    },
    {
      id: "3",
      user_id: "103",
      specialization: "Cybersecurity",
      research_interests: "Network Security, Cryptography, Ethical Hacking",
      publications: "<p>1. Brown, M. (2023). 'Advanced Encryption Techniques'. Journal of Cybersecurity, 28(3), 145-160.</p><p>2. Brown, M., & Davis, S. (2022). 'Preventing Network Intrusions'. IEEE Security, 20(4), 67-82.</p>",
      courses_taught: "<p>CSE 320: Network Security</p><p>CSE 520: Cryptography</p><p>CSE 620: Ethical Hacking</p>",
      office_hours: "Monday and Friday: 10:00 AM - 12:00 PM",
      office_location: "Science Building, Room 315",
      chairman: false,
      user: {
        id: "103",
        name: "Dr. Michael Brown",
        role: "faculty",
        department: "Department of Computer Science and Engineering",
        email: "michael.brown@university.edu",
        phone: "+1-555-345-6789",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        bio: "Assistant Professor focusing on cybersecurity and network systems. Dr. Brown has a background in both academia and industry, having worked as a security consultant for major tech companies. He leads the university's Cybersecurity Lab and organizes annual capture-the-flag competitions."
      }
    },
    {
      id: "4",
      user_id: "104",
      specialization: "Software Engineering",
      research_interests: "Agile Development, DevOps, Software Testing",
      publications: "<p>1. Wilson, S. (2023). 'Agile Practices in Large Organizations'. Journal of Software Engineering, 40(2), 112-127.</p><p>2. Wilson, S., & Taylor, M. (2022). 'Continuous Integration Strategies'. ACM Software, 16(3), 56-71.</p>",
      courses_taught: "<p>CSE 330: Software Engineering</p><p>CSE 530: Agile Development</p><p>CSE 630: DevOps Practices</p>",
      office_hours: "Wednesday and Friday: 3:00 PM - 5:00 PM",
      office_location: "Science Building, Room 320",
      chairman: false,
      user: {
        id: "104",
        name: "Dr. Sarah Wilson",
        role: "faculty",
        department: "Department of Computer Science and Engineering",
        email: "sarah.wilson@university.edu",
        phone: "+1-555-456-7890",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        bio: "Professor with expertise in software engineering and agile methodologies. Dr. Wilson has authored three textbooks on software development practices and regularly consults with technology startups on implementing effective development workflows."
      }
    },
    {
      id: "5",
      user_id: "105",
      specialization: "Computer Graphics",
      research_interests: "Virtual Reality, Augmented Reality, 3D Modeling",
      publications: "<p>1. Lee, R. (2023). 'Real-time Rendering Techniques'. Journal of Computer Graphics, 35(4), 189-204.</p><p>2. Lee, R., & Johnson, E. (2022). 'VR Applications in Education'. IEEE Graphics, 19(2), 45-60.</p>",
      courses_taught: "<p>CSE 340: Computer Graphics</p><p>CSE 540: Virtual Reality</p><p>CSE 640: Advanced 3D Modeling</p>",
      office_hours: "Tuesday and Thursday: 10:00 AM - 12:00 PM",
      office_location: "Science Building, Room 325",
      chairman: false,
      user: {
        id: "105",
        name: "Dr. Robert Lee",
        role: "faculty",
        department: "Department of Computer Science and Engineering",
        email: "robert.lee@university.edu",
        phone: "+1-555-567-8901",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        bio: "Associate Professor specializing in computer graphics and virtual reality. Dr. Lee directs the university's Interactive Media Lab and has developed several VR applications for educational purposes. His research explores the intersection of computer graphics and human-computer interaction."
      }
    }
  ];

  // Mock data for students
  const mockStudentData: StudentResponse[] = [
    {
      id: "6",
      user_id: "106",
      student_id: "ST12345",
      major: "BSc",
      admission_date: "2020-09-01",
      graduation_date: "2024-06-15",
      year_of_study: 4,
      student_type: "Regular",
      cgpa: 3.8,
      extracurricular_activities: "Web Development Club President, Hackathon Participant",
      user: {
        id: "106",
        name: "Alex Thompson",
        role: "student",
        department: "Department of Computer Science and Engineering",
        email: "alex.thompson@university.edu",
        phone: "+1-555-678-9012",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        bio: "Senior student passionate about web development and UI/UX design. Alex has participated in multiple hackathons and led the development of the university's student portal website. Currently working on a thesis project focused on responsive web design patterns."
      }
    },
    {
      id: "7",
      user_id: "107",
      student_id: "ST23456",
      major: "MSc",
      admission_date: "2021-09-01",
      graduation_date: "2025-06-15",
      year_of_study: 3,
      student_type: "Regular",
      cgpa: 3.9,
      extracurricular_activities: "Data Science Club, Research Assistant",
      user: {
        id: "107",
        name: "Jessica Martinez",
        role: "student",
        department: "Department of Computer Science and Engineering",
        email: "jessica.martinez@university.edu",
        phone: "+1-555-789-0123",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        bio: "Junior student interested in data science and machine learning applications. Jessica works as a research assistant in the university's Data Analytics Lab and has co-authored a conference paper on predictive modeling for healthcare outcomes."
      }
    },
    {
      id: "8",
      user_id: "108",
      student_id: "ST34567",
      major: "BSc",
      admission_date: "2022-09-01",
      graduation_date: "2026-06-15",
      year_of_study: 2,
      student_type: "Regular",
      cgpa: 3.7,
      extracurricular_activities: "Cybersecurity Club, CTF Competition Participant",
      user: {
        id: "108",
        name: "David Kim",
        role: "student",
        department: "Department of Computer Science and Engineering",
        email: "david.kim@university.edu",
        phone: "+1-555-890-1234",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
        bio: "Sophomore student focusing on cybersecurity and ethical hacking. David has participated in several Capture The Flag competitions and is currently interning with the university's IT security team to help identify potential vulnerabilities in campus systems."
      }
    },
    {
      id: "9",
      user_id: "109",
      student_id: "ST45678",
      major: "PhD",
      admission_date: "2020-09-01",
      graduation_date: "2024-06-15",
      year_of_study: 4,
      student_type: "Regular",
      cgpa: 4.0,
      extracurricular_activities: "Robotics Team Lead, AI Research Assistant",
      user: {
        id: "109",
        name: "Olivia Chen",
        role: "student",
        department: "Department of Computer Science and Engineering",
        email: "olivia.chen@university.edu",
        phone: "+1-555-901-2345",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        bio: "Senior student specializing in artificial intelligence and robotics. Olivia leads the university's robotics team that recently won first place in a national competition. Her research focuses on reinforcement learning algorithms for autonomous navigation systems."
      }
    },
    {
      id: "10",
      user_id: "110",
      student_id: "ST56789",
      major: "MSc",
      admission_date: "2021-09-01",
      graduation_date: "2025-06-15",
      year_of_study: 3,
      student_type: "Transfer",
      cgpa: 3.6,
      extracurricular_activities: "App Development Club, Open Source Contributor",
      user: {
        id: "110",
        name: "Ethan Patel",
        role: "student",
        department: "Department of Computer Science and Engineering",
        email: "ethan.patel@university.edu",
        phone: "+1-555-012-3456",
        image: "https://randomuser.me/api/portraits/men/6.jpg",
        bio: "Junior student interested in software development and mobile applications. Ethan transferred from another university and has quickly become an active contributor to open-source projects. He's currently developing a mobile app for campus navigation as part of his coursework."
      }
    }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to find the profile in mock faculty data
        const facultyProfile = mockFacultyData.find(faculty => faculty.id === id);
        if (facultyProfile) {
          setProfile(facultyProfile);
          setProfileType('faculty');
          setLoading(false);
          return;
        }
        
        // Try to find the profile in mock student data
        const studentProfile = mockStudentData.find(student => student.id === id);
        if (studentProfile) {
          setProfile(studentProfile);
          setProfileType('student');
          setLoading(false);
          return;
        }
        
        // If no profile found
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
        <div className="bg-white p-6 rounded-lg shadow-sm">
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
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#13274D] bg-gray-100 flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl text-gray-400">👤</span>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#13274D] mb-1">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isFaculty
                    ? `${themeClasses.bgPrimary} text-white`
                    : `${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`
                }`}
              >
                {isFaculty ? 'Faculty' : 'Student'}
              </span>
              <span className="text-sm text-gray-500">{user.department}</span>
              {isFaculty && faculty?.chairman && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Chairman
                </span>
              )}
            </div>
            {isFaculty && faculty?.specialization && (
              <p className="text-gray-600">{faculty.specialization}</p>
            )}
            {!isFaculty && student?.major && (
              <p className="text-gray-600">Major: {student.major}</p>
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
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Bio Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Biography</h2>
          <p className="text-gray-700 text-base">{user.bio || 'No biography available.'}</p>
        </div>

        {/* Tabs for faculty, direct content for students */}
        {isFaculty ? (
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger 
                value="overview" 
                onClick={() => setActiveTab('overview')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="publications" 
                onClick={() => setActiveTab('publications')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary"
              >
                Publications
              </TabsTrigger>
              <TabsTrigger 
                value="office" 
                onClick={() => setActiveTab('office')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary"
              >
                Office
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                onClick={() => setActiveTab('courses')}
                className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary"
              >
                Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="space-y-6">
                {faculty?.specialization && (
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Specialization</h3>
                    <p className="text-lg">{faculty.specialization}</p>
                  </div>
                )}
                {faculty?.research_interests && (
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Research Interests</h3>
                    <p className="text-lg">{faculty.research_interests}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="publications" className="mt-4">
              {faculty?.publications ? (
                <div className="text-lg" dangerouslySetInnerHTML={{ __html: faculty.publications }} />
              ) : (
                <p className="text-lg">No publications available.</p>
              )}
            </TabsContent>

            <TabsContent value="office" className="mt-4">
              <div className="space-y-6">
                {faculty?.office_location && (
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Office Location</h3>
                    <p className="text-lg">{faculty.office_location}</p>
                  </div>
                )}
                {faculty?.office_hours && (
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Office Hours</h3>
                    <p className="text-lg">{faculty.office_hours}</p>
                  </div>
                )}
                {!faculty?.office_location && !faculty?.office_hours && (
                  <p className="text-lg">No office information available.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="mt-4">
              {faculty?.courses_taught ? (
                <div className="text-lg" dangerouslySetInnerHTML={{ __html: faculty.courses_taught }} />
              ) : (
                <p className="text-lg">No courses information available.</p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // For students, just show the overview directly without tabs
          <div className="mt-6 space-y-6">
            {student?.major && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Major</h3>
                <p className="text-lg">{student.major}</p>
              </div>
            )}
            {student?.student_id && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Student ID</h3>
                <p className="text-lg">{student.student_id}</p>
              </div>
            )}
            {student?.year_of_study && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Year of Study</h3>
                <p className="text-lg">Year {student.year_of_study}</p>
              </div>
            )}
            {student?.admission_date && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Admission Date</h3>
                <p className="text-lg">{new Date(student.admission_date).toLocaleDateString()}</p>
              </div>
            )}
            {student?.graduation_date && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Expected Graduation</h3>
                <p className="text-lg">{new Date(student.graduation_date).toLocaleDateString()}</p>
              </div>
            )}
            {student?.extracurricular_activities && (
              <div>
                <h3 className="text-base font-medium text-gray-700">Extracurricular Activities</h3>
                <p className="text-lg">{student.extracurricular_activities}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

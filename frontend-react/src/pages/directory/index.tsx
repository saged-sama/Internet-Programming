import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';
import DirectoryCard from '../../components/directory/DirectoryCard';

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

type PersonType = 'Faculty' | 'Student';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PersonType | 'Faculty'>('Faculty');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [facultyList, setFacultyList] = useState<FacultyResponse[]>([]);
  const [studentList, setStudentList] = useState<StudentResponse[]>([]);
  const [chairman, setChairman] = useState<FacultyResponse | null>(null);

  const personTypes: PersonType[] = ['Faculty', 'Student'];

  // Mock data for faculty
  const mockFacultyData: FacultyResponse[] = [
    {
      id: "1",
      user_id: "101",
      specialization: "Artificial Intelligence",
      research_interests: "Machine Learning, Deep Learning, Computer Vision",
      publications: "<p>1. Smith, J. (2023). 'Advances in Deep Learning'. Journal of AI, 45(2), 112-128.</p>",
      courses_taught: "<p>CSE 401: Introduction to AI</p><p>CSE 505: Advanced Machine Learning</p>",
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
        bio: "Professor with 15 years of experience in AI and Machine Learning."
      }
    },
    {
      id: "2",
      user_id: "102",
      specialization: "Database Systems",
      research_interests: "Data Mining, Big Data Analytics, Database Optimization",
      publications: "<p>1. Johnson, E. (2023). 'Optimizing NoSQL Databases'. Journal of Database Systems, 32(1), 78-92.</p>",
      courses_taught: "<p>CSE 310: Database Management Systems</p><p>CSE 510: Advanced Database Concepts</p>",
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
        bio: "Associate Professor specializing in database systems and data mining."
      }
    },
    {
      id: "3",
      user_id: "103",
      specialization: "Cybersecurity",
      research_interests: "Network Security, Cryptography, Ethical Hacking",
      publications: "<p>1. Brown, M. (2023). 'Advanced Encryption Techniques'. Journal of Cybersecurity, 28(3), 145-160.</p>",
      courses_taught: "<p>CSE 320: Network Security</p><p>CSE 520: Cryptography</p>",
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
        bio: "Assistant Professor focusing on cybersecurity and network systems."
      }
    },
    {
      id: "4",
      user_id: "104",
      specialization: "Software Engineering",
      research_interests: "Agile Development, DevOps, Software Testing",
      publications: "<p>1. Wilson, S. (2023). 'Agile Practices in Large Organizations'. Journal of Software Engineering, 40(2), 112-127.</p>",
      courses_taught: "<p>CSE 330: Software Engineering</p><p>CSE 530: Agile Development</p>",
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
        bio: "Professor with expertise in software engineering and agile methodologies."
      }
    },
    {
      id: "5",
      user_id: "105",
      specialization: "Computer Graphics",
      research_interests: "Virtual Reality, Augmented Reality, 3D Modeling",
      publications: "<p>1. Lee, R. (2023). 'Real-time Rendering Techniques'. Journal of Computer Graphics, 35(4), 189-204.</p>",
      courses_taught: "<p>CSE 340: Computer Graphics</p><p>CSE 540: Virtual Reality</p>",
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
        bio: "Associate Professor specializing in computer graphics and virtual reality."
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
        bio: "Senior student passionate about web development and UI/UX design."
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
        bio: "Junior student interested in data science and machine learning applications."
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
        bio: "Sophomore student focusing on cybersecurity and ethical hacking."
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
        bio: "Senior student specializing in artificial intelligence and robotics."
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
        bio: "Junior student interested in software development and mobile applications."
      }
    }
  ];

  useEffect(() => {
    // Use mock data instead of API calls
    setLoading(true);
    setError(null);
    
    try {
      // Find chairman from mock data
      const chairmanData = mockFacultyData.find(faculty => faculty.chairman);
      if (chairmanData) {
        setChairman(chairmanData);
        // Remove chairman from regular faculty list
        setFacultyList(mockFacultyData.filter(faculty => !faculty.chairman));
      } else {
        setFacultyList(mockFacultyData);
      }

      // Set student list from mock data
      setStudentList(mockStudentData);
      setLoading(false);
    } catch (err) {
      console.error('Error setting mock data:', err);
      setError('Failed to load directory data. Please try again later.');
      setLoading(false);
    }
  }, []);

  // Filter function for search
  const filterItems = (items: any[], query: string) => {
    if (!query) return items;
    
    return items.filter(item => {
      const user = item.user;
      const searchableText = [
        user.name,
        user.email,
        user.department,
        user.bio,
        // Faculty specific fields
        'specialization' in item ? item.specialization : '',
        'research_interests' in item ? item.research_interests : '',
        'courses_taught' in item ? item.courses_taught : '',
        // Student specific fields
        'student_id' in item ? item.student_id : '',
        'major' in item ? item.major : '',
        'student_type' in item ? item.student_type : '',
        'extracurricular_activities' in item ? item.extracurricular_activities : ''
      ].filter(Boolean).join(' ').toLowerCase();
      
      return searchableText.includes(query.toLowerCase());
    });
  };

  // Get the appropriate list based on selected type
  const getFilteredItems = () => {
    if (selectedType === 'Faculty') {
      return filterItems(facultyList, searchQuery);
    } else {
      return filterItems(studentList, searchQuery);
    }
  };

  const filteredItems = getFilteredItems();

  return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>University Directory</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find faculty members and students in our university.
            </p>
          </div>

          {/* Chairman Highlight Section */}
          {chairman && (
            <div className="mb-12">
              <Link to={`/directory/${chairman.id}`} className="block hover:opacity-95 transition-opacity">
                <div className={`${themeClasses.bgPrimary} rounded-xl p-6 shadow-xl border-l-4 ${themeClasses.borderAccentYellow}`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className={`${themeClasses.bgAccentYellow} rounded-full p-2 mr-3`}>
                      <span className="text-2xl">👑</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">Department Chairman</h2>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                      <div className={`w-20 h-20 rounded-full bg-white/20 border-3 ${themeClasses.borderAccentYellow} overflow-hidden mb-4 md:mb-0 md:mr-6 flex items-center justify-center shadow-lg`}>
                        {chairman.user.image ? (
                          <img 
                            src={chairman.user.image} 
                            alt={chairman.user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl text-white">👤</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{chairman.user.name}</h3>
                        <p className={`${themeClasses.textAccentYellow} font-medium mb-2`}>{chairman.specialization}</p>
                        <p className="text-white/80 text-sm mb-3">{chairman.user.department}</p>
                        
                        <div className="flex flex-col md:flex-row gap-2 text-sm text-white/90">
                          {chairman.user.email && (
                            <div className="flex items-center justify-center md:justify-start gap-1">
                              <span>📧</span>
                              <a href={`mailto:${chairman.user.email}`} className="hover:text-[#ECB31D] underline transition-colors" onClick={(e) => e.stopPropagation()}>
                                {chairman.user.email}
                              </a>
                            </div>
                          )}
                          {chairman.office_location && (
                            <div className="flex items-center justify-center md:justify-start gap-1">
                              <span>🏢</span>
                              <span>{chairman.office_location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className={`inline-block ${themeClasses.bgAccentYellow} text-[#13274D] px-4 py-2 rounded-lg shadow-sm`}>
                        <p className="text-sm font-medium italic">
                          "Leading our department towards excellence in education and research"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13274D]"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-center">
              {error}
              <Button 
                onClick={() => window.location.reload()} 
                className="ml-4 bg-red-600 hover:bg-red-700 text-white"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Search and Filters */}
          {!loading && !error && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-t-4 border-[#13274D]">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-2/3">
                  <input
                    type="text"
                    placeholder="Search by name, email, or expertise..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="w-full md:w-1/3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="type" className="text-sm font-medium text-[#13274D] whitespace-nowrap">
                      Filter by Type:
                    </label>
                    <select
                      id="type"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as PersonType)}
                    >
                      {personTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Directory Results */}
          {!loading && !error && filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <DirectoryCard 
                  key={item.id} 
                  item={item} 
                  type={selectedType} 
                />
              ))}
            </div>
          ) : !loading && !error ? (
            <div className="text-center py-12">
              <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={`mt-2 text-lg font-medium ${themeClasses.textPrimary}`}>No results found</h3>
              <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
              <div className="mt-6">
                <Button 
                  onClick={() => {setSearchQuery('');}} 
                  className={`${themeClasses.bgPrimary} hover:${themeClasses.bgPrimaryLight} text-white`}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
  
  );
}

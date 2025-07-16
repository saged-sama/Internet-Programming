import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';
import { apiRequest2 } from '../../lib/schedulingApi';
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
  student_id?: string;
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

  useEffect(() => {
    // Fetch data from the backend API
    setLoading(true);
    setError(null);
    
    const fetchData = async () => {
      try {
        // Fetch faculty data
        const facultyData: FacultyResponse[] = await apiRequest2('/staff-api/faculty', { method: 'GET' });
        
        // Find chairman and separate from regular faculty
        const chairmanData = facultyData.find(faculty => faculty.chairman);
        if (chairmanData) {
          setChairman(chairmanData);
          // Remove chairman from regular faculty list
          setFacultyList(facultyData.filter(faculty => !faculty.chairman));
        } else {
          setFacultyList(facultyData);
        }

        // Fetch student data
        const studentData: StudentResponse[] = await apiRequest2('/staff-api/student', { method: 'GET' });
        setStudentList(studentData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading directory data:', err);
        setError('Failed to load directory data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
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

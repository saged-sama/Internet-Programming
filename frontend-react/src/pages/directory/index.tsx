import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import themeClasses, { themeValues } from '../../lib/theme-utils';

type PersonRole = 'Faculty' | 'Staff' | 'Student';
type Department = 'Computer Science' | 'Engineering' | 'Business' | 'Arts' | 'Science' | 'Medicine';

interface Person {
  id: number;
  name: string;
  role: PersonRole;
  department: Department;
  title?: string;
  email: string;
  phone?: string;
  expertise?: string[];
  image: string;
  officeHours?: string;
  officeLocation?: string;
}

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<PersonRole | 'All'>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'All'>('All');
  
  // Mock data - in a real application, this would come from an API
  const people: Person[] = [
    {
      id: 1,
      name: "Dr. Ahmed Khan",
      role: "Faculty",
      department: "Computer Science",
      title: "Professor",
      email: "ahmed.khan@university.edu",
      phone: "+880 1234 567890",
      expertise: ["Artificial Intelligence", "Machine Learning", "Data Science"],
      image: "https://placehold.co/200x200?text=Dr.+Ahmed",
      officeHours: "Monday, Wednesday: 2:00 PM - 4:00 PM",
      officeLocation: "CS Building, Room 301"
    },
    {
      id: 2,
      name: "Dr. Sarah Rahman",
      role: "Faculty",
      department: "Engineering",
      title: "Associate Professor",
      email: "sarah.rahman@university.edu",
      phone: "+880 1234 567891",
      expertise: ["Robotics", "Control Systems", "Automation"],
      image: "https://placehold.co/200x200?text=Dr.+Sarah",
      officeHours: "Tuesday, Thursday: 10:00 AM - 12:00 PM",
      officeLocation: "Engineering Building, Room 205"
    },
    {
      id: 3,
      name: "Dr. Karim Hossain",
      role: "Faculty",
      department: "Business",
      title: "Assistant Professor",
      email: "karim.hossain@university.edu",
      phone: "+880 1234 567892",
      expertise: ["Finance", "Economics", "Business Analytics"],
      image: "https://placehold.co/200x200?text=Dr.+Karim",
      officeHours: "Wednesday, Friday: 1:00 PM - 3:00 PM",
      officeLocation: "Business Building, Room 410"
    },
    {
      id: 4,
      name: "Fatima Begum",
      role: "Staff",
      department: "Computer Science",
      title: "Administrative Assistant",
      email: "fatima.begum@university.edu",
      phone: "+880 1234 567893",
      image: "https://placehold.co/200x200?text=Fatima",
      officeLocation: "CS Building, Room 100"
    },
    {
      id: 5,
      name: "Mohammad Ali",
      role: "Staff",
      department: "Engineering",
      title: "Lab Technician",
      email: "mohammad.ali@university.edu",
      phone: "+880 1234 567894",
      image: "https://placehold.co/200x200?text=Mohammad",
      officeLocation: "Engineering Building, Room 150"
    },
    {
      id: 6,
      name: "Nusrat Jahan",
      role: "Student",
      department: "Computer Science",
      email: "nusrat.jahan@student.university.edu",
      image: "https://placehold.co/200x200?text=Nusrat",
      expertise: ["Web Development", "Mobile Apps"]
    },
    {
      id: 7,
      name: "Rafiq Islam",
      role: "Student",
      department: "Engineering",
      email: "rafiq.islam@student.university.edu",
      image: "https://placehold.co/200x200?text=Rafiq",
      expertise: ["Mechanical Design", "CAD"]
    },
    {
      id: 8,
      name: "Dr. Aisha Chowdhury",
      role: "Faculty",
      department: "Science",
      title: "Professor",
      email: "aisha.chowdhury@university.edu",
      phone: "+880 1234 567895",
      expertise: ["Physics", "Quantum Mechanics", "Theoretical Physics"],
      image: "https://placehold.co/200x200?text=Dr.+Aisha",
      officeHours: "Monday, Wednesday: 11:00 AM - 1:00 PM",
      officeLocation: "Science Building, Room 220"
    },
    {
      id: 9,
      name: "Dr. Rashid Ahmed",
      role: "Faculty",
      department: "Medicine",
      title: "Professor",
      email: "rashid.ahmed@university.edu",
      phone: "+880 1234 567896",
      expertise: ["Cardiology", "Internal Medicine", "Medical Research"],
      image: "https://placehold.co/200x200?text=Dr.+Rashid",
      officeHours: "Tuesday, Thursday: 9:00 AM - 11:00 AM",
      officeLocation: "Medical Building, Room 305"
    },
    {
      id: 10,
      name: "Sadia Khanam",
      role: "Student",
      department: "Arts",
      email: "sadia.khanam@student.university.edu",
      image: "https://placehold.co/200x200?text=Sadia",
      expertise: ["Graphic Design", "Digital Art"]
    },
    {
      id: 11,
      name: "Imran Hossain",
      role: "Student",
      department: "Business",
      email: "imran.hossain@student.university.edu",
      image: "https://placehold.co/200x200?text=Imran",
      expertise: ["Marketing", "Entrepreneurship"]
    },
    {
      id: 12,
      name: "Nasreen Akter",
      role: "Staff",
      department: "Arts",
      title: "Program Coordinator",
      email: "nasreen.akter@university.edu",
      phone: "+880 1234 567897",
      image: "https://placehold.co/200x200?text=Nasreen",
      officeLocation: "Arts Building, Room 120"
    }
  ];

  const roles: (PersonRole | 'All')[] = ['All', 'Faculty', 'Staff', 'Student'];
  const departments: (Department | 'All')[] = ['All', 'Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Medicine'];

  const filteredPeople = people.filter(person => {
    const matchesRole = selectedRole === 'All' || person.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'All' || person.department === selectedDepartment;
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (person.expertise && person.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesRole && matchesDepartment && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#13274D] mb-4">University Directory</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find faculty members, staff, and students across different departments.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-t-4 border-[#13274D]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[#13274D] mb-1">
                  Filter by Role
                </label>
                <select
                  id="role"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as PersonRole | 'All')}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-[#13274D] mb-1">
                  Filter by Department
                </label>
                <select
                  id="department"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value as Department | 'All')}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Directory Results */}
          {filteredPeople.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeople.map(person => (
                <Link 
                  key={person.id} 
                  to={`/directory/${person.id}`} 
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow hover:border-[${themeValues.colors.accentYellow}]`}
                >
                  <div className="flex items-center p-4">
                    <img 
                      src={person.image} 
                      alt={person.name} 
                      className={`w-16 h-16 rounded-full object-cover mr-4 border-2 ${themeClasses.borderAccentYellow}`} 
                    />
                    <div>
                      <h3 className={`text-lg font-semibold ${themeClasses.textPrimary}`}>{person.name}</h3>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          person.role === 'Faculty' ? `${themeClasses.bgPrimary} text-white` :
                          person.role === 'Staff' ? `${themeClasses.bgPrimaryLight} text-white` :
                          `${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`
                        }`}>
                          {person.role}
                        </span>
                        <span className="text-sm text-gray-500">{person.department}</span>
                      </div>
                      {person.title && (
                        <p className="text-sm text-gray-600">{person.title}</p>
                      )}
                      {person.expertise && person.expertise.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {person.expertise.slice(0, 2).map((exp, i) => (
                            <span 
                              key={i} 
                              className={`inline-flex items-center rounded-full bg-[${themeValues.colors.accentYellowLight}] bg-opacity-20 px-2 py-0.5 text-xs ${themeClasses.textPrimary}`}
                            >
                              {exp}
                            </span>
                          ))}
                          {person.expertise.length > 2 && (
                            <span className={`inline-flex items-center rounded-full bg-[${themeValues.colors.accentYellowLight}] bg-opacity-20 px-2 py-0.5 text-xs ${themeClasses.textPrimary}`}>
                              +{person.expertise.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={`mt-2 text-lg font-medium ${themeClasses.textPrimary}`}>No people found</h3>
              <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
              <div className="mt-6">
                <Button 
                  onClick={() => {setSelectedRole('All'); setSelectedDepartment('All'); setSearchQuery('');}} 
                  className={`${themeClasses.bgPrimary} hover:${themeClasses.bgPrimaryLight} text-white`}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

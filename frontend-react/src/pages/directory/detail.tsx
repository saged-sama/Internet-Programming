import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';

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
  bio?: string;
  education?: string[];
  publications?: string[];
}

export default function DirectoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'schedule'>('overview');

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate with mock data
    const mockPeople: Person[] = [
      {
        id: 1,
        name: "Dr. Ahmed Khan",
        role: "Faculty",
        department: "Computer Science",
        title: "Professor",
        email: "ahmed.khan@university.edu",
        phone: "+880 1234 567890",
        expertise: ["Artificial Intelligence", "Machine Learning", "Data Science"],
        image: "https://placehold.co/400x400?text=Dr.+Ahmed",
        officeHours: "Monday, Wednesday: 2:00 PM - 4:00 PM",
        officeLocation: "CS Building, Room 301",
        bio: "Dr. Ahmed Khan is a Professor of Computer Science with over 15 years of experience in AI research. He leads the university's Machine Learning Lab and has published extensively in top-tier conferences and journals.",
        education: [
          "Ph.D. in Computer Science, MIT, 2008",
          "M.S. in Computer Science, Stanford University, 2004",
          "B.S. in Computer Engineering, Bangladesh University of Engineering and Technology, 2002"
        ],
        publications: [
          "Khan, A., et al. (2023). 'Advances in Deep Learning for Natural Language Processing.' IEEE Transactions on AI.",
          "Khan, A., Rahman, S. (2022). 'Neural Networks for Climate Prediction.' Nature Machine Intelligence.",
          "Khan, A., et al. (2021). 'Reinforcement Learning in Healthcare.' Journal of AI in Medicine.",
          "Khan, A., et al. (2020). 'Explainable AI for Critical Systems.' ACM Conference on AI Safety."
        ]
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
        image: "https://placehold.co/400x400?text=Dr.+Sarah",
        officeHours: "Tuesday, Thursday: 10:00 AM - 12:00 PM",
        officeLocation: "Engineering Building, Room 205",
        bio: "Dr. Sarah Rahman is an Associate Professor specializing in robotics and automation. Her research focuses on developing intelligent robotic systems for industrial applications and human-robot interaction.",
        education: [
          "Ph.D. in Robotics, Carnegie Mellon University, 2010",
          "M.S. in Mechanical Engineering, University of Michigan, 2006",
          "B.S. in Mechanical Engineering, Bangladesh University of Engineering and Technology, 2004"
        ],
        publications: [
          "Rahman, S., et al. (2023). 'Collaborative Robots in Manufacturing.' IEEE Robotics and Automation.",
          "Rahman, S., Khan, A. (2022). 'Human-Robot Interaction Patterns.' ACM Transactions on Human-Robot Interaction.",
          "Rahman, S., et al. (2021). 'Autonomous Navigation in Dynamic Environments.' Robotics Science and Systems Conference."
        ]
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
        image: "https://placehold.co/400x400?text=Dr.+Karim",
        officeHours: "Wednesday, Friday: 1:00 PM - 3:00 PM",
        officeLocation: "Business Building, Room 410",
        bio: "Dr. Karim Hossain is an Assistant Professor of Business specializing in financial economics and business analytics. His research examines market behavior and financial decision-making using data science approaches.",
        education: [
          "Ph.D. in Economics, London School of Economics, 2015",
          "MBA, Harvard Business School, 2011",
          "B.B.A in Finance, University of Dhaka, 2009"
        ],
        publications: [
          "Hossain, K., et al. (2023). 'Predictive Analytics in Financial Markets.' Journal of Finance.",
          "Hossain, K., et al. (2022). 'Economic Impact of Digital Transformation.' Harvard Business Review.",
          "Hossain, K., et al. (2021). 'Machine Learning for Market Prediction.' Financial Data Science Conference."
        ]
      }
    ];

    const foundPerson = mockPeople.find(p => p.id === Number(id));
    
    // Simulate API delay
    setTimeout(() => {
      setPerson(foundPerson || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13274D]"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!person) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#13274D] mb-4">Person Not Found</h1>
            <p className="text-gray-600 mb-6">The person you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-[#13274D] hover:bg-[#31466F]">
              <Link to="/directory">Back to Directory</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#13274D]">Home</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link to="/directory" className="text-gray-500 hover:text-[#13274D]">Directory</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-[#13274D] font-medium">{person.name}</li>
            </ol>
          </nav>

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border-t-4 border-[#13274D] mb-8">
            <div className="md:flex">
              <div className="md:w-1/3 p-6 flex justify-center">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-48 h-48 object-cover rounded-full border-4 border-[#ECB31D]" 
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-[#13274D] mr-3">{person.name}</h1>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    person.role === 'Faculty' ? 'bg-[#13274D] text-white' :
                    person.role === 'Staff' ? 'bg-[#31466F] text-white' :
                    'bg-[#ECB31D] text-[#13274D]'
                  }`}>
                    {person.role}
                  </span>
                </div>
                {person.title && (
                  <p className="text-xl text-gray-700 mb-4">{person.title}</p>
                )}
                <p className="text-gray-600 mb-4">Department of {person.department}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-[#13274D]">{person.email}</p>
                  </div>
                  {person.phone && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-[#13274D]">{person.phone}</p>
                    </div>
                  )}
                  {person.officeLocation && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Office</h3>
                      <p className="text-[#13274D]">{person.officeLocation}</p>
                    </div>
                  )}
                  {person.officeHours && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Office Hours</h3>
                      <p className="text-[#13274D]">{person.officeHours}</p>
                    </div>
                  )}
                </div>
                
                {person.expertise && person.expertise.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {person.expertise.map((exp, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center rounded-full bg-[#F5C940] bg-opacity-20 px-3 py-1 text-sm text-[#13274D]"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview' 
                    ? 'border-[#ECB31D] text-[#13274D]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              {person.publications && (
                <button
                  onClick={() => setActiveTab('publications')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'publications' 
                      ? 'border-[#ECB31D] text-[#13274D]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Publications
                </button>
              )}
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule' 
                    ? 'border-[#ECB31D] text-[#13274D]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Schedule Meeting
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            {activeTab === 'overview' && (
              <div>
                {person.bio && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#13274D] mb-4">Biography</h2>
                    <p className="text-gray-700">{person.bio}</p>
                  </div>
                )}
                
                {person.education && person.education.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#13274D] mb-4">Education</h2>
                    <ul className="space-y-2">
                      {person.education.map((edu, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-[#ECB31D] mr-2">•</span>
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'publications' && person.publications && (
              <div>
                <h2 className="text-xl font-bold text-[#13274D] mb-4">Recent Publications</h2>
                <ul className="space-y-4">
                  {person.publications.map((pub, i) => (
                    <li key={i} className="pb-4 border-b border-gray-100">
                      <p className="text-gray-700">{pub}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div>
                <h2 className="text-xl font-bold text-[#13274D] mb-4">Schedule a Meeting</h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form below to request a meeting with {person.name}.
                </p>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#13274D] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#13274D] mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-[#13274D] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-[#13274D] mb-1">
                      Preferred Time
                    </label>
                    <select
                      id="time"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                    >
                      <option value="">Select a time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-[#13274D] mb-1">
                      Purpose of Meeting
                    </label>
                    <textarea
                      id="purpose"
                      rows={4}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                      placeholder="Please describe the purpose of your meeting request"
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="bg-[#13274D] hover:bg-[#31466F] text-white">
                      Request Meeting
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

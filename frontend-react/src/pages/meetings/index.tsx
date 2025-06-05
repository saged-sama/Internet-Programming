import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';

interface Meeting {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  type: 'Faculty' | 'Department' | 'Student' | 'Administrative';
  isRegistrationRequired: boolean;
}

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Faculty' | 'Department' | 'Student' | 'Administrative'>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Mock data - in a real application, this would come from an API
  const meetings: Meeting[] = [
    {
      id: 1,
      title: "Faculty Senate Meeting",
      description: "Monthly faculty senate meeting to discuss academic policies and university governance.",
      date: "2025-06-15",
      time: "14:00-16:00",
      location: "Admin Building, Conference Room A",
      organizer: "Dr. Ahmed Khan, Faculty Senate Chair",
      type: "Faculty",
      isRegistrationRequired: false
    },
    {
      id: 2,
      title: "Computer Science Department Meeting",
      description: "Bi-weekly department meeting to discuss curriculum updates, research initiatives, and student affairs.",
      date: "2025-06-10",
      time: "10:00-12:00",
      location: "CS Building, Room 301",
      organizer: "Dr. Sarah Rahman, Department Chair",
      type: "Department",
      isRegistrationRequired: false
    },
    {
      id: 3,
      title: "Student Government Association",
      description: "Weekly meeting of the Student Government Association to discuss campus initiatives and student concerns.",
      date: "2025-06-08",
      time: "17:00-19:00",
      location: "Student Center, Meeting Room B",
      organizer: "Nusrat Jahan, SGA President",
      type: "Student",
      isRegistrationRequired: false
    },
    {
      id: 4,
      title: "Research Grant Workshop",
      description: "Workshop on applying for research grants and funding opportunities for faculty and graduate students.",
      date: "2025-06-20",
      time: "13:00-17:00",
      location: "Library, Conference Room",
      organizer: "Office of Research and Development",
      type: "Administrative",
      isRegistrationRequired: true
    },
    {
      id: 5,
      title: "Engineering Department Budget Review",
      description: "Annual budget review meeting for the Engineering Department.",
      date: "2025-06-12",
      time: "09:00-11:00",
      location: "Engineering Building, Room 205",
      organizer: "Dr. Karim Hossain, Department Chair",
      type: "Department",
      isRegistrationRequired: false
    }
  ];

  const meetingTypes: ('All' | 'Faculty' | 'Department' | 'Student' | 'Administrative')[] = [
    'All', 'Faculty', 'Department', 'Student', 'Administrative'
  ];

  const filteredMeetings = meetings.filter(meeting => {
    const matchesType = selectedType === 'All' || meeting.type === selectedType;
    const matchesDate = !selectedDate || meeting.date === selectedDate;
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          meeting.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesDate && matchesSearch;
  });

  // Group meetings by date for calendar view
  const meetingsByDate = filteredMeetings.reduce((acc, meeting) => {
    if (!acc[meeting.date]) {
      acc[meeting.date] = [];
    }
    acc[meeting.date].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  const sortedDates = Object.keys(meetingsByDate).sort();

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#13274D] mb-4">University Meetings</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              View upcoming meetings and events across departments, faculty, and student organizations.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-t-4 border-[#13274D]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  placeholder="Search meetings..."
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
                <label htmlFor="type" className="block text-sm font-medium text-[#13274D] mb-1">
                  Meeting Type
                </label>
                <select
                  id="type"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                >
                  {meetingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-[#13274D] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">
                  {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    viewMode === 'list' 
                      ? 'bg-[#13274D] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    viewMode === 'calendar' 
                      ? 'bg-[#13274D] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Calendar View
                </button>
              </div>
            </div>
          </div>

          {/* Meetings List/Calendar */}
          {filteredMeetings.length > 0 ? (
            viewMode === 'list' ? (
              <div className="space-y-6">
                {filteredMeetings.map(meeting => (
                  <div 
                    key={meeting.id} 
                    className="bg-white rounded-lg shadow-sm border-l-4 border-[#ECB31D] p-6"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-[#13274D]">{meeting.title}</h3>
                          <span className={`ml-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            meeting.type === 'Faculty' ? 'bg-[#13274D] text-white' :
                            meeting.type === 'Department' ? 'bg-[#31466F] text-white' :
                            meeting.type === 'Student' ? 'bg-[#ECB31D] text-[#13274D]' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {meeting.type}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{meeting.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-start">
                            <svg className="h-5 w-5 text-[#ECB31D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-start">
                            <svg className="h-5 w-5 text-[#ECB31D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{meeting.time}</span>
                          </div>
                          <div className="flex items-start">
                            <svg className="h-5 w-5 text-[#ECB31D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{meeting.location}</span>
                          </div>
                          <div className="flex items-start">
                            <svg className="h-5 w-5 text-[#ECB31D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{meeting.organizer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center">
                        {meeting.isRegistrationRequired && (
                          <Button className="w-full md:w-auto bg-[#13274D] hover:bg-[#31466F] text-white">
                            Register
                          </Button>
                        )}
                        <Button variant="outline" className="w-full md:w-auto mt-2 border-[#13274D] text-[#13274D] hover:bg-[#13274D] hover:text-white">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {sortedDates.map(date => (
                  <div key={date} className="border-b border-gray-200 last:border-b-0">
                    <div className="bg-[#13274D] text-white px-6 py-3">
                      <h3 className="font-medium">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {meetingsByDate[date].map(meeting => (
                        <div key={meeting.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="min-w-[80px] text-center p-2 bg-[#F5C940] bg-opacity-20 rounded-md mr-4">
                              <span className="block text-sm font-medium text-[#13274D]">{meeting.time.split('-')[0]}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="text-lg font-medium text-[#13274D]">{meeting.title}</h4>
                                <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                  meeting.type === 'Faculty' ? 'bg-[#13274D] text-white' :
                                  meeting.type === 'Department' ? 'bg-[#31466F] text-white' :
                                  meeting.type === 'Student' ? 'bg-[#ECB31D] text-[#13274D]' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {meeting.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{meeting.location}</p>
                              <p className="text-sm text-gray-500 mt-1">{meeting.organizer}</p>
                            </div>
                            <div className="ml-4">
                              {meeting.isRegistrationRequired && (
                                <Button size="sm" className="bg-[#13274D] hover:bg-[#31466F] text-white">
                                  Register
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-[#ECB31D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-[#13274D]">No meetings found</h3>
              <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
              <div className="mt-6">
                <Button 
                  onClick={() => {setSelectedType('All'); setSelectedDate(''); setSearchQuery('');}} 
                  className="bg-[#13274D] hover:bg-[#31466F] text-white"
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

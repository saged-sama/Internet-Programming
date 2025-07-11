import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';
import MeetingFilters from '../../components/meetings/MeetingFilters';
import MeetingList from '../../components/meetings/MeetingList';
import MeetingCalendar from '../../components/meetings/MeetingCalendar';
import { filterMeetings, groupMeetingsByDate, getSortedDates } from '../../lib/utils';
import { getCurrentUser } from '../../lib/auth';
import { type Meeting, type MeetingFilters as MeetingFilterParams, getMeetings, createMeeting, updateMeeting, deleteMeeting } from '../../api/meetings';
import meetingTypesData from '../../assets/meetingTypes.json';

// Interface for form data
interface MeetingFormData {
  title: string;
  description: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  location: string;
  url: string;
  organizer: string;
  type: 'Faculty' | 'Department' | 'Student' | 'Administrative';
  is_registration_required: boolean;
}

export default function MeetingsPage() {
  const meetingTypes: string[] = meetingTypesData as string[];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingFormData, setMeetingFormData] = useState<MeetingFormData>({
    title: '',
    description: '',
    meeting_date: '',
    start_time: '',
    end_time: '',
    location: '',
    url: '',
    organizer: '',
    type: 'Faculty',
    is_registration_required: false
  });

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMeetings();
    }, 300); // 300ms debounce delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Fetch meetings when type or date changes
  useEffect(() => {
    fetchMeetings();
  }, [selectedType, selectedDate]);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const filters: MeetingFilterParams = {
        skip: 0,
        limit: 100
      };

      if (searchQuery) {
        filters.search_query = searchQuery;
      }

      if (selectedType && selectedType !== 'All') {
        filters.meeting_type = selectedType;
      }

      if (selectedDate) {
        filters.start_date = selectedDate;
      }

      try {
        // For production, use the API
        const response = await getMeetings(filters);
        setMeetings(response.data);
      } catch (error) {
        console.warn('API call failed, using sample data instead:', error);
        // Fallback to sample data
        const sampleData = (await import('../../assets/meetings.sample.json')).default;
        // Convert sample data to match the Meeting interface
        const sampleMeetings = sampleData.map((meeting: any) => ({
          id: meeting.id,
          title: meeting.title,
          description: meeting.description,
          meeting_date: meeting.date,
          start_time: meeting.time.split('-')[0],
          end_time: meeting.time.includes('-') ? meeting.time.split('-')[1] : meeting.time,
          location: meeting.location,
          url: '',
          organizer: meeting.organizer,
          type: meeting.type,
          is_registration_required: meeting.isRegistrationRequired
        }));
        setMeetings(sampleMeetings);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError('Failed to load meetings. Please try again later.');
      setLoading(false);
    }
  }, [searchQuery, selectedType, selectedDate]);

  const filteredMeetings = filterMeetings(meetings, selectedType, selectedDate, searchQuery);
  const meetingsByDate = groupMeetingsByDate(filteredMeetings);
  const sortedDates = getSortedDates(meetingsByDate);

  const handleAddMeeting = () => {
    setEditingMeeting(null);
    setMeetingFormData({
      title: "",
      description: "",
      meeting_date: "",
      start_time: "",
      end_time: "",
      location: "",
      url: "",
      organizer: "",
      type: "Faculty",
      is_registration_required: false
    });
    setIsModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setMeetingFormData({
      title: meeting.title,
      description: meeting.description,
      meeting_date: meeting.meeting_date,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      location: meeting.location,
      url: meeting.url || '',
      organizer: meeting.organizer,
      type: meeting.type,
      is_registration_required: meeting.is_registration_required
    });
    setIsModalOpen(true);
  };

  const handleDeleteMeeting = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteMeeting(id);
        // Update the UI after successful deletion
        setMeetings(meetings.filter(meeting => meeting.id !== id));
      } catch (err) {
        console.error('Error deleting meeting:', err);
        setError('Failed to delete meeting. Please try again later.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const meetingData = {
        ...meetingFormData
      };
      
      if (editingMeeting) {
        // Update existing meeting
        const updatedMeeting = await updateMeeting(editingMeeting.id, meetingData);
        
        // Update the UI with the response from the API
        const updatedMeetings = meetings.map(meeting => 
          meeting.id === editingMeeting.id ? updatedMeeting : meeting
        );
        setMeetings(updatedMeetings);
      } else {
        // Create new meeting
        const newMeeting = await createMeeting(meetingData);
        
        // Update the UI with the response from the API
        setMeetings([...meetings, newMeeting]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving meeting:', err);
      setError('Failed to save meeting. Please try again later.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setMeetingFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setMeetingFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#13274D] mb-4">University Meetings</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              View upcoming meetings and events across departments, faculty, and student organizations.
            </p>
            
            {/* Admin Controls */}
            {isAdmin && (
              <div className="mt-6">
                <Button
                  onClick={handleAddMeeting}
                  className={themeClasses.primaryButton}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Meeting
                </Button>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-t-4 border-[#13274D]">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
              <MeetingFilters
                meetingTypes={meetingTypes}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <div className="flex items-center space-x-2 ml-auto">
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
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13274D]"></div>
              </div>
            ) : filteredMeetings.length > 0 ? (
              viewMode === 'list' ? (
                <div className="space-y-6">
                  <MeetingList 
                    meetings={filteredMeetings} 
                    isAdmin={isAdmin}
                    onEdit={handleEditMeeting}
                    onDelete={handleDeleteMeeting}
                  />
                </div>
              ) : (
                <MeetingCalendar meetingsByDate={meetingsByDate} sortedDates={sortedDates} />
              )
            ) : (
              <div className="text-center py-12">
                <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className={`mt-2 text-lg font-medium ${themeClasses.textPrimary}`}>No meetings found</h3>
                <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
                <div className="mt-6">
                  <Button 
                    onClick={() => {setSelectedType('All'); setSelectedDate(''); setSearchQuery('');}} 
                    className={`${themeClasses.bgPrimary} hover:${themeClasses.bgPrimaryLight} text-white`}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingMeeting ? "Edit Meeting" : "Add New Meeting"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={meetingFormData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={meetingFormData.type}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Faculty">Faculty</option>
                      <option value="Department">Department</option>
                      <option value="Student">Student</option>
                      <option value="Administrative">Administrative</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="meeting_date"
                      value={meetingFormData.meeting_date}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={meetingFormData.start_time}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="time"
                      name="end_time"
                      value={meetingFormData.end_time}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">URL (Optional)</label>
                    <input
                      type="url"
                      name="url"
                      value={meetingFormData.url}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={meetingFormData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Organizer
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={meetingFormData.organizer}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={meetingFormData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_registration_required"
                      checked={meetingFormData.is_registration_required}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Registration Required</span>
                  </label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className={`${themeClasses.bgPrimary} hover:${themeClasses.bgPrimaryLight} text-white`}>
                    {editingMeeting ? "Update" : "Add"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';
import MeetingFilters from '../../components/meetings/MeetingFilters';
import MeetingList from '../../components/meetings/MeetingList';
import MeetingCalendar from '../../components/meetings/MeetingCalendar';
import { filterMeetings, groupMeetingsByDate, getSortedDates } from '../../lib/utils';
import meetingsData from '../../assets/meetings.sample.json';
import meetingTypesData from '../../assets/meetingTypes.json';
import type { Meeting } from '../../components/meetings/MeetingCard';

export default function MeetingsPage() {
  const meetings: Meeting[] = meetingsData as Meeting[];
  const meetingTypes: string[] = meetingTypesData as string[];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredMeetings = filterMeetings(meetings, selectedType, selectedDate, searchQuery);
  const meetingsByDate = groupMeetingsByDate(filteredMeetings);
  const sortedDates = getSortedDates(meetingsByDate);

  return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#13274D] mb-4">University Meetings</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              View upcoming meetings and events across departments, faculty, and student organizations.
            </p>
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
            {/* Meetings List/Calendar */}
            {filteredMeetings.length > 0 ? (
              viewMode === 'list' ? (
                <div className="space-y-6">
                  <MeetingList meetings={filteredMeetings} />
                </div>
              ) : (
                <MeetingCalendar meetingsByDate={meetingsByDate} sortedDates={sortedDates} />
              )
            ) : (
              <div className="text-center py-12">
                <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
      </div>
  );
}

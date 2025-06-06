import { useState } from 'react';
import { Button } from '../../components/ui/button';
import Layout from '../../components/layout/Layout';
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
    <Layout>
      <div className="bg-background py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className={themeClasses.textPrimary}>University Meetings</h1>
            <p className={`${themeClasses.textPrimaryLight} max-w-3xl mx-auto`}>
              View upcoming meetings and events across departments, faculty, and student organizations.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6 border-t-4 border-primary">
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
                  <span className="text-muted-foreground">
                    {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md font-medium ${
                      viewMode === 'list' 
                        ? `${themeClasses.bgPrimary} text-primary-foreground` 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1 rounded-md font-medium ${
                      viewMode === 'calendar' 
                        ? `${themeClasses.bgPrimary} text-primary-foreground` 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
                <div className="space-y-4">
                  <MeetingList meetings={filteredMeetings} />
                </div>
              ) : (
                <MeetingCalendar meetingsByDate={meetingsByDate} sortedDates={sortedDates} />
              )
            ) : (
              <div className="text-center py-8">
                <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className={themeClasses.textPrimary}>No meetings found</h3>
                <p className="mt-1 text-muted-foreground">Try changing your search or filter criteria.</p>
                <div className="mt-4">
                  <Button 
                    onClick={() => {setSelectedType('All'); setSelectedDate(''); setSearchQuery('');}} 
                    className={themeClasses.primaryButton}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

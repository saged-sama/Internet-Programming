import React from 'react';
import type { Meeting } from './MeetingCard';

interface MeetingCalendarProps {
  meetingsByDate: Record<string, Meeting[]>;
  sortedDates: string[];
}

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({ meetingsByDate, sortedDates }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    {sortedDates.map(date => (
      <div key={date} className="border-b border-gray-200 last:border-b-0">
        <div className="bg-primary text-white px-6 py-3">
          <h3 className="font-medium">
            {(() => {
              try {
                // Format: YYYY-MM-DD
                const [year, month, day] = date.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                return dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              } catch (e) {
                return date; // Fallback to the raw date string if parsing fails
              }
            })()}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {meetingsByDate[date].map(meeting => (
            <div key={meeting.id} className="p-4">
              <div className="flex items-center mb-2">
                <span className="font-medium text-primary">{meeting.title}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {meeting.start_time.substring(0, 5)} - {meeting.end_time.substring(0, 5)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>{meeting.location}</span>
                <span className="ml-4">{meeting.organizer}</span>
                <span className="ml-auto">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    meeting.type === 'Faculty' ? 'bg-blue-100 text-blue-800' :
                    meeting.type === 'Department' ? 'bg-green-100 text-green-800' :
                    meeting.type === 'Student' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {meeting.type}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default MeetingCalendar;

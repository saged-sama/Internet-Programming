import React from 'react';
import MeetingCard from './MeetingCard';
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
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {meetingsByDate[date].map(meeting => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default MeetingCalendar;

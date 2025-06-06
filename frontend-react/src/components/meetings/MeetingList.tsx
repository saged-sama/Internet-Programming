import React from 'react';
import MeetingCard from './MeetingCard';
import type { Meeting } from './MeetingCard';

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings }) => (
  <div className="space-y-4">
    {meetings.map(meeting => (
      <MeetingCard key={meeting.id} meeting={meeting} />
    ))}
  </div>
);

export default MeetingList;

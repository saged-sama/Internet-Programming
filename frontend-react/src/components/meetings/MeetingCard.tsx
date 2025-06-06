import React from 'react';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';

export interface Meeting {
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

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => (
  <div className="bg-card rounded-lg shadow-sm border-l-4 border-accent p-4">
    <div className="flex items-start">
      <div className={`min-w-[80px] text-center p-2 ${themeClasses.bgAccentYellowLight} bg-opacity-20 rounded-md mr-4`}>
        <span className={`block font-medium ${themeClasses.textPrimary}`}>{meeting.time.split('-')[0]}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className={`font-medium ${themeClasses.textPrimary}`}>{meeting.title}</h4>
          <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
            meeting.type === 'Faculty' ? `${themeClasses.bgPrimary} text-white` :
            meeting.type === 'Department' ? `${themeClasses.bgPrimaryLight} text-white` :
            meeting.type === 'Student' ? `${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}` :
            'bg-muted text-foreground'
          }`}>
            {meeting.type}
          </span>
        </div>
        <p className={`${themeClasses.textPrimaryLight} mt-1`}>{meeting.location}</p>
        <p className="text-muted-foreground mt-1">{meeting.organizer}</p>
      </div>
      <div className="ml-4">
        {meeting.isRegistrationRequired && (
          <Button size="sm" className={themeClasses.primaryButton}>
            Register
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default MeetingCard;

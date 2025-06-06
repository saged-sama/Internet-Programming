import React from 'react';
import { Button } from '../../components/ui/button';
import themeClasses, { themeValues } from '../../lib/theme-utils';

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
  <div className="bg-white rounded-lg shadow-sm border-l-4 border-[#ECB31D] p-6">
    <div className="flex items-start">
      <div className={`min-w-[80px] text-center p-2 bg-[${themeValues.colors.accentYellowLight}] bg-opacity-20 rounded-md mr-4`}>
        <span className={`block text-sm font-medium ${themeClasses.textPrimary}`}>{meeting.time.split('-')[0]}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className={`text-lg font-medium ${themeClasses.textPrimary}`}>{meeting.title}</h4>
          <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            meeting.type === 'Faculty' ? `${themeClasses.bgPrimary} text-white` :
            meeting.type === 'Department' ? `${themeClasses.bgPrimaryLight} text-white` :
            meeting.type === 'Student' ? `${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}` :
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
          <Button size="sm" className={`${themeClasses.bgPrimary} hover:${themeClasses.bgPrimaryLight} text-white`}>
            Register
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default MeetingCard;

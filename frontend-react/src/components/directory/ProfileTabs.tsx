import React from 'react';
import themeClasses from '../../lib/theme-utils';
import type { Person } from '../../lib/types';
import MeetingRequestForm from './MeetingRequestForm';

interface ProfileTabsProps {
  person: Person;
  activeTab: 'overview' | 'publications' | 'schedule';
  setActiveTab: (tab: 'overview' | 'publications' | 'schedule') => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ person, activeTab, setActiveTab }) => (
  <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border mb-4">
    <div className="border-b border-border flex space-x-4 px-4 pt-4">
      <button
        className={`py-2 px-4 font-medium border-b-2 focus:outline-none ${activeTab === 'overview' ? `${themeClasses.borderPrimary} ${themeClasses.textPrimary}` : 'border-transparent text-muted-foreground'}`}
        onClick={() => setActiveTab('overview')}
      >
        Overview
      </button>
      <button
        className={`py-2 px-4 font-medium border-b-2 focus:outline-none ${activeTab === 'publications' ? `${themeClasses.borderPrimary} ${themeClasses.textPrimary}` : 'border-transparent text-muted-foreground'}`}
        onClick={() => setActiveTab('publications')}
      >
        Publications
      </button>
      <button
        className={`py-2 px-4 font-medium border-b-2 focus:outline-none ${activeTab === 'schedule' ? `${themeClasses.borderPrimary} ${themeClasses.textPrimary}` : 'border-transparent text-muted-foreground'}`}
        onClick={() => setActiveTab('schedule')}
      >
        Schedule Meeting
      </button>
    </div>
    <div className="px-4 py-4">
      {activeTab === 'overview' && (
        <div>
          {person.bio && (
            <div className="mb-6">
              <h2 className={`font-bold ${themeClasses.textPrimary} mb-2`}>About</h2>
              <p className="text-foreground whitespace-pre-line">{person.bio}</p>
            </div>
          )}
          {person.education && person.education.length > 0 && (
            <div className="mb-6">
              <h2 className={`font-bold ${themeClasses.textPrimary} mb-2`}>Education</h2>
              <ul className="list-disc ml-6 text-foreground">
                {person.education.map((edu: string, i: number) => (
                  <li key={i}>{edu}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {activeTab === 'publications' && person.publications && person.publications.length > 0 && (
        <div>
          <h2 className={`font-bold ${themeClasses.textPrimary} mb-4`}>Publications</h2>
          <ul className="list-disc ml-6 text-foreground">
            {person.publications.map((pub: string, i: number) => (
              <li key={i}>
                <p>{pub}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'schedule' && (
        <MeetingRequestForm personName={person.name} />
      )}
    </div>
  </div>
);

export default ProfileTabs;

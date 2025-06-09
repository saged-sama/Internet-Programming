import React from 'react';
import type { Person } from '../../lib/types';
import MeetingRequestForm from './MeetingRequestForm';

interface ProfileTabsProps {
  person: Person;
  activeTab: 'overview' | 'publications' | 'schedule';
  setActiveTab: (tab: 'overview' | 'publications' | 'schedule') => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ person, activeTab, setActiveTab }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden border mb-8">
    <div className="border-b flex space-x-4 px-6 pt-4">
      <button
        className={`py-2 px-4 font-medium text-sm border-b-2 focus:outline-none ${activeTab === 'overview' ? 'border-[#13274D] text-[#13274D]' : 'border-transparent text-gray-600'}`}
        onClick={() => setActiveTab('overview')}
      >
        Overview
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm border-b-2 focus:outline-none ${activeTab === 'publications' ? 'border-[#13274D] text-[#13274D]' : 'border-transparent text-gray-600'}`}
        onClick={() => setActiveTab('publications')}
      >
        Publications
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm border-b-2 focus:outline-none ${activeTab === 'schedule' ? 'border-[#13274D] text-[#13274D]' : 'border-transparent text-gray-600'}`}
        onClick={() => setActiveTab('schedule')}
      >
        Schedule Meeting
      </button>
    </div>
    <div className="px-6 py-8">
      {activeTab === 'overview' && (
        <div>
          {person.bio && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#13274D] mb-2">About</h2>
              <p className="text-gray-700 whitespace-pre-line">{person.bio}</p>
            </div>
          )}
          {person.education && person.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#13274D] mb-2">Education</h2>
              <ul className="list-disc ml-6 text-gray-700">
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
          <h2 className="text-xl font-bold text-[#13274D] mb-4">Publications</h2>
          <ul className="list-disc ml-6 text-gray-700">
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

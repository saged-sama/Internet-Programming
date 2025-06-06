import React from 'react';

interface MeetingFiltersProps {
  meetingTypes: string[];
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MeetingFilters: React.FC<MeetingFiltersProps> = ({ meetingTypes, selectedType, setSelectedType, selectedDate, setSelectedDate, searchQuery, setSearchQuery }) => (
  <div className="mb-4 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
    <div>
      <label className="block font-medium text-foreground">Type</label>
      <select
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        value={selectedType}
        onChange={e => setSelectedType(e.target.value)}
      >
        {meetingTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block font-medium text-foreground">Date</label>
      <input
        type="date"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
      />
    </div>
    <div className="flex-1">
      <label className="block font-medium text-foreground">Search</label>
      <input
        type="text"
        placeholder="Search by title, description, or organizer"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  </div>
);

export default MeetingFilters;

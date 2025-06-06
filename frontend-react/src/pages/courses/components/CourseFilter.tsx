import React, { useState, useEffect } from 'react';
import type { CourseFilterOptions, CourseDegreeLevel, CourseSemester } from '../../../types/course';

interface CourseFilterProps {
  filter: CourseFilterOptions;
  onFilterChange: (filter: CourseFilterOptions) => void;
}

/**
 * CourseFilter component provides UI for filtering courses by various criteria
 */
export const CourseFilter: React.FC<CourseFilterProps> = ({
  filter,
  onFilterChange
}) => {
  const [searchQuery, setSearchQuery] = useState(filter.searchQuery || '');
  const [degreeLevel, setDegreeLevel] = useState<CourseDegreeLevel | ''>
    (filter.degreeLevel || '');
  const [semester, setSemester] = useState<CourseSemester | ''>
    (filter.semester || '');
  
  // Update the parent component when any filter changes
  useEffect(() => {
    const newFilter: CourseFilterOptions = { ...filter };
    
    if (searchQuery) {
      newFilter.searchQuery = searchQuery;
    } else {
      delete newFilter.searchQuery;
    }
    
    if (degreeLevel) {
      newFilter.degreeLevel = degreeLevel;
    } else {
      delete newFilter.degreeLevel;
    }
    
    if (semester) {
      newFilter.semester = semester;
    } else {
      delete newFilter.semester;
    }
    
    onFilterChange(newFilter);
  }, [searchQuery, degreeLevel, semester, filter]);
  
  const handleReset = () => {
    setSearchQuery('');
    setDegreeLevel('');
    setSemester('');
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <h2 className="mb-4">Filters</h2>
      
      <div className="space-y-4">
        {/* Search query */}
        <div>
          <label htmlFor="searchQuery" className="block mb-2 text-muted-foreground">
            Search
          </label>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Degree Level */}
        <div>
          <label htmlFor="degreeLevel" className="block mb-2 text-muted-foreground">
            Degree Level
          </label>
          <select
            id="degreeLevel"
            value={degreeLevel}
            onChange={(e) => setDegreeLevel(e.target.value as CourseDegreeLevel | '')}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Levels</option>
            <option value="undergraduate">Undergraduate (BSc)</option>
            <option value="graduate">Graduate (MSc/MPhil)</option>
            <option value="doctorate">Doctorate (PhD)</option>
          </select>
        </div>
        
        {/* Semester */}
        <div>
          <label htmlFor="semester" className="block mb-2 text-muted-foreground">
            Semester
          </label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value as CourseSemester | '')}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Semesters</option>
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
            <option value="3rd">3rd Semester</option>
            <option value="4th">4th Semester</option>
            <option value="5th">5th Semester</option>
            <option value="6th">6th Semester</option>
            <option value="7th">7th Semester</option>
            <option value="8th">8th Semester</option>
          </select>
        </div>
        
        {/* Reset button */}
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}; 
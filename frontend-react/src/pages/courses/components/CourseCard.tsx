import React from 'react';
import type { Course } from '../../../types/course';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

/**
 * CourseCard component displays a summary of course information in a card format
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div 
      className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => onClick(course)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-card-foreground">{course.name}</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
            {course.code}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary-foreground rounded">
            {course.degreeLevel === 'undergraduate' ? 'BSc' : 
             course.degreeLevel === 'graduate' ? 'MSc/MPhil' : 
             course.degreeLevel === 'doctorate' ? 'PhD' : 'All Levels'}
          </span>
          <span className="px-2 py-1 text-xs bg-accent/20 text-accent-foreground rounded">
            {course.semester} Semester
          </span>
          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
            {course.credits} Credits
          </span>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {course.description}
        </p>
        
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mb-3 text-sm text-muted-foreground">
            <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(', ')}
          </div>
        )}
        
        <button 
          className="mt-2 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onClick(course);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}; 
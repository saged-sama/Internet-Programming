import React from 'react';
import type { Course } from '../../../types/course';

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
}

/**
 * CourseDetails component displays detailed information about a single course
 */
export const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onBack }) => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
          <div>
            <h1 className="mb-1">{course.name}</h1>
            <p className="text-muted-foreground">{course.code}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3 lg:mt-0">
            <span className="px-3 py-1 text-sm bg-secondary/20 text-secondary-foreground rounded">
              {course.degreeLevel === 'undergraduate' ? 'BSc' : 
               course.degreeLevel === 'graduate' ? 'MSc/MPhil' : 
               course.degreeLevel === 'doctorate' ? 'PhD' : 'All Levels'}
            </span>
            <span className="px-3 py-1 text-sm bg-accent/20 text-accent-foreground rounded">
              {course.semester} Semester
            </span>
            <span className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded">
              {course.credits} Credits
            </span>
          </div>
        </div>
        
        <div className="border-t border-border pt-4 mb-6">
          <h2 className="mb-2">Description</h2>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div>
              <h2 className="mb-2">Prerequisites</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          )}
          
          {course.instructor && (
            <div>
              <h2 className="mb-2">Instructor</h2>
              <p className="text-muted-foreground">{course.instructor}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="mb-2">Topics Covered</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {course.topics?.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="mb-2">Learning Objectives</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {course.objectives?.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="mb-2">Learning Outcomes</h2>
          <ul className="list-disc list-inside text-muted-foreground">
            {course.outcomes?.map((outcome, index) => (
              <li key={index}>{outcome}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90"
          >
            Back to Course List
          </button>
        </div>
      </div>
    </div>
  );
}; 
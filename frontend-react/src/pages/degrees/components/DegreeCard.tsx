import React from 'react';
import { Link } from 'react-router-dom';
import type { DegreeProgram } from '../../../types/degree';

interface DegreeCardProps {
  degree: DegreeProgram;
  onClick: (degree: DegreeProgram) => void;
}

/**
 * DegreeCard component displays a summary of a degree program
 */
export const DegreeCard: React.FC<DegreeCardProps> = ({ degree, onClick }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border hover:shadow-md transition-shadow duration-300 h-[26rem]" onClick={() => onClick(degree)}>
      <div className="p-4 h-full flex flex-col">
        <h3 className="mb-2">{degree.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
            {degree.level}
          </span>
          <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded">
            {degree.duration}
          </span>
          <span className="bg-accent/20 text-accent-foreground text-xs px-2 py-1 rounded">
            {degree.creditsRequired} Credits
          </span>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
          {degree.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <Link 
            to={`/courses/${degree.id}`} 
            className="text-primary hover:text-primary/80 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            View Courses →
          </Link>
        </div>
      </div>
    </div>
  );
}; 
import { useEffect, useRef } from 'react';
import type { DegreeProgram } from '../../../types/degree';

interface DegreeDetailsDialogProps {
  degree: DegreeProgram | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DegreeDetailsDialog({ degree, isOpen, onClose }: DegreeDetailsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key press to close dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Focus the dialog when it opens
      dialogRef.current.focus();
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Restore scrolling when dialog closes
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !degree) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div 
        ref={dialogRef}
        className="bg-card p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto focus:outline-none"
        tabIndex={-1}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="dialog-title" className="text-card-foreground">{degree.title}</h2>
          <button
            onClick={onClose}
            className="text-card-foreground/70 hover:text-card-foreground p-1"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
            {degree.level.charAt(0).toUpperCase() + degree.level.slice(1)}
          </div>
          <div className="px-3 py-1 bg-muted text-muted-foreground rounded-md">
            {degree.duration}
          </div>
          <div className="px-3 py-1 bg-muted text-muted-foreground rounded-md">
            {degree.creditsRequired} Credits
          </div>
        </div>

        <div className="space-y-6">
          <section aria-labelledby="description-heading">
            <h3 id="description-heading" className="text-card-foreground mb-2">Description</h3>
            <p className="text-card-foreground/80">{degree.description}</p>
          </section>

          {degree.concentrations && degree.concentrations.length > 0 && (
            <section aria-labelledby="concentrations-heading">
              <h3 id="concentrations-heading" className="text-card-foreground mb-2">Concentrations</h3>
              <div className="flex flex-wrap gap-2">
                {degree.concentrations.map((concentration, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent/10 text-accent-foreground rounded-md"
                  >
                    {concentration}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="requirements-heading">
            <h3 id="requirements-heading" className="text-card-foreground mb-2">Admission Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-card-foreground/80">
              {degree.admissionRequirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="careers-heading">
            <h3 id="careers-heading" className="text-card-foreground mb-2">Career Opportunities</h3>
            <ul className="list-disc list-inside space-y-1 text-card-foreground/80">
              {degree.careerOpportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="curriculum-heading">
            <h3 id="curriculum-heading" className="text-card-foreground mb-2">Curriculum</h3>
            
            <div className="mb-4">
              <h4 className="text-card-foreground font-bold mb-1">Core Courses</h4>
              <ul className="list-disc list-inside space-y-1 text-card-foreground/80">
                {degree.curriculum.coreCourses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
            
            {degree.curriculum.electiveCourses && degree.curriculum.electiveCourses.length > 0 && (
              <div>
                <h4 className="text-card-foreground font-bold mb-1">Elective Courses</h4>
                <ul className="list-disc list-inside space-y-1 text-card-foreground/80">
                  {degree.curriculum.electiveCourses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 
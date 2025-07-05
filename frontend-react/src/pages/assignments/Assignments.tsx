import { useState, useEffect } from 'react';
import AssignmentList from '@/components/assignments/AssignmentList';
import AssignmentForm from '@/components/assignments/AssignmentForm';
import AssignmentDetail from '@/components/assignments/AssignmentDetail';
import type { Assignment } from '@/types/scheduling';
import assignmentsData from '@/assets/assignments.json';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load assignments from JSON data
    const loadedAssignments = assignmentsData as Assignment[];
    setAssignments(loadedAssignments);
  }, []);

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowCreateForm(false);
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    setShowCreateForm(true);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handleSubmitAssignment = (assignmentData: Omit<Assignment, 'id' | 'submissionCount' | 'status'>) => {
    // In a real app, this would be an API call
    const newAssignment: Assignment = {
      id: assignments.length + 1,
      ...assignmentData,
      submissionCount: 0,
      status: 'Open'
    };
    
    setAssignments([...assignments, newAssignment]);
    setShowCreateForm(false);
    showSuccess('Assignment created successfully!');
  };

  const handleSubmitSolution = () => {
    // In a real app, this would be an API call to submit the solution
    showSuccess('Assignment submitted successfully!');
    setSelectedAssignment(null);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="mb-2">Assignments</h1>
            <p className="text-muted-foreground">
              View, create, and submit assignments for your courses.
            </p>
          </div>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={handleCreateAssignment}
          >
            Create Assignment
          </button>
        </div>

        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {showCreateForm ? (
          <AssignmentForm 
            onSubmit={handleSubmitAssignment}
            onCancel={handleCancelCreate}
          />
        ) : selectedAssignment ? (
          <AssignmentDetail
            assignment={selectedAssignment}
            onClose={() => setSelectedAssignment(null)}
            onSubmit={handleSubmitSolution}
          />
        ) : (
          <AssignmentList 
            assignments={assignments} 
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

  );
}

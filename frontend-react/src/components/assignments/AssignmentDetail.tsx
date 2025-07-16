import type { Assignment } from '@/types/scheduling';
import { format } from 'date-fns';

interface AssignmentDetailProps {
  assignment: Assignment;
  onClose: () => void;
  onSubmit: () => void;
}

export default function AssignmentDetail({ assignment, onClose, onSubmit }: AssignmentDetailProps) {
  const isOpen = assignment.status === 'Open';
  const deadline = new Date(assignment.deadline);
  const isDeadlinePassed = new Date() > deadline;

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium">{assignment.title}</h3>
        <div 
          className={`text-xs px-2 py-1 rounded-full ${
            assignment.status === 'Open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {assignment.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Course:</p>
          <p className="font-medium">{assignment.courseCode} - {assignment.courseTitle}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Batch:</p>
          <p className="font-medium">Batch {assignment.batch}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Semester:</p>
          <p className="font-medium">Semester {assignment.semester}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Deadline:</p>
          <p className={`font-medium ${isDeadlinePassed ? 'text-red-600' : ''}`}>
            {format(deadline, 'MMM dd, yyyy hh:mm a')}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Marks:</p>
          <p className="font-medium">{assignment.totalMarks}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created By:</p>
          <p className="font-medium">{assignment.createdBy}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Submissions:</p>
          <p className="font-medium">{assignment.submissionCount}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Description:</p>
        <div className="bg-muted/30 p-4 rounded-md">
          <p>{assignment.description}</p>
        </div>
      </div>

      {isOpen && !isDeadlinePassed && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Submit Assignment</h4>
          <div className="mb-4">
            <label htmlFor="file" className="block mb-2 text-sm text-muted-foreground">
              Upload Files
            </label>
            <input
              id="file"
              type="file"
              multiple
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>
          
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="px-4 py-2 border border-muted rounded-md hover:bg-muted"
          onClick={onClose}
        >
          Close
        </button>
        {isOpen && !isDeadlinePassed && (
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={onSubmit}
          >
            Submit Assignment
          </button>
        )}
      </div>
    </div>
  );
}

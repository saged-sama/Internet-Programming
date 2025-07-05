import type { Assignment } from "@/types/scheduling";
import { format, isPast } from "date-fns";
import { getCurrentUser } from "../../lib/auth";

interface AssignmentListProps {
  assignments: Assignment[];
  onViewDetails: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
}

export default function AssignmentList({
  assignments,
  onViewDetails,
  onEdit,
  onDelete,
}: AssignmentListProps) {
  const currentUser = getCurrentUser();
  const isFaculty = currentUser?.role === "faculty";

  if (assignments.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm text-center">
        <p className="text-muted-foreground">No assignments found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assignments.map((assignment) => {
        const isDeadlinePassed = isPast(new Date(assignment.deadline));

        return (
          <div
            key={assignment.id}
            className="bg-card rounded-lg shadow-sm overflow-hidden border border-muted relative group"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{assignment.title}</h4>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    assignment.status === "Open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {assignment.status}
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-1">
                {assignment.courseCode} - {assignment.courseTitle}
              </div>

              <div className="text-sm mb-1">Batch {assignment.batch}</div>
              <div className="text-sm mb-3">Semester {assignment.semester}</div>

              <p className="text-sm mb-4 line-clamp-2">
                {assignment.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <div
                  className={`${
                    isDeadlinePassed ? "text-red-600" : "text-muted-foreground"
                  }`}
                >
                  Deadline:{" "}
                  {format(
                    new Date(assignment.deadline),
                    "MMM dd, yyyy hh:mm a"
                  )}
                </div>
                <div className="text-muted-foreground">
                  {assignment.submissionCount} submissions
                </div>
              </div>
            </div>

            <div className="border-t border-muted p-3 bg-muted/30 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Created by: {assignment.createdBy}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewDetails(assignment)}
                  className="text-sm text-primary hover:underline"
                >
                  View Details
                </button>
                {isFaculty && (
                  <>
                    <button
                      onClick={() => onEdit?.(assignment)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(assignment)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

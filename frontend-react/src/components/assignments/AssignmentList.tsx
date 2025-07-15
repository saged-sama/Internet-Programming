import type { Assignment } from "@/types/scheduling";
import { format, isPast } from "date-fns";
import { getCurrentUser } from "../../lib/auth";
import { useState } from "react";

interface AssignmentListProps {
  assignments: Assignment[];
  mySubmissions?: Array<{
    assignment_id: string;
    marks_obtained?: number;
    marks?: number;
    feedback?: string;
  }>;
  onViewDetails: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
}

export default function AssignmentList({
  assignments,
  mySubmissions = [],
  onViewDetails,
  onEdit,
  onDelete,
}: AssignmentListProps) {
  const currentUser = getCurrentUser();
  const isFaculty = currentUser?.role === "faculty";
  const isStudent = currentUser?.role === "student";

  // State for marks modal
  const [marksModal, setMarksModal] = useState<{
    open: boolean;
    marks?: number;
    feedback?: string;
  }>({ open: false });

  const hasSubmitted = (assignmentId: string | number) =>
    mySubmissions.some((sub) => sub.assignment_id === String(assignmentId));

  // Find submission for assignment
  const getSubmission = (assignmentId: string | number) =>
    mySubmissions.find((sub) => sub.assignment_id === String(assignmentId));

  if (assignments.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm text-center">
        <p className="text-muted-foreground">No assignments found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((assignment) => {
          const isDeadlinePassed = isPast(new Date(assignment.deadline));
          const status = isDeadlinePassed ? "Closed" : "Open";
          const submission = getSubmission(assignment.id);
          const hasMarks =
            submission &&
            ((submission.marks_obtained !== undefined &&
              submission.marks_obtained !== null) ||
              (submission.marks !== undefined && submission.marks !== null));

          return (
            <div
              key={assignment.id}
              className="bg-card rounded-lg shadow-sm overflow-hidden border border-muted relative group"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        status === "Open"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status}
                    </div>
                    {hasSubmitted(assignment.id) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                        Submitted
                      </span>
                    )}
                    {/* View Marks button for students if marks are available */}
                    {isStudent && hasSubmitted(assignment.id) && hasMarks && (
                      <button
                        className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200 ml-2"
                        onClick={() =>
                          setMarksModal({
                            open: true,
                            marks:
                              submission.marks_obtained ?? submission.marks,
                            feedback: submission.feedback,
                          })
                        }
                      >
                        View Marks
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-1">
                  {assignment.courseCode} - {assignment.courseTitle}
                </div>

                <div className="text-sm mb-1">Batch {assignment.batch}</div>
                <div className="text-sm mb-3">
                  Semester {assignment.semester}
                </div>

                <p className="text-sm mb-4 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <div
                    className={`${
                      isDeadlinePassed
                        ? "text-red-600"
                        : "text-muted-foreground"
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
      {/* Marks Modal */}
      {marksModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-xs">
            <h3 className="text-lg font-bold mb-2 text-[#25345D]">
              Assignment Marks
            </h3>
            <div className="mb-2">
              <span className="font-semibold">Marks: </span>
              {marksModal.marks}
            </div>
            {marksModal.feedback && (
              <div className="mb-2">
                <span className="font-semibold">Feedback: </span>
                {marksModal.feedback}
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-[#EAB308] text-[#25345D] rounded hover:bg-[#F5C940] w-full"
              onClick={() => setMarksModal({ open: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

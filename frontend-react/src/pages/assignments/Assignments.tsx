import { useState, useEffect } from "react";
import AssignmentList from "@/components/assignments/AssignmentList";
import AssignmentForm from "@/components/assignments/AssignmentForm";
import AssignmentDetail from "@/components/assignments/AssignmentDetail";
import type { Assignment } from "@/types/scheduling";
import assignmentsData from "@/assets/assignments.json";
import { getCurrentUser } from "../../lib/auth";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const currentUser = getCurrentUser();
  const isFaculty = currentUser?.role === "faculty";
  const isStudent = currentUser?.role === "student";

  useEffect(() => {
    // Load assignments from JSON data
    const loadedAssignments = assignmentsData as Assignment[];
    setAssignments(loadedAssignments);
  }, []);

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowCreateForm(false);
    setEditingAssignment(null);
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    setEditingAssignment(null);
    setShowCreateForm(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(null);
    setShowCreateForm(false);
    setEditingAssignment(assignment);
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    if (
      window.confirm(`Are you sure you want to delete "${assignment.title}"?`)
    ) {
      const updatedAssignments = assignments.filter(
        (a) => a.id !== assignment.id
      );
      setAssignments(updatedAssignments);
      showSuccess("Assignment deleted successfully!");
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setEditingAssignment(null);
  };

  const handleSubmitAssignment = (
    assignmentData: Omit<Assignment, "id" | "submissionCount" | "status">
  ) => {
    if (editingAssignment) {
      // Update existing assignment
      const updatedAssignments = assignments.map((a) =>
        a.id === editingAssignment.id ? { ...a, ...assignmentData } : a
      );
      setAssignments(updatedAssignments);
      setEditingAssignment(null);
      showSuccess("Assignment updated successfully!");
    } else {
      // Create new assignment
      const newAssignment: Assignment = {
        id: assignments.length + 1,
        ...assignmentData,
        submissionCount: 0,
        status: "Open",
      };

      setAssignments([...assignments, newAssignment]);
      setShowCreateForm(false);
      showSuccess("Assignment created successfully!");
    }
  };

  const handleSubmitSolution = () => {
    // In a real app, this would be an API call to submit the solution
    showSuccess("Assignment submitted successfully!");
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
            {isFaculty
              ? "Create and manage assignments for your courses."
              : "View and submit assignments for your courses."}
          </p>
        </div>
        {isFaculty && (
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={handleCreateAssignment}
          >
            Create Assignment
          </button>
        )}
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
      ) : editingAssignment ? (
        <AssignmentForm
          assignment={editingAssignment}
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
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
        />
      )}
    </div>
  );
}

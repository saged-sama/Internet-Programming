import { useState, useEffect } from "react";
import AssignmentList from "@/components/assignments/AssignmentList";
import AssignmentForm from "@/components/assignments/AssignmentForm";
import AssignmentDetail from "@/components/assignments/AssignmentDetail";
import type { Assignment } from "@/types/scheduling";
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  apiRequest,
  fetchMyAssignmentSubmissions,
} from "../../lib/schedulingApi";
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
  const [mySubmissions, setMySubmissions] = useState([]);

  const currentUser = getCurrentUser();
  const isFaculty = currentUser?.role === "faculty";
  const isStudent = currentUser?.role === "student";

  useEffect(() => {
    fetchAssignments()
      .then((data) => {
        // Map snake_case to camelCase for each assignment, including all relevant fields
        const mapped = data.map((a: any) => ({
          ...a,
          courseCode: a.course_code || "",
          courseTitle: a.course_title || "",
          batch: a.batch,
          semester: a.semester,
          title: a.title,
          description: a.description,
          deadline: a.deadline,
          createdBy: a.created_by || "",
          submissionCount: a.submission_count ?? 0,
          status:
            a.status ||
            (a.deadline && new Date(a.deadline) < new Date()
              ? "Closed"
              : "Open"),
        }));
        setAssignments(mapped);
      })
      .catch(() => showSuccess("Failed to load assignments"));
    fetchMyAssignmentSubmissions()
      .then((subs) => setMySubmissions(subs))
      .catch(() => setMySubmissions([]));
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

  const handleDeleteAssignment = async (assignment: Assignment) => {
    if (
      window.confirm(`Are you sure you want to delete "${assignment.title}"?`)
    ) {
      try {
        await deleteAssignment(String(assignment.id));
        setAssignments(await fetchAssignments());
        showSuccess("Assignment deleted successfully!");
      } catch {
        showSuccess("Error deleting assignment");
      }
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setEditingAssignment(null);
  };

  const handleSubmitAssignment = async (
    assignmentData: Omit<Assignment, "id" | "submissionCount" | "status">
  ) => {
    // Map camelCase to snake_case for API
    const apiData = {
      title: assignmentData.title,
      course_code: assignmentData.courseCode,
      course_title: assignmentData.courseTitle,
      batch: assignmentData.batch,
      semester: assignmentData.semester,
      deadline: new Date(assignmentData.deadline).toISOString(),
      description: assignmentData.description,
      created_by: assignmentData.createdBy,
    };
    try {
      if (editingAssignment) {
        await updateAssignment(String(editingAssignment.id), apiData);
        showSuccess("Assignment updated successfully!");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        await createAssignment(apiData);
        showSuccess("Assignment created successfully!");
        setTimeout(() => window.location.reload(), 1000);
      }
      setAssignments(await fetchAssignments());
      setShowCreateForm(false);
      setEditingAssignment(null);
    } catch {
      showSuccess("Error saving assignment");
    }
  };

  const handleSubmitSolution = async () => {
    if (!selectedAssignment) return;
    try {
      await apiRequest(
        `/staff-api/assignments/${selectedAssignment.id}/submit`,
        {
          method: "POST",
        }
      );
      showSuccess("Assignment submitted successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      showSuccess("Error submitting assignment");
    }
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
          mySubmissions={mySubmissions}
          onViewDetails={handleViewDetails}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
        />
      )}
    </div>
  );
}

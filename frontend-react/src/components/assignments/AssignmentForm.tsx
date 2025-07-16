import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import type { Assignment } from "@/types/scheduling";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface AssignmentFormProps {
  onSubmit: (
    assignmentData: Omit<Assignment, "id" | "submissionCount" | "status">
  ) => void;
  onCancel: () => void;
  assignment?: Assignment; // For editing mode
}

export default function AssignmentForm({
  onSubmit,
  onCancel,
  assignment,
}: AssignmentFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseCode: "",
    courseTitle: "",
    batch: "",
    semester: "",
    deadline: "",
    createdBy: "",
    totalMarks: 0,
  });
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const isEditing = !!assignment;

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        courseCode: assignment.courseCode,
        courseTitle: assignment.courseTitle,
        batch: assignment.batch,
        semester: assignment.semester,
        deadline: assignment.deadline,
        createdBy: assignment.createdBy,
        totalMarks: assignment.totalMarks,
      });
    } else {
      // Set createdBy to current user's name when creating
      const user = getCurrentUser();
      setFormData((prev) => ({ ...prev, createdBy: user?.name || "" }));
    }
  }, [assignment]);

  useEffect(() => {
    async function fetchCourseCodes() {
      setLoadingCourses(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/courses/codes`);
        if (!response.ok) throw new Error("Failed to fetch course codes");
        const codes = await response.json();
        setCourseCodes(codes);
      } catch (err) {
        setCourseCodes([]);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCourseCodes();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-muted p-6">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? "Edit Assignment" : "Create New Assignment"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title of the assignment"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="courseCode"
              className="block text-sm font-medium mb-1"
            >
              Course Code
            </label>
            <select
              id="courseCode"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loadingCourses}
            >
              <option value="">
                {loadingCourses ? "Loading..." : "Select Course Code"}
              </option>
              {courseCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="courseTitle"
            className="block text-sm font-medium mb-1"
          >
            Course Title
          </label>
          <input
            type="text"
            id="courseTitle"
            name="courseTitle"
            placeholder="Title of the course"
            value={formData.courseTitle}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="batch" className="block text-sm font-medium mb-1">
              Batch
            </label>
            <input
              type="text"
              id="batch"
              name="batch"
              placeholder="Batch (e.g., 27, 28)"
              value={formData.batch}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="semester"
              className="block text-sm font-medium mb-1"
            >
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium mb-1"
            >
              Deadline
            </label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Detailed description of the assignment"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {isEditing && (
          <div>
            <label
              htmlFor="createdBy"
              className="block text-sm font-medium mb-1"
            >
              Created By
            </label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              value={formData.createdBy}
              readOnly
              className="w-full px-3 py-2 border border-muted rounded-md bg-gray-100 focus:outline-none"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {isEditing ? "Update Assignment" : "Create Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
}

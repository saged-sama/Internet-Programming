import { useState, useEffect } from "react";
import {
  fetchSubmissionsForAssignment,
  apiRequest,
  fetchAssignments,
  fetchAllUserProfiles,
} from "@/lib/schedulingApi";
import Papa from "papaparse";

interface MarksUploadProps {
  onClose: () => void;
}

interface StudentMark {
  studentId: string;
  studentName: string;
  marks: number;
  maxMarks: number;
  comments?: string;
}

export default function MarksUpload({ onClose }: MarksUploadProps) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "manual">("file");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<StudentMark[]>([]);
  const [studentList, setStudentList] = useState<StudentMark[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await fetchAssignments();
        setAssignments(data);
      } catch {
        setAssignments([]);
      }
    }
    loadAssignments();
  }, []);

  useEffect(() => {
    async function fetchStudentsForAssignment() {
      if (!selectedAssignment) {
        setStudentList([]);
        setPreviewData([]);
        return;
      }
      const submissions = await fetchSubmissionsForAssignment(
        selectedAssignment
      );
      const users = await fetchAllUserProfiles();
      const userMap: Record<string, string> = {};
      users.forEach((user: any) => {
        userMap[user.id] = user.name;
      });
      const students = submissions.map((sub: any) => ({
        studentId: sub.student_id,
        studentName: userMap[sub.student_id] || sub.student_id,
        marks: sub.marks_obtained || 0,
        maxMarks: 100,
        comments: sub.feedback || "",
      }));
      setStudentList(students);
      setPreviewData(students);
    }
    fetchStudentsForAssignment();
  }, [selectedAssignment]);

  // Mock data
  const courses = [
    { code: "CSE 2101", name: "Data Structures and Algorithms" },
    { code: "CSE 2203", name: "Computer Organization" },
    { code: "CSE 3107", name: "Operating Systems" },
    { code: "CSE 4101", name: "Software Engineering" },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // Map CSV rows to StudentMark[]
          const data: StudentMark[] = (results.data as any[])
            .map((row: any) => ({
              studentId: row["Student ID"],
              studentName: row["Student Name"],
              marks: Number(row["Marks"]),
              maxMarks: Number(row["Max Marks"]),
              comments: row["Comments"] || "",
            }))
            .filter((student) => student.studentId && student.studentName);
          setPreviewData(data);
        },
        error: () => {
          alert("Failed to parse CSV file.");
        },
      });
    }
  };

  const handleManualEntry = async () => {
    if (!selectedAssignment) {
      alert("Please select an assignment first.");
      return;
    }

    // Fetch all submissions for the selected assignment
    const submissions = await fetchSubmissionsForAssignment(selectedAssignment);

    // Fetch all user profiles to map student_id to name
    const users = await fetchAllUserProfiles();
    const userMap: Record<string, string> = {};
    users.forEach((user: any) => {
      userMap[user.id] = user.name;
    });

    // Build preview data from submissions
    const preview = submissions.map((sub: any) => ({
      studentId: sub.student_id,
      studentName: userMap[sub.student_id] || sub.student_id,
      marks: sub.marks_obtained || 0,
      maxMarks: 100, // Adjust if you have max marks info
      comments: sub.feedback || "",
    }));

    setPreviewData(preview);
  };

  const handleMarksChange = (index: number, value: string) => {
    const newData = [...previewData];
    newData[index].marks = parseInt(value) || 0;
    setPreviewData(newData);
  };

  const handleCommentsChange = (index: number, value: string) => {
    const newData = [...previewData];
    newData[index].comments = value;
    setPreviewData(newData);
  };

  const handleUpload = async () => {
    if (!selectedCourse || !selectedAssignment) {
      alert("Please select course and assignment");
      return;
    }

    setIsUploading(true);

    try {
      // Fetch all submissions for the selected assignment
      const submissions = await fetchSubmissionsForAssignment(
        selectedAssignment
      );

      // Map studentId to submissionId
      const submissionMap: Record<string, string> = {};
      submissions.forEach((sub: any) => {
        submissionMap[sub.student_id] = sub.id;
      });

      // For each student in previewData, upload marks
      for (const student of previewData) {
        const submissionId = submissionMap[student.studentId];
        if (!submissionId) continue; // Optionally, handle missing submissions

        await apiRequest(
          `/staff-api/assignments/submissions/${submissionId}/grade`,
          {
            method: "PUT",
            body: JSON.stringify({
              marks_obtained: student.marks,
              feedback: student.comments || "",
            }),
          }
        );
      }

      setIsUploading(false);
      setShowSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setIsUploading(false);
      alert("Failed to upload marks. Please try again.");
    }
  };

  const downloadTemplate = () => {
    const header = "Student ID,Student Name,Marks,Max Marks";
    const rows = studentList.map(
      (student) =>
        `${student.studentId},${student.studentName},${student.marks},${student.maxMarks}`
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marks_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#25345D]">Upload Marks</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-[#25345D] mb-2">
                Marks Uploaded Successfully!
              </h3>
              <p className="text-gray-600">
                All marks have been uploaded and saved to the system.
              </p>
            </div>
          ) : (
            <>
              {/* Course and Assignment Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Select Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
                  >
                    <option value="">Choose a course</option>
                    {courses.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#25345D] mb-2">
                    Select Assignment
                  </label>
                  <select
                    value={selectedAssignment}
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
                  >
                    <option value="">Choose an assignment</option>
                    {assignments.map((assignment) => (
                      <option key={assignment.id} value={assignment.id}>
                        {assignment.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#25345D] mb-3">
                  Upload Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="file"
                      checked={uploadMethod === "file"}
                      onChange={(e) =>
                        setUploadMethod(e.target.value as "file" | "manual")
                      }
                      className="mr-2"
                    />
                    <span>Upload CSV File</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="manual"
                      checked={uploadMethod === "manual"}
                      onChange={(e) =>
                        setUploadMethod(e.target.value as "file" | "manual")
                      }
                      className="mr-2"
                    />
                    <span>Manual Entry</span>
                  </label>
                </div>
              </div>

              {/* File Upload Section */}
              {uploadMethod === "file" && (
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-[#25345D] font-medium mb-2">
                        {csvFile ? csvFile.name : "Click to upload CSV file"}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        or drag and drop your CSV file here
                      </p>
                      <button
                        type="button"
                        onClick={downloadTemplate}
                        className="text-[#EAB308] hover:text-[#F5C940] text-sm font-medium"
                      >
                        Download CSV Template
                      </button>
                    </label>
                  </div>
                </div>
              )}

              {/* Manual Entry Section */}
              {uploadMethod === "manual" && (
                <div className="mb-6">
                  <button
                    onClick={handleManualEntry}
                    className="px-4 py-2 bg-[#EAB308] text-[#25345D] rounded-md hover:bg-[#F5C940] transition"
                  >
                    Load Student List
                  </button>
                </div>
              )}

              {/* Preview Section */}
              {previewData.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#25345D] mb-4">
                    Preview & Edit Marks
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-[#25345D]">
                            Student ID
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-[#25345D]">
                            Student Name
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-[#25345D]">
                            Marks
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-[#25345D]">
                            Max Marks
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-[#25345D]">
                            Comments
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((student, index) => (
                          <tr
                            key={student.studentId}
                            className="border-t border-gray-200"
                          >
                            <td className="px-4 py-2 text-sm">
                              {student.studentId}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {student.studentName}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                max={student.maxMarks}
                                value={student.marks}
                                onChange={(e) =>
                                  handleMarksChange(index, e.target.value)
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {student.maxMarks}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={student.comments || ""}
                                onChange={(e) =>
                                  handleCommentsChange(index, e.target.value)
                                }
                                placeholder="Optional comments"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={
                    !selectedCourse ||
                    !selectedAssignment ||
                    previewData.length === 0 ||
                    isUploading
                  }
                  className="px-6 py-2 bg-[#EAB308] text-[#25345D] font-semibold rounded-md hover:bg-[#F5C940] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload Marks"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

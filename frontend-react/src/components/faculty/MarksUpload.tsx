import { useState } from "react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data
  const courses = [
    { code: "CSE 2101", name: "Data Structures and Algorithms" },
    { code: "CSE 2203", name: "Computer Organization" },
    { code: "CSE 3107", name: "Operating Systems" },
    { code: "CSE 4101", name: "Software Engineering" },
  ];

  const assignments = [
    { id: "1", title: "Assignment 1 - Linked Lists", maxMarks: 100 },
    { id: "2", title: "Assignment 2 - Stacks and Queues", maxMarks: 100 },
    { id: "3", title: "Assignment 3 - Trees and Graphs", maxMarks: 100 },
    { id: "4", title: "Final Project", maxMarks: 200 },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      // Simulate CSV parsing
      const mockData: StudentMark[] = [
        {
          studentId: "2021001",
          studentName: "Ahmed Hassan",
          marks: 85,
          maxMarks: 100,
        },
        {
          studentId: "2021002",
          studentName: "Fatima Ali",
          marks: 92,
          maxMarks: 100,
        },
        {
          studentId: "2021003",
          studentName: "Mohammed Khan",
          marks: 78,
          maxMarks: 100,
        },
        {
          studentId: "2021004",
          studentName: "Aisha Rahman",
          marks: 95,
          maxMarks: 100,
        },
        {
          studentId: "2021005",
          studentName: "Omar Ahmed",
          marks: 88,
          maxMarks: 100,
        },
      ];
      setPreviewData(mockData);
    }
  };

  const handleManualEntry = () => {
    // Mock data for manual entry
    const mockData: StudentMark[] = [
      {
        studentId: "2021001",
        studentName: "Ahmed Hassan",
        marks: 0,
        maxMarks: 100,
      },
      {
        studentId: "2021002",
        studentName: "Fatima Ali",
        marks: 0,
        maxMarks: 100,
      },
      {
        studentId: "2021003",
        studentName: "Mohammed Khan",
        marks: 0,
        maxMarks: 100,
      },
      {
        studentId: "2021004",
        studentName: "Aisha Rahman",
        marks: 0,
        maxMarks: 100,
      },
      {
        studentId: "2021005",
        studentName: "Omar Ahmed",
        marks: 0,
        maxMarks: 100,
      },
    ];
    setPreviewData(mockData);
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setShowSuccess(true);

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent =
      "Student ID,Student Name,Marks,Max Marks,Comments\n2021001,Ahmed Hassan,85,100,Good work\n2021002,Fatima Ali,92,100,Excellent";
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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExamForm from "@/components/exams/ExamForm";
import type { ExamTimetable } from "@/types/scheduling";
import examTimetablesData from "@/assets/examTimetables.json";

export default function ExamManagement() {
  const [exams, setExams] = useState<ExamTimetable[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamTimetable[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamTimetable | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterExamType, setFilterExamType] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Load exams from JSON data
    const loadedExams = examTimetablesData as ExamTimetable[];
    setExams(loadedExams);
    setFilteredExams(loadedExams);
  }, []);

  useEffect(() => {
    filterExams();
  }, [exams, searchTerm, filterBatch, filterSemester, filterExamType]);

  const filterExams = () => {
    let filtered = [...exams];

    if (searchTerm) {
      filtered = filtered.filter(
        (exam) =>
          exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.invigilator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.room.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBatch && filterBatch !== "all") {
      filtered = filtered.filter((exam) => exam.batch === filterBatch);
    }

    if (filterSemester && filterSemester !== "all") {
      filtered = filtered.filter((exam) => exam.semester === filterSemester);
    }

    if (filterExamType && filterExamType !== "all") {
      filtered = filtered.filter((exam) => exam.examType === filterExamType);
    }

    setFilteredExams(filtered);
  };

  const handleCreateExam = () => {
    setEditingExam(null);
    setShowCreateForm(true);
  };

  const handleEditExam = (exam: ExamTimetable) => {
    setEditingExam(exam);
    setShowCreateForm(true);
  };

  const handleDeleteExam = (exam: ExamTimetable) => {
    if (
      window.confirm(
        `Are you sure you want to delete the exam for ${exam.courseCode}?`
      )
    ) {
      setExams(exams.filter((e) => e.id !== exam.id));
      showSuccess("Exam deleted successfully!");
    }
  };

  const handleSubmitExam = (examData: Omit<ExamTimetable, "id">) => {
    if (editingExam) {
      // Update existing exam
      setExams(
        exams.map((exam) =>
          exam.id === editingExam.id
            ? { ...examData, id: editingExam.id }
            : exam
        )
      );
      showSuccess("Exam updated successfully!");
    } else {
      // Create new exam
      const newExam: ExamTimetable = {
        id: Date.now(),
        ...examData,
      };
      setExams([newExam, ...exams]);
      showSuccess("Exam created successfully!");
    }
    setShowCreateForm(false);
    setEditingExam(null);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingExam(null);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const batchOptions = ["27", "28", "29", "30", "31"];
  const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const examTypeOptions = ["Midterm", "Final", "Quiz"];

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "Midterm":
        return "bg-blue-100 text-blue-800";
      case "Final":
        return "bg-red-100 text-red-800";
      case "Quiz":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6">
        <div className="max-w-4xl mx-auto">
          <ExamForm
            exam={editingExam || undefined}
            onSubmit={handleSubmitExam}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#25345D]">
                Exam Management
              </h1>
              <p className="text-[#25345D] text-lg">
                Create and manage exam schedules
              </p>
            </div>
            <Button
              onClick={handleCreateExam}
              className="bg-[#EAB308] text-[#25345D] hover:bg-[#F5C940] px-6"
            >
              Create Exam
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-[#25345D] mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#25345D] mb-2">
                Search
              </label>
              <Input
                type="text"
                placeholder="Search by course, invigilator, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25345D] mb-2">
                Batch
              </label>
              <Select
                value={filterBatch || undefined}
                onValueChange={setFilterBatch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All batches</SelectItem>
                  {batchOptions.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25345D] mb-2">
                Semester
              </label>
              <Select
                value={filterSemester || undefined}
                onValueChange={setFilterSemester}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All semesters</SelectItem>
                  {semesterOptions.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#25345D] mb-2">
                Exam Type
              </label>
              <Select
                value={filterExamType || undefined}
                onValueChange={setFilterExamType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {examTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Exam List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#25345D]">
              Exam Schedules ({filteredExams.length})
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredExams.length} of {exams.length} exams
            </div>
          </div>

          {filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-[#25345D] mb-2">
                No exams found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                (filterBatch && filterBatch !== "all") ||
                (filterSemester && filterSemester !== "all") ||
                (filterExamType && filterExamType !== "all")
                  ? "Try adjusting your filters"
                  : "Create your first exam schedule"}
              </p>
              {!searchTerm &&
                (!filterBatch || filterBatch === "all") &&
                (!filterSemester || filterSemester === "all") &&
                (!filterExamType || filterExamType === "all") && (
                  <Button
                    onClick={handleCreateExam}
                    className="bg-[#EAB308] text-[#25345D] hover:bg-[#F5C940]"
                  >
                    Create First Exam
                  </Button>
                )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#25345D]">
                          {exam.courseCode} - {exam.courseTitle}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getExamTypeColor(
                            exam.examType
                          )}`}
                        >
                          {exam.examType}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Batch:</span>{" "}
                          {exam.batch}
                        </div>
                        <div>
                          <span className="font-medium">Semester:</span>{" "}
                          {exam.semester}
                        </div>
                        <div>
                          <span className="font-medium">Room:</span> {exam.room}
                        </div>
                        <div>
                          <span className="font-medium">Invigilator:</span>{" "}
                          {exam.invigilator}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExam(exam)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExam(exam)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        📅 {formatDate(exam.date)}
                      </span>
                      <span className="text-gray-600">
                        ⏰ {exam.startTime} - {exam.endTime}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">ID: {exam.id}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

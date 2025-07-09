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
import type { ExamTimetable } from "@/types/scheduling";

interface ExamFormData {
  courseCode: string;
  courseTitle: string;
  batch: string;
  semester: string;
  examType: "Midterm" | "Final" | "Quiz";
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  invigilator: string;
}

interface ExamFormProps {
  exam?: ExamTimetable;
  onSubmit: (data: Omit<ExamTimetable, "id">) => void;
  onCancel: () => void;
}

export default function ExamForm({ exam, onSubmit, onCancel }: ExamFormProps) {
  const [formData, setFormData] = useState<ExamFormData>({
    courseCode: "",
    courseTitle: "",
    batch: "",
    semester: "",
    examType: "Midterm",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    invigilator: "",
  });

  const [errors, setErrors] = useState<Partial<ExamFormData>>({});

  useEffect(() => {
    if (exam) {
      setFormData({
        courseCode: exam.courseCode,
        courseTitle: exam.courseTitle,
        batch: exam.batch,
        semester: exam.semester,
        examType: exam.examType,
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
        room: exam.room,
        invigilator: exam.invigilator,
      });
    }
  }, [exam]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ExamFormData> = {};

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    }
    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = "Course title is required";
    }
    if (!formData.batch.trim()) {
      newErrors.batch = "Batch is required";
    }
    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }
    if (!formData.room.trim()) {
      newErrors.room = "Room is required";
    }
    if (!formData.invigilator.trim()) {
      newErrors.invigilator = "Invigilator is required";
    }

    // Validate time logic
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (start >= end) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ExamFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const batchOptions = ["27", "28", "29", "30", "31"];
  const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const examTypeOptions = ["Midterm", "Final", "Quiz"];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#25345D] mb-2">
          {exam ? "Edit Exam" : "Create New Exam"}
        </h2>
        <p className="text-gray-600">
          {exam
            ? "Update exam schedule details"
            : "Add a new exam to the schedule"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Code */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Course Code *
            </label>
            <Input
              type="text"
              value={formData.courseCode}
              onChange={(e) => handleInputChange("courseCode", e.target.value)}
              placeholder="e.g., CSE101"
              className={errors.courseCode ? "border-red-500" : ""}
            />
            {errors.courseCode && (
              <p className="text-red-500 text-sm mt-1">{errors.courseCode}</p>
            )}
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Course Title *
            </label>
            <Input
              type="text"
              value={formData.courseTitle}
              onChange={(e) => handleInputChange("courseTitle", e.target.value)}
              placeholder="e.g., Introduction to Computer Science"
              className={errors.courseTitle ? "border-red-500" : ""}
            />
            {errors.courseTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.courseTitle}</p>
            )}
          </div>

          {/* Batch */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Batch *
            </label>
            <Select
              value={formData.batch || undefined}
              onValueChange={(value) => handleInputChange("batch", value)}
            >
              <SelectTrigger className={errors.batch ? "border-red-500" : ""}>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batchOptions.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.batch && (
              <p className="text-red-500 text-sm mt-1">{errors.batch}</p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Semester *
            </label>
            <Select
              value={formData.semester || undefined}
              onValueChange={(value) => handleInputChange("semester", value)}
            >
              <SelectTrigger
                className={errors.semester ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesterOptions.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.semester && (
              <p className="text-red-500 text-sm mt-1">{errors.semester}</p>
            )}
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Exam Type *
            </label>
            <Select
              value={formData.examType || undefined}
              onValueChange={(value) =>
                handleInputChange(
                  "examType",
                  value as "Midterm" | "Final" | "Quiz"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                {examTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Date *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Start Time *
            </label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              className={errors.startTime ? "border-red-500" : ""}
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              End Time *
            </label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              className={errors.endTime ? "border-red-500" : ""}
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
            )}
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Room *
            </label>
            <Input
              type="text"
              value={formData.room}
              onChange={(e) => handleInputChange("room", e.target.value)}
              placeholder="e.g., 301"
              className={errors.room ? "border-red-500" : ""}
            />
            {errors.room && (
              <p className="text-red-500 text-sm mt-1">{errors.room}</p>
            )}
          </div>

          {/* Invigilator */}
          <div>
            <label className="block text-sm font-medium text-[#25345D] mb-2">
              Invigilator *
            </label>
            <Input
              type="text"
              value={formData.invigilator}
              onChange={(e) => handleInputChange("invigilator", e.target.value)}
              placeholder="e.g., Dr. John Smith"
              className={errors.invigilator ? "border-red-500" : ""}
            />
            {errors.invigilator && (
              <p className="text-red-500 text-sm mt-1">{errors.invigilator}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#EAB308] text-[#25345D] hover:bg-[#F5C940] px-6"
          >
            {exam ? "Update Exam" : "Create Exam"}
          </Button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CourseDetails } from "./components/CourseDetails";
import type {
  Course,
  CourseDegreeLevel,
  CourseSemester,
  CourseFilterOptions,
} from "../../types/course";
import { getCurrentUser } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import themeClasses from "../../lib/theme-utils";
import { 
  getCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from "../../lib/api";
import { classScheduleApi } from "../../lib/schedulingApi";

// Degree program data
const degreePrograms = [
  { id: "bsc-cse", title: "BSc in Computer Science and Engineering" },
  { id: "msc-cse", title: "MSc in Computer Science and Engineering" },
  {
    id: "pmics",
    title: "Professional Masters in Information and Cyber Security (PMICS)",
  },
  { id: "mphil-cse", title: "MPhil in Computer Science and Engineering" },
  { id: "phd-cse", title: "PhD in Computer Science and Engineering" },
];

export default function CoursesPage() {
  const { degreeId } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [degreeTitle, setDegreeTitle] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [instructors, setInstructors] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    description: string;
    credits: number;
    instructor: string;
    degreeLevel: CourseDegreeLevel;
    semester: CourseSemester;
    prerequisites: string[];
    topics: string[];
    objectives: string[];
    outcomes: string[];
  }>({
    code: "",
    name: "",
    description: "",
    credits: 3,
    instructor: "",
    degreeLevel: "undergraduate",
    semester: "1st",
    prerequisites: [],
    topics: [],
    objectives: [],
    outcomes: [],
  });

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Fetch courses from API
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters: CourseFilterOptions = {};
      
      if (searchQuery) filters.searchQuery = searchQuery;
      if (selectedDegreeLevel) filters.degreeLevel = selectedDegreeLevel as CourseDegreeLevel;
      if (selectedSemester) filters.semester = selectedSemester as CourseSemester;
      
      const response = await getCourses(filters);
      setCourses(response.data);
      setFilteredCourses(response.data);
      setTotalCount(response.total);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Set degree title when degree ID changes
  useEffect(() => {
    if (degreeId) {
      const degree = degreePrograms.find((d) => d.id === degreeId);
      setDegreeTitle(degree?.title || null);

      // Auto-select the degree level based on the degree ID
      if (degreeId === "bsc-cse") {
        setSelectedDegreeLevel("undergraduate");
      } else if (["msc-cse", "pmics", "mphil-cse"].includes(degreeId)) {
        setSelectedDegreeLevel("graduate");
      } else if (degreeId === "phd-cse") {
        setSelectedDegreeLevel("doctorate");
      }
    } else {
      setDegreeTitle(null);
    }
  }, [degreeId]);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [selectedDegreeLevel, selectedSemester, searchQuery, degreeId]);

  // Fetch instructors for dropdown
  const fetchInstructors = async () => {
    try {
      setLoadingInstructors(true);
      console.log("Fetching instructors...");
      const instructorsList = await classScheduleApi.getInstructors();
      console.log("Instructors fetched:", instructorsList);
      setInstructors(instructorsList);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError("Failed to load instructors. Please try again.");
    } finally {
      setLoadingInstructors(false);
    }
  };

  // Map instructor name to ID when editing and instructors are loaded
  useEffect(() => {
    if (editingCourse && instructors.length > 0 && formData.instructor) {
      // If instructor field contains a name, find the corresponding ID
      const instructorObj = instructors.find(
        (inst) => inst.name === formData.instructor || inst.id === formData.instructor
      );
      if (instructorObj && formData.instructor !== instructorObj.id) {
        setFormData(prev => ({ ...prev, instructor: instructorObj.id }));
      }
    }
  }, [instructors, editingCourse, formData.instructor]);

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  const handleDegreeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDegreeLevel(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResetFilters = () => {
    setSelectedSemester("");
    setSelectedDegreeLevel("");
    setSearchQuery("");
  };

  const handleCourseClick = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  // Admin: Add/Edit/Delete logic
  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      credits: 3,
      instructor: "",
      degreeLevel: "undergraduate",
      semester: "1st",
      prerequisites: [],
      topics: [],
      objectives: [],
      outcomes: [],
    });
    setIsModalOpen(true);
    fetchInstructors(); // Fetch instructors when opening modal
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      description: course.description,
      credits: course.credits,
      instructor: course.instructor || "",
      degreeLevel: course.degreeLevel as CourseDegreeLevel,
      semester: course.semester as CourseSemester,
      prerequisites: course.prerequisites || [],
      topics: course.topics || [],
      objectives: course.objectives || [],
      outcomes: course.outcomes || [],
    });
    setIsModalOpen(true);
    fetchInstructors(); // Fetch instructors when opening modal
  };

  const handleDeleteCourse = async (courseCode: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setIsLoading(true);
        await deleteCourse(courseCode);
        await fetchCourses(); // Refresh the list
      } catch (err) {
        console.error("Error deleting course:", err);
        setError("Failed to delete course. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const courseData = {
        course_code: formData.code,
        course_title: formData.name,
        course_description: formData.description,
        course_credits: formData.credits,
        degree_level: formData.degreeLevel,
        semester: formData.semester,
        instructor: formData.instructor,
        prerequisites: formData.prerequisites,
        topics: formData.topics,
        objectives: formData.objectives,
        learning_outcomes: formData.outcomes,
      };

      if (editingCourse) {
        // Edit existing course
        await updateCourse(editingCourse.code, courseData);
      } else {
        // Create new course
        await createCourse(courseData);
      }

      setIsModalOpen(false);
      setEditingCourse(null);
      await fetchCourses(); // Refresh the list
    } catch (err) {
      console.error("Error saving course:", err);
      setError(`Failed to ${editingCourse ? 'update' : 'create'} course. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {selectedCourse ? (
        <>
          <h1 className="mb-6">
            {degreeTitle ? `Course Details - ${degreeTitle}` : "Course Details"}
          </h1>
          <CourseDetails course={selectedCourse} onBack={handleBackToCourses} />
        </>
      ) : (
        <>
          <h1 className="mb-6">
            {degreeTitle ? `Courses for ${degreeTitle}` : "Course Catalog"}
          </h1>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="mb-6">
              <Button
                onClick={handleAddCourse}
                className={`${themeClasses.primaryButton} flex items-center gap-2`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Course
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filter sidebar */}
            <div className="md:col-span-1">
              <div className="bg-card p-4 rounded-lg border border-border">
                <h2 className="mb-4">Filters</h2>

                <div className="space-y-4">
                  {/* Search input */}
                  <div>
                    <label
                      htmlFor="search"
                      className="block mb-2 text-muted-foreground"
                    >
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search courses..."
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Degree Level filter */}
                  <div>
                    <label
                      htmlFor="degreeLevel"
                      className="block mb-2 text-muted-foreground"
                    >
                      Degree Level
                    </label>
                    <select
                      id="degreeLevel"
                      value={selectedDegreeLevel}
                      onChange={handleDegreeLevelChange}
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">All Levels</option>
                      <option value="undergraduate">Undergraduate (BSc)</option>
                      <option value="graduate">Graduate (MSc/MPhil)</option>
                      <option value="doctorate">Doctorate (PhD)</option>
                    </select>
                  </div>

                  {/* Semester filter */}
                  <div>
                    <label
                      htmlFor="semester"
                      className="block mb-2 text-muted-foreground"
                    >
                      Semester
                    </label>
                    <select
                      id="semester"
                      value={selectedSemester}
                      onChange={handleSemesterChange}
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">All Semesters</option>
                      <option value="1st">1st Semester</option>
                      <option value="2nd">2nd Semester</option>
                      <option value="3rd">3rd Semester</option>
                      <option value="4th">4th Semester</option>
                      <option value="5th">5th Semester</option>
                      <option value="6th">6th Semester</option>
                      <option value="7th">7th Semester</option>
                      <option value="8th">8th Semester</option>
                    </select>
                  </div>

                  {/* Reset button */}
                  <button
                    onClick={handleResetFilters}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-muted-foreground">Loading courses...</p>
                </div>
              ) : error ? (
                <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
                  <h3 className="mb-2">Error</h3>
                  <p className="text-muted-foreground text-center">{error}</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
                  <h3 className="mb-2">No courses found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your filters or search query to find what
                    you're looking for.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  {totalCount > 0 && (
                    <p className="mb-4 text-muted-foreground">
                      Showing {filteredCourses.length} of {totalCount} courses
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map((course) => (
                      <div key={course.id} className="relative group">
                        <div
                          onClick={() => handleCourseClick(course.id)}
                          className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer h-80 flex flex-col"
                        >
                          <div className="p-4 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-card-foreground">
                                {course.name}
                              </h3>
                              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                {course.code}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary-foreground rounded">
                                {course.degreeLevel === "undergraduate"
                                  ? "BSc"
                                  : course.degreeLevel === "graduate"
                                  ? "MSc/MPhil"
                                  : "PhD"}
                              </span>
                              <span className="px-2 py-1 text-xs bg-accent/20 text-accent-foreground rounded">
                                {course.semester} Semester
                              </span>
                              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                                {course.credits} Credits
                              </span>
                            </div>

                            <div className="flex-1 flex flex-col">
                              <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                                {course.description}
                              </p>

                              {course.prerequisites.length > 0 && (
                                <div className="mb-3 text-sm text-muted-foreground">
                                  <span className="font-medium">
                                    Prerequisites:
                                  </span>{" "}
                                  {course.prerequisites.join(", ")}
                                </div>
                              )}

                              <div className="flex justify-between items-center mt-auto">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCourseClick(course.id);
                                  }}
                                  className="text-primary hover:text-primary/80 text-sm"
                                >
                                  View Details →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCourse(course)}
                              className="bg-white hover:bg-gray-50"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCourse(course.code)}
                              className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CSE101"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Introduction to Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3"
                    min="1"
                    max="6"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Instructor
                  </label>
                  {loadingInstructors ? (
                    <div className="w-full p-2 border rounded bg-gray-50 text-gray-500">
                      Loading instructors...
                    </div>
                  ) : (
                    <select
                      value={formData.instructor}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select instructor</option>
                      {instructors.length > 0 ? (
                        instructors.map((instructor) => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.name} ({instructor.email})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No instructors available
                        </option>
                      )}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Degree Level
                  </label>
                  <select
                    value={formData.degreeLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        degreeLevel: e.target.value as CourseDegreeLevel,
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="doctorate">Doctorate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semester: e.target.value as CourseSemester,
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="3rd">3rd Semester</option>
                    <option value="4th">4th Semester</option>
                    <option value="5th">5th Semester</option>
                    <option value="6th">6th Semester</option>
                    <option value="7th">7th Semester</option>
                    <option value="8th">8th Semester</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Provide a detailed description of the course content, methodology, and learning approach..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prerequisites (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.prerequisites.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prerequisites: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mathematics 101, Physics 101, Computer Fundamentals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Topics (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.topics.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      topics: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Variables, Control Structures, Functions, Object-Oriented Programming"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Learning Objectives (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.objectives.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      objectives: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Understand programming concepts, Apply problem-solving skills, Develop coding proficiency"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Learning Outcomes (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.outcomes.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      outcomes: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Write efficient code, Debug programs, Design algorithms, Implement data structures"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className={themeClasses.primaryButton}>
                  {editingCourse ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

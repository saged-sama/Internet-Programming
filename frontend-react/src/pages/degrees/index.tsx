import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  DegreeFilterOptions,
  DegreeProgram,
  DegreeLevel,
  Curriculum,
} from "../../types/degree";
import type { Course } from "../../types/course";
import { DegreeCard } from "./components/DegreeCard";
import { DegreeFilter } from "./components/DegreeFilter";
import { getCurrentUser } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import themeClasses from "../../lib/theme-utils";
import {
  getDegreePrograms,
  createDegreeProgram,
  updateDegreeProgram,
  deleteDegreeProgram,
  getCourses,
} from "../../lib/api";

export default function DegreesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<DegreeFilterOptions>({});
  const [degrees, setDegrees] = useState<DegreeProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDegree, setEditingDegree] = useState<DegreeProgram | null>(
    null
  );
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coreCoursesDropdownOpen, setCoreCoursesDropdownOpen] = useState(false);
  const [electiveCoursesDropdownOpen, setElectiveCoursesDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    level: DegreeLevel;
    description: string;
    creditsRequired: number;
    duration: string;
    concentrations: string[];
    admissionRequirements: string[];
    careerOpportunities: string[];
    curriculum: Curriculum;
  }>({
    title: "",
    level: "undergraduate",
    description: "",
    creditsRequired: 0,
    duration: "",
    concentrations: [],
    admissionRequirements: [],
    careerOpportunities: [],
    curriculum: { coreCourses: [], electiveCourses: [] },
  });
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Fetch degree programs from API
  const fetchDegreePrograms = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getDegreePrograms(filter);
      
      // Sort degrees when no filter is applied
      let sortedDegrees = response.data;
      const hasFilters = Object.keys(filter).some(key => filter[key as keyof DegreeFilterOptions] !== undefined && filter[key as keyof DegreeFilterOptions] !== "");
      
      if (!hasFilters) {
        // Define degree level priority for sorting
        const levelPriority = { 'undergraduate': 1, 'graduate': 2, 'doctorate': 3 };
        
        sortedDegrees = [...response.data].sort((a, b) => {
          // First sort by degree level
          const levelDiff = levelPriority[a.level] - levelPriority[b.level];
          if (levelDiff !== 0) return levelDiff;
          
          // Then sort by title alphabetically
          return a.title.localeCompare(b.title);
        });
      }
      
      setDegrees(sortedDegrees);
      setTotalCount(response.total);
    } catch (err) {
      console.error("Error fetching degree programs:", err);
      setError("Failed to load degree programs. Please try again later.");
      setDegrees([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch degrees when filters change
  useEffect(() => {
    fetchDegreePrograms();
  }, [filter]);

  // Fetch available courses for dropdowns
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await getCourses();
      setAvailableCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setCoreCoursesDropdownOpen(false);
        setElectiveCoursesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDegreeClick = (degree: DegreeProgram) => {
    navigate(`/degrees/${degree.id}`);
  };

  const handleFilterChange = (newFilter: DegreeFilterOptions) => {
    setFilter(newFilter);
  };

  // Admin: Add/Edit/Delete logic
  const handleAddDegree = () => {
    setEditingDegree(null);
    setFormData({
      title: "",
      level: "undergraduate",
      description: "",
      creditsRequired: 0,
      duration: "",
      concentrations: [],
      admissionRequirements: [],
      careerOpportunities: [],
      curriculum: { coreCourses: [], electiveCourses: [] },
    });
    setIsModalOpen(true);
    fetchCourses(); // Fetch courses when opening modal
  };

  const handleEditDegree = (degree: DegreeProgram) => {
    setEditingDegree(degree);
    setFormData({
      title: degree.title,
      level: degree.level,
      description: degree.description,
      creditsRequired: degree.creditsRequired,
      duration: degree.duration,
      concentrations: degree.concentrations || [],
      admissionRequirements: degree.admissionRequirements || [],
      careerOpportunities: degree.careerOpportunities || [],
      curriculum: degree.curriculum || { coreCourses: [], electiveCourses: [] },
    });
    setIsModalOpen(true);
    fetchCourses(); // Fetch courses when opening modal
  };

  const handleDeleteDegree = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this degree program?")
    ) {
      try {
        setIsLoading(true);
        await deleteDegreeProgram(id);
        await fetchDegreePrograms(); // Refresh the list
      } catch (err) {
        console.error("Error deleting degree program:", err);
        setError("Failed to delete degree program. Please try again.");
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
      const programData = {
        id: editingDegree?.id || `${formData.level}-${Date.now()}`,
        title: formData.title,
        level: formData.level,
        description: formData.description,
        creditsRequired: formData.creditsRequired,
        duration: formData.duration,
        concentrations: formData.concentrations,
        admissionRequirements: formData.admissionRequirements,
        careerOpportunities: formData.careerOpportunities,
        curriculum: formData.curriculum,
      };

      if (editingDegree) {
        // Edit existing degree
        await updateDegreeProgram(editingDegree.id, programData);
      } else {
        // Create new degree
        await createDegreeProgram(programData);
      }

      setIsModalOpen(false);
      setEditingDegree(null);
      await fetchDegreePrograms(); // Refresh the list
    } catch (err) {
      console.error("Error saving degree program:", err);
      setError(`Failed to ${editingDegree ? 'update' : 'create'} degree program. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="mb-6">Degree Outlines</h1>
      {isAdmin && (
        <div className="mb-6">
          <Button
            onClick={handleAddDegree}
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
            Add New Degree
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <DegreeFilter filter={filter} onFilterChange={handleFilterChange} />
        </div>
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                Loading degree programs...
              </p>
            </div>
          ) : error ? (
            <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
              <h3 className="mb-2">Error</h3>
              <p className="text-muted-foreground text-center">{error}</p>
              <button
                onClick={() => setFilter({})}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          ) : degrees.length === 0 ? (
            <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
              <h3 className="mb-2">No programs found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your filters or search query to find what you're
                looking for.
              </p>
              <button
                onClick={() => setFilter({})}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {totalCount > 0 && (
                <p className="mb-4 text-muted-foreground">
                  Showing {degrees.length} of {totalCount} programs
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {degrees.map((degree) => (
                  <div key={degree.id} className="relative group">
                    <DegreeCard
                      degree={degree}
                      onClick={() => handleDegreeClick(degree)}
                    />
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDegree(degree)}
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
                          onClick={() => handleDeleteDegree(degree.id)}
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
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingDegree ? "Edit Degree Program" : "Add New Degree Program"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as DegreeLevel,
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
                    Credits Required
                  </label>
                  <input
                    type="number"
                    value={formData.creditsRequired}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creditsRequired: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 120"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4 years"
                    required
                  />
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
                  placeholder="Provide a comprehensive description of the degree program, including its objectives, scope, and unique features..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Goals (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.concentrations.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      concentrations: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Develop technical expertise, Foster innovation, Prepare industry leaders"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Admission Requirements (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.admissionRequirements.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      admissionRequirements: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., High school diploma, Minimum GPA 3.0, SAT/ACT scores"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Career Opportunities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.careerOpportunities.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      careerOpportunities: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Software Developer, System Analyst, Data Scientist, IT Manager"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">
                    Core Courses
                  </label>
                  {loadingCourses ? (
                    <div className="w-full p-2 border rounded bg-gray-50 text-gray-500">
                      Loading courses...
                    </div>
                  ) : (
                    <div className="relative dropdown-container">
                      <button
                        type="button"
                        onClick={() => setCoreCoursesDropdownOpen(!coreCoursesDropdownOpen)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {formData.curriculum.coreCourses.length > 0
                            ? "Core courses selected"
                            : "Select core courses"}
                        </span>
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
                            coreCoursesDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {formData.curriculum.coreCourses.length > 0 && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border">
                          <div className="text-xs text-gray-600 mb-1">Selected courses:</div>
                          <div className="flex flex-wrap gap-1">
                            {formData.curriculum.coreCourses.map((courseName, index) => {
                              const courseData = availableCourses.find(c => c.name === courseName);
                              return (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {courseData ? `${courseData.code} - ${courseData.name}` : courseName}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData({
                                        ...formData,
                                        curriculum: {
                                          ...formData.curriculum,
                                          coreCourses: formData.curriculum.coreCourses.filter(
                                            (c) => c !== courseName
                                          ),
                                        },
                                      });
                                    }}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {coreCoursesDropdownOpen && (
                        <div className="absolute z-8 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                          {availableCourses.length > 0 ? (
                            <div className="p-2 space-y-1">
                              {availableCourses.map((course) => (
                                <label
                                  key={course.id}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.curriculum.coreCourses.includes(course.name)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setFormData({
                                        ...formData,
                                        curriculum: {
                                          ...formData.curriculum,
                                          coreCourses: isChecked
                                            ? [...formData.curriculum.coreCourses, course.name]
                                            : formData.curriculum.coreCourses.filter(
                                                (c) => c !== course.name
                                              ),
                                        },
                                      });
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">
                                    {course.code} - {course.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm p-4">
                              No courses available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">
                    Elective Courses
                  </label>
                  {loadingCourses ? (
                    <div className="w-full p-2 border rounded bg-gray-50 text-gray-500">
                      Loading courses...
                    </div>
                  ) : (
                    <div className="relative dropdown-container">
                      <button
                        type="button"
                        onClick={() => setElectiveCoursesDropdownOpen(!electiveCoursesDropdownOpen)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {(formData.curriculum.electiveCourses?.length || 0) > 0
                            ? "Elective courses selected"
                            : "Select elective courses"}
                        </span>
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
                            electiveCoursesDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {(formData.curriculum.electiveCourses?.length || 0) > 0 && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border">
                          <div className="text-xs text-gray-600 mb-1">Selected courses:</div>
                          <div className="flex flex-wrap gap-1">
                            {formData.curriculum.electiveCourses?.map((courseName, index) => {
                              const courseData = availableCourses.find(c => c.name === courseName);
                              return (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                >
                                  {courseData ? `${courseData.code} - ${courseData.name}` : courseName}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData({
                                        ...formData,
                                        curriculum: {
                                          ...formData.curriculum,
                                          electiveCourses: (formData.curriculum.electiveCourses || []).filter(
                                            (c) => c !== courseName
                                          ),
                                        },
                                      });
                                    }}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            }) || []}
                          </div>
                        </div>
                      )}
                      {electiveCoursesDropdownOpen && (
                        <div className="absolute z-8 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                          {availableCourses.length > 0 ? (
                            <div className="p-2 space-y-1">
                              {availableCourses.map((course) => (
                                <label
                                  key={course.id}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.curriculum.electiveCourses?.includes(course.name) || false}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setFormData({
                                        ...formData,
                                        curriculum: {
                                          ...formData.curriculum,
                                          electiveCourses: isChecked
                                            ? [...(formData.curriculum.electiveCourses || []), course.name]
                                            : (formData.curriculum.electiveCourses || []).filter(
                                                (c) => c !== course.name
                                              ),
                                        },
                                      });
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">
                                    {course.code} - {course.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm p-4">
                              No courses available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                  {editingDegree ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

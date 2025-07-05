import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  DegreeFilterOptions,
  DegreeProgram,
  DegreeLevel,
  Curriculum,
} from "../../types/degree";
import { DegreeCard } from "./components/DegreeCard";
import { DegreeFilter } from "./components/DegreeFilter";
import { degreePrograms as initialDegreePrograms } from "./data/degreePrograms";
import { getCurrentUser } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import themeClasses from "../../lib/theme-utils";

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

  // Filter degrees data when filters change
  useEffect(() => {
    const filterDegrees = () => {
      setIsLoading(true);
      setError(null);
      try {
        let filtered = [...initialDegreePrograms];
        if (filter.level) {
          filtered = filtered.filter((degree) => degree.level === filter.level);
        }
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (degree) =>
              degree.title.toLowerCase().includes(query) ||
              degree.description.toLowerCase().includes(query) ||
              degree.concentrations?.some((c) =>
                c.toLowerCase().includes(query)
              ) ||
              degree.careerOpportunities.some((c) =>
                c.toLowerCase().includes(query)
              )
          );
        }
        const limit = filter.limit || filtered.length;
        const offset = filter.offset || 0;
        const paginatedData = filtered.slice(offset, offset + limit);
        setDegrees(paginatedData);
        setTotalCount(filtered.length);
      } catch (err) {
        setError("Failed to load degree programs. Please try again later.");
        setDegrees([]);
      } finally {
        setIsLoading(false);
      }
    };
    filterDegrees();
  }, [filter]);

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
  };

  const handleDeleteDegree = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this degree program?")
    ) {
      setDegrees(degrees.filter((degree) => degree.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDegree) {
      setDegrees(
        degrees.map((degree) =>
          degree.id === editingDegree.id
            ? { ...degree, ...formData, id: editingDegree.id }
            : degree
        )
      );
    } else {
      const newDegree: DegreeProgram = {
        id: Date.now().toString(),
        ...formData,
      };
      setDegrees([newDegree, ...degrees]);
    }
    setIsModalOpen(false);
    setEditingDegree(null);
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Concentrations (comma separated)
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
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Core Courses (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.curriculum.coreCourses.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        curriculum: {
                          ...formData.curriculum,
                          coreCourses: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Elective Courses (comma separated)
                  </label>
                  <input
                    type="text"
                    value={
                      formData.curriculum.electiveCourses?.join(", ") || ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        curriculum: {
                          ...formData.curriculum,
                          electiveCourses: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
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

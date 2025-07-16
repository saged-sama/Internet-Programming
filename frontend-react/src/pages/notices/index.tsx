import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import themeClasses from "../../lib/theme-utils";
import NoticeCard from "../../components/notices/NoticeCard";
import NoticeFilters from "../../components/notices/NoticeFilters";
import { getCurrentUser } from "../../lib/auth";
import { getNotices, createNotice, updateNotice, deleteNotice } from "../../lib/noticeApi";
import type { NoticeCategory } from "../../types/notice";
import { Pencil, Trash2 } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  date: string;
  category: Exclude<NoticeCategory, "All">;
  description: string;
  isImportant?: boolean;
}

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<NoticeCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic" as Exclude<NoticeCategory, "All">,
    isImportant: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  const categories: NoticeCategory[] = [
    "All",
    "Academic",
    "Administrative",
    "General",
    "Research",
  ];

  // Fetch notices from the backend
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const category = selectedCategory !== "All" ? selectedCategory : undefined;
        const response = await getNotices({ category });
        
        // Convert backend notice format to frontend notice format
        const formattedNotices = response.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          date: new Date(notice.notice_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          category: notice.category as Exclude<NoticeCategory, "All">,
          description: notice.description,
          isImportant: notice.is_important
        }));
        
        setNotices(formattedNotices);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
        setError("Failed to load notices. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [selectedCategory]);

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || notice.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  
  // Limit to 10 notices unless View Archive is clicked
  const displayedNotices = showAllNotices ? filteredNotices : filteredNotices.slice(0, 10);

  const handleAddNotice = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      description: "",
      category: "Academic",
      isImportant: false,
    });
    setIsModalOpen(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      isImportant: notice.isImportant || false,
    });
    setIsModalOpen(true);
  };

  const handleDeleteNotice = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setIsDeleting(true);
      setDeleteError(null);
      
      try {
        await deleteNotice(id);
        setNotices(notices.filter((notice) => notice.id !== id));
        // Clear any previous error since deletion was successful
        setDeleteError(null);
      } catch (err: any) {
        console.error("Failed to delete notice:", err);
        
        // Set error message based on error type
        if (err.message && err.message.includes('Unauthorized')) {
          setDeleteError("Unauthorized: You need to be logged in as an admin to delete notices.");
        } else {
          setDeleteError("Failed to delete notice. Please try again later.");
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingNotice) {
        // Edit existing notice
        const updatedNoticeData = {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          is_important: formData.isImportant
        };
        
        const updatedNotice = await updateNotice(editingNotice.id, updatedNoticeData);
        
        // Update the local state with the updated notice
        setNotices(
          notices.map((notice) =>
            notice.id === editingNotice.id ? {
              ...notice,
              title: updatedNotice.title,
              category: updatedNotice.category as Exclude<NoticeCategory, "All">,
              description: updatedNotice.description,
              isImportant: updatedNotice.is_important
            } : notice
          )
        );

        setIsModalOpen(false);
        setEditingNotice(null);
      } else {
        // Add new notice
        const newNoticeData = {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          is_important: formData.isImportant
        };
        
        const createdNotice = await createNotice(newNoticeData);
        
        // Add the new notice to the local state
        const newNotice: Notice = {
          id: createdNotice.id,
          title: createdNotice.title,
          date: new Date(createdNotice.notice_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          category: createdNotice.category as Exclude<NoticeCategory, "All">,
          description: createdNotice.description,
          isImportant: createdNotice.is_important
        };
        
        setNotices([newNotice, ...notices]);
        setIsModalOpen(false);
        setEditingNotice(null);
      }
    } catch (err: any) {
      console.error("Failed to save notice:", err);
      // Check for unauthorized error message
      if (err.message && err.message.includes('Unauthorized')) {
        setFormError("Unauthorized: You need to be logged in as an admin to perform this action.");
      } else {
        setFormError("Failed to save notice. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-lg">Loading notices...</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-12">
              <h1 className={themeClasses.textPrimary}>University Notices</h1>
              <p className={themeClasses.textPrimaryLight}>
                Stay updated with the latest announcements, academic updates, and
                administrative notices.
              </p>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="mb-6">
              <Button 
                onClick={handleAddNotice} 
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
                Add New Notice
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <NoticeFilters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory as (cat: string) => void}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Error message for delete operations */}
        {deleteError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm mb-4">
            {deleteError}
          </div>
        )}
        
        {/* Notices List */}
        <div className="space-y-6">
          {displayedNotices.length > 0 ? (
            displayedNotices.map((notice) => (
              <div key={notice.id} className="relative">
                <NoticeCard {...notice} />
                {isAdmin && (
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditNotice(notice)}
                      className="bg-white hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className={themeClasses.textPrimary}>No notices found</h3>
              <p>Try changing your search or filter criteria.</p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className={themeClasses.primaryButton}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
          
          {/* This section is no longer needed as we're using the Archive Section below */}
        </div>

        {/* Archive Section */}
        {!showAllNotices && filteredNotices.length > 10 && (
          <div className="mt-12 text-center">
            <h2>Looking for older notices?</h2>
            <Button
              variant="outline"
              className={themeClasses.outlineButton}
              onClick={() => setShowAllNotices(true)}
            >
              View Archive
            </Button>
          </div>
        )}
      </div>
    )}
    </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingNotice ? "Edit Notice" : "Add New Notice"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Exclude<
                        NoticeCategory,
                        "All"
                      >,
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="General">General</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={formData.isImportant}
                  onChange={(e) =>
                    setFormData({ ...formData, isImportant: e.target.checked })
                  }
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isImportant" className="text-sm font-medium text-gray-700">
                  Mark as Important
                </label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className={themeClasses.primaryButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                      {editingNotice ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingNotice ? "Update" : "Add"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

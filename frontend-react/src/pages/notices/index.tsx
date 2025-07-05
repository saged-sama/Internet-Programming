import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import themeClasses from "../../lib/theme-utils";
import NoticeCard from "../../components/notices/NoticeCard";
import NoticeFilters from "../../components/notices/NoticeFilters";
import noticesData from "../../assets/notices.json";
import { getCurrentUser } from "../../lib/auth";

type NoticeCategory =
  | "All"
  | "Academic"
  | "Administrative"
  | "General"
  | "Research";

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
  const [notices, setNotices] = useState<Notice[]>(noticesData as Notice[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic" as Exclude<NoticeCategory, "All">,
    isImportant: false,
  });

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  const categories: NoticeCategory[] = [
    "All",
    "Academic",
    "Administrative",
    "General",
    "Research",
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === "All" || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleDeleteNotice = (id: number) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter((notice) => notice.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNotice) {
      // Edit existing notice
      setNotices(
        notices.map((notice) =>
          notice.id === editingNotice.id ? { ...notice, ...formData } : notice
        )
      );
    } else {
      // Add new notice
      const newNotice: Notice = {
        id: Date.now(), // Simple ID generation
        ...formData,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
      setNotices([newNotice, ...notices]);
    }

    setIsModalOpen(false);
    setEditingNotice(null);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className={themeClasses.textPrimary}>University Notices</h1>
          <p className={themeClasses.textPrimaryLight}>
            Stay updated with the latest announcements, academic updates, and
            administrative notices.
          </p>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="mt-6">
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

        {/* Notices List */}
        <div className="space-y-6">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div key={notice.id} className="relative">
                <NoticeCard {...notice} />
                {isAdmin && (
                  <div className="absolute top-12 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditNotice(notice)}
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
                      onClick={() => handleDeleteNotice(notice.id)}
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
            ))
          ) : (
            <div className="text-center py-12">
              <svg
                className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
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
        </div>

        {/* Archive Section */}
        <div className="mt-12 text-center">
          <h2>Looking for older notices?</h2>
          <Button
            variant="outline"
            className={themeClasses.outlineButton}
            asChild
          >
            <Link to="/notices/archive">View Archive</Link>
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingNotice ? "Edit Notice" : "Add New Notice"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="mr-2"
                />
                <label htmlFor="isImportant" className="text-sm">
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
                <Button type="submit" className={themeClasses.primaryButton}>
                  {editingNotice ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

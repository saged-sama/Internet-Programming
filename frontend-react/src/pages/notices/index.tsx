import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import themeClasses, { themeValues } from '../../lib/theme-utils';

type NoticeCategory = 'All' | 'Academic' | 'Administrative' | 'General' | 'Research';

interface Notice {
  id: number;
  title: string;
  date: string;
  category: Exclude<NoticeCategory, 'All'>;
  description: string;
  isImportant?: boolean;
}

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - in a real application, this would come from an API
  const notices: Notice[] = [
    {
      id: 1,
      title: "Fall Semester Registration",
      date: "June 15, 2025",
      category: "Academic",
      description: "Registration for the Fall 2025 semester is now open. Please check your student portal for details.",
      isImportant: true
    },
    {
      id: 2,
      title: "New Research Grant",
      date: "June 10, 2025",
      category: "Research",
      description: "The university has received a $2M grant for AI research. Applications for research assistants are now open."
    },
    {
      id: 3,
      title: "Campus Renovation Notice",
      date: "June 5, 2025",
      category: "Administrative",
      description: "The main library will be closed for renovations from June 20 to July 5. Alternative study spaces will be available."
    },
    {
      id: 4,
      title: "Student Council Elections",
      date: "June 8, 2025",
      category: "General",
      description: "Nominations for student council positions are now open. Submit your application by June 15."
    },
    {
      id: 5,
      title: "Midterm Examination Schedule",
      date: "June 12, 2025",
      category: "Academic",
      description: "The midterm examination schedule has been published. Please check the academic calendar for details.",
      isImportant: true
    },
    {
      id: 6,
      title: "Faculty Research Symposium",
      date: "June 7, 2025",
      category: "Research",
      description: "The annual faculty research symposium will be held on June 25. All faculty members are encouraged to participate."
    },
    {
      id: 7,
      title: "New Cafeteria Hours",
      date: "June 3, 2025",
      category: "Administrative",
      description: "The university cafeteria will now be open from 7:00 AM to 9:00 PM on weekdays."
    },
    {
      id: 8,
      title: "Summer Internship Opportunities",
      date: "June 1, 2025",
      category: "General",
      description: "Various summer internship opportunities are available. Visit the career center for more information."
    }
  ];

  const categories: NoticeCategory[] = ['All', 'Academic', 'Administrative', 'General', 'Research'];

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>University Notices</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest announcements, academic updates, and administrative notices.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notices..."
                  className={`w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[${themeValues.colors.primary}]`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg 
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Notices List */}
          <div className="space-y-6">
            {filteredNotices.length > 0 ? (
              filteredNotices.map(notice => (
                <div 
                  key={notice.id} 
                  className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
                    notice.isImportant ? `border-[${themeValues.colors.accentYellow}]` : `border-[${themeValues.colors.primary}]`
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          notice.category === 'Academic' ? `${themeClasses.bgPrimaryLight} bg-opacity-20 ${themeClasses.textPrimary}` :
                          notice.category === 'Administrative' ? `${themeClasses.bgPrimary} bg-opacity-20 ${themeClasses.textPrimary}` :
                          notice.category === 'General' ? `${themeClasses.bgAccentYellowLight} bg-opacity-20 ${themeClasses.textPrimary}` :
                          `${themeClasses.bgAccentYellow} bg-opacity-20 ${themeClasses.textPrimary}`
                        }`}>
                          {notice.category}
                        </span>
                        {notice.isImportant && (
                          <span className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellow} px-2.5 py-0.5 text-xs font-medium ${themeClasses.textPrimary}`}>
                            Important
                          </span>
                        )}
                      </div>
                      <h3 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>{notice.title}</h3>
                      <p className="text-gray-600 mb-4">{notice.description}</p>
                      <Button variant="link" className={`p-0 ${themeClasses.textAccentYellow} hover:opacity-80`} asChild>
                        <Link to={`/notices/${notice.id}`}>Read more</Link>
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">{notice.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className={`mt-2 text-lg font-medium ${themeClasses.textPrimary}`}>No notices found</h3>
                <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
                <div className="mt-6">
                  <Button onClick={() => {setSelectedCategory('All'); setSearchQuery('');}} className={themeClasses.primaryButton}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Archive Section */}
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">Looking for older notices?</h2>
            <Button variant="outline" className={themeClasses.outlineButton} asChild>
              <Link to="/notices/archive">View Archive</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

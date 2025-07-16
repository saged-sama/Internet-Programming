import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';
import { getNotices } from '../../../lib/noticeApi';
import type { Notice } from '../../../types/notice';
import { Loader2 } from 'lucide-react';

// Sample fallback data in case API fails
const fallbackAnnouncements = [
  {
    id: 1,
    title: 'Fall Semester Registration',
    notice_date: '2025-07-10',
    category: 'Academic',
    description: 'Registration for Fall 2025 semester begins on August 1st. Please check the portal for your assigned registration slot.',
    is_important: true
  },
  {
    id: 2,
    title: 'Faculty Research Symposium',
    notice_date: '2025-07-12',
    category: 'Research',
    description: 'Annual faculty research symposium will be held on July 25th in the main auditorium. All students are welcome to attend.',
    is_important: false
  },
  {
    id: 3,
    title: 'Campus Maintenance Notice',
    notice_date: '2025-07-15',
    category: 'Administrative',
    description: 'The north campus parking lot will be closed for maintenance from July 20-22. Please use alternative parking areas.',
    is_important: true
  }
];

export default function AnnouncementsSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        // Get important notices first, limited to 3
        const response = await getNotices({ limit: 3 });
        setNotices(response);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
        setError('Failed to load announcements');
        // Use fallback data if API fails
        setNotices(fallbackAnnouncements);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center">
          Important Announcements
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <AnnouncementCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button variant="outline" className={themeClasses.outlineButton} asChild>
            <Link to="/notices">View All Notices</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function AnnouncementCard({ notice }: { notice: Notice }) {
  // Format the date for display
  const formattedDate = new Date(notice.notice_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`bg-card p-6 rounded-lg shadow-sm border-t-4 ${notice.is_important ? themeClasses.borderPrimary : 'border-gray-200'} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellowLight} px-3 py-1 text-xs font-medium ${themeClasses.textPrimary}`}>
          {notice.category}
        </span>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>
      <h3 className="mb-2">
        {notice.title}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">{notice.description}</p>
      <Button variant="link" className={`p-0 ${themeClasses.textPrimary} ${themeClasses.hoverTextPrimary}`} asChild>
        <Link to={`/notices/${notice.id}`}>Read more</Link>
      </Button>
    </div>
  );
}

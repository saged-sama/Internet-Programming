import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';
import departmentAnnouncements from '../../../assets/announcements.json';

interface Announcement {
  title: string;
  date: string;
  category: string;
  description: string;
}

export default function AnnouncementsSection() {
  return (
    <section className="py-12 bg-card">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="mb-8 text-center">
      Important Announcements
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {departmentAnnouncements.map((announcement: Announcement, index: number) => (
        <AnnouncementCard key={index} announcement={announcement} />
      ))}
    </div>
    <div className="mt-8 text-center">
      <Button variant="outline" className={themeClasses.outlineButton} asChild>
        <Link to="/notices">View All Notices</Link>
      </Button>
    </div>
  </div>
</section>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div className={`bg-card p-6 rounded-lg shadow-sm border-t-4 ${themeClasses.borderPrimary} hover:shadow-md transition-shadow`}>
  <div className="flex justify-between items-start mb-4">
    <span className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellowLight} px-3 py-1 font-medium ${themeClasses.textPrimary}`}>
      {announcement.category}
    </span>
    <span className="text-muted-foreground">{announcement.date}</span>
  </div>
  <h3 className="mb-2">
    {announcement.title}
  </h3>
  <p className="mb-4 text-muted-foreground">{announcement.description}</p>
  <Button variant="link" className={`p-0 ${themeClasses.textPrimary} ${themeClasses.hoverTextPrimary}`} asChild>
    <Link to="/notices">Read more</Link>
  </Button>
</div>
  );
}

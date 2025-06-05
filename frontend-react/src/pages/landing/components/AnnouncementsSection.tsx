import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';

interface Announcement {
  title: string;
  date: string;
  category: string;
  description: string;
}

const announcements: Announcement[] = [
  {
    title: "Fall 2025 Registration Now Open",
    date: "June 1, 2025",
    category: "Academic",
    description: "Registration for Fall 2025 semester is now open for CSE students. Please log in to the student portal to register for courses."
  },
  {
    title: "New Research Collaboration Opportunities",
    date: "May 28, 2025",
    category: "Research",
    description: "The department has established new research collaborations with leading international universities. Applications for joint research projects are now being accepted."
  },
  {
    title: "Lab Facility Updates",
    date: "May 25, 2025",
    category: "Facilities",
    description: "The Computer Systems Lab will be upgraded with new equipment from June 15 to June 30. Alternative lab spaces will be available during this period."
  }
];

export default function AnnouncementsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-3xl font-bold mb-8 text-center ${themeClasses.textPrimary}`}>
          Important Announcements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((announcement, index) => (
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
    <div className={`bg-white p-6 rounded-lg shadow-sm border-t-4 ${themeClasses.borderPrimary} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellowLight} bg-opacity-20 px-2.5 py-0.5 text-xs font-medium ${themeClasses.textPrimary}`}>
          {announcement.category}
        </span>
        <span className="text-sm text-gray-500">{announcement.date}</span>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>
        {announcement.title}
      </h3>
      <p className="text-gray-600 mb-4">{announcement.description}</p>
      <Button variant="link" className={`p-0 ${themeClasses.textPrimary} ${themeClasses.hoverTextPrimary}`} asChild>
        <Link to="/notices">Read more</Link>
      </Button>
    </div>
  );
}

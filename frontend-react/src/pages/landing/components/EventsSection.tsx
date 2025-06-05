import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

const events: Event[] = [
  {
    title: "CSE Orientation Day",
    date: "August 25, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "CSE Auditorium",
    image: "https://placehold.co/300x200?text=CSE+Orientation"
  },
  {
    title: "Workshop: Modern Web Technologies",
    date: "June 15, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "CSE Building, Lab 305",
    image: "https://placehold.co/300x200?text=Web+Workshop"
  },
  {
    title: "Annual CSE Research Symposium",
    date: "July 10-12, 2025",
    time: "All Day",
    location: "DU Conference Center",
    image: "https://placehold.co/300x200?text=CSE+Research"
  }
];

export default function EventsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>
            Departmental Events
          </h2>
          <Button variant="outline" className={themeClasses.outlineButton} asChild>
            <Link to="/events">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface EventCardProps {
  event: Event;
  index: number;
}

function EventCard({ event, index }: EventCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border-t-4 ${themeClasses.borderPrimary} overflow-hidden hover:shadow-md transition-shadow`}>
      <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
      <div className="p-6">
        <h3 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>
          {event.title}
        </h3>
        <EventDetail 
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          text={event.date}
        />
        <EventDetail 
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          text={event.time}
        />
        <EventDetail 
          icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          text={event.location}
          className="mb-4"
        />
        <Button className={themeClasses.primaryButton} asChild>
          <Link to={`/events/${index + 1}`}>Register Now</Link>
        </Button>
      </div>
    </div>
  );
}

interface EventDetailProps {
  icon: string;
  text: string;
  className?: string;
}

function EventDetail({ icon, text, className = "mb-1" }: EventDetailProps) {
  return (
    <div className={`flex items-center text-gray-600 ${className}`}>
      <svg 
        className={`w-4 h-4 mr-2 ${themeClasses.textAccentYellow}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span>{text}</span>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';
import eventsData from '../../../assets/eventsData.json';
import EventCard from '../../../components/events/EventCard';



export default function EventsSection() {
  return (
    <section className="py-16 bg-card">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center mb-8">
      <h2 className="${themeClasses.textPrimary}">Departmental Events</h2>
      <Button variant="outline" className={themeClasses.outlineButton} asChild>
        <Link to="/events">View All</Link>
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventsData.events.slice(0, 3).map((event: any) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
</section>
  );
}
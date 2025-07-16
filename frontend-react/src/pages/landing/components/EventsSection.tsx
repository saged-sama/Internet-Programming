import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';
import EventCard from '../../../components/events/EventCard';
import { useState, useEffect } from 'react';
import { getEvents } from '../../../api/events';
import type { Event } from '../../../api/events';



export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents({ limit: 3 });
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className={themeClasses.textPrimary}>Departmental Events</h2>
          <Button variant="outline" className={themeClasses.outlineButton} asChild>
            <Link to="/events">View All</Link>
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
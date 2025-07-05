import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

import eventsData from '../../assets/eventsData.json';
import EventFilters from '../../components/events/EventFilters';
import EventsGrid from '../../components/events/EventsGrid';
import EmptyEventsState from '../../components/events/EmptyEventsState';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Import data from JSON file
  const events: Event[] = eventsData.events as Event[];
  const categories = eventsData.categories;

  const filteredEvents = events.filter(event => {
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
  
      <div className="bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="mb-4">Upcoming Events</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Discover and register for upcoming events, workshops, and activities at the university.
            </p>
          </div>

          {/* Filters */}
          <EventFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Events Grid or Empty State */}
          {filteredEvents.length > 0 ? (
            <EventsGrid events={filteredEvents} />
          ) : (
            <EmptyEventsState onReset={() => { setSelectedCategory(null); setSearchQuery(''); }} />
          )}

          {/* Calendar View Section */}
          <div className="mt-16 text-center">
            <h2 className="mb-4">Prefer a calendar view?</h2>
            <Button variant="outline" asChild>
              <Link to="/events/calendar">View Calendar</Link>
            </Button>
          </div>
        </div>
      </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import themeClasses, { themeValues } from '../../lib/theme-utils';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Academic' | 'Cultural' | 'Sports' | 'Workshop' | 'Conference';
  description: string;
  image: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Mock data - in a real application, this would come from an API
  const events: Event[] = [
    {
      id: 1,
      title: "Annual Tech Symposium",
      date: "June 20, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Main Auditorium",
      category: "Conference",
      description: "Join us for a day of cutting-edge technology discussions, demos, and networking opportunities with industry leaders.",
      image: "https://placehold.co/600x400?text=Tech+Symposium",
      registrationRequired: true,
      registrationDeadline: "June 15, 2025"
    },
    {
      id: 2,
      title: "Career Fair 2025",
      date: "June 25, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Student Center",
      category: "Academic",
      description: "Connect with over 50 companies offering internships and full-time positions for students and recent graduates.",
      image: "https://placehold.co/600x400?text=Career+Fair",
      registrationRequired: true,
      registrationDeadline: "June 20, 2025"
    },
    {
      id: 3,
      title: "Research Presentation Day",
      date: "July 5, 2025",
      time: "1:00 PM - 5:00 PM",
      location: "Science Building",
      category: "Academic",
      description: "Undergraduate and graduate students present their research projects to faculty and peers.",
      image: "https://placehold.co/600x400?text=Research+Day",
      registrationRequired: false
    },
    {
      id: 4,
      title: "Cultural Night",
      date: "July 10, 2025",
      time: "6:00 PM - 10:00 PM",
      location: "University Amphitheater",
      category: "Cultural",
      description: "An evening celebrating cultural diversity with performances, food, and activities from around the world.",
      image: "https://placehold.co/600x400?text=Cultural+Night",
      registrationRequired: false
    },
    {
      id: 5,
      title: "AI Workshop Series",
      date: "July 15-17, 2025",
      time: "9:00 AM - 12:00 PM",
      location: "Computer Science Building, Room 301",
      category: "Workshop",
      description: "A three-day workshop on artificial intelligence fundamentals, machine learning, and practical applications.",
      image: "https://placehold.co/600x400?text=AI+Workshop",
      registrationRequired: true,
      registrationDeadline: "July 10, 2025"
    },
    {
      id: 6,
      title: "Inter-University Sports Tournament",
      date: "July 20-25, 2025",
      time: "Various times",
      location: "University Sports Complex",
      category: "Sports",
      description: "Annual sports competition featuring teams from universities across the country competing in various sports.",
      image: "https://placehold.co/600x400?text=Sports+Tournament",
      registrationRequired: true,
      registrationDeadline: "July 1, 2025"
    }
  ];

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Workshop', 'Conference'];

  const filteredEvents = events.filter(event => {
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover and register for upcoming events, workshops, and activities at the university.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category || (!selectedCategory && category === 'All') ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[${themeValues.colors.primary}]"
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

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div key={event.id} className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col border border-gray-200 hover:shadow-lg transition-shadow hover:border-[${themeValues.colors.accentYellow}]`}>
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellow} ${themeClasses.textPrimary} text-xs font-semibold px-2 py-1`}>
                        {event.category}
                      </span>
                      {event.registrationRequired && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Registration Required
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>{event.title}</h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    {event.registrationRequired && event.registrationDeadline && (
                      <p className="text-sm text-gray-500 mb-4">
                        Registration deadline: {event.registrationDeadline}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <Button variant="outline" className={themeClasses.outlineButton} asChild>
                        <Link to={`/events/${event.id}`}>View Details</Link>
                      </Button>
                      {event.registrationRequired && (
                        <Button className={themeClasses.primaryButton} asChild>
                          <Link to={`/events/${event.id}/register`}>Register</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={`mt-2 text-lg font-medium ${themeClasses.textPrimary}`}>No events found</h3>
              <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
              <div className="mt-6">
                <Button onClick={() => {setSelectedCategory(null); setSearchQuery('');}} className={themeClasses.primaryButton}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}

          {/* Calendar View Section */}
          <div className="mt-16 text-center">
            <h2 className="text-xl font-semibold mb-4">Prefer a calendar view?</h2>
            <Button variant="outline" asChild>
              <Link to="/events/calendar">View Calendar</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

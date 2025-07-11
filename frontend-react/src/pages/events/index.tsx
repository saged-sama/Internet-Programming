import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { getCurrentUser } from "../../lib/auth";
import themeClasses from "../../lib/theme-utils";
import EventFilters from "../../components/events/EventFilters";
import EmptyEventsState from "../../components/events/EmptyEventsState";
import { type Event, type EventFilters as EventFilterParams, getEvents, createEvent, updateEvent, deleteEvent } from "../../api/events";

// Using the Event interface from the API
interface EventFormData {
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  registration_required: boolean;
  registration_deadline: string;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Workshop', 'Conference'];
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    category: "",
    description: "",
    image: "",
    registration_required: false,
    registration_deadline: "",
  });

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300); // 300ms debounce delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Fetch events when category changes (no debounce needed)
  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const filters: EventFilterParams = {
        skip: 0,
        limit: 100
      };

      if (searchQuery) {
        filters.search_query = searchQuery;
      }

      if (selectedCategory && selectedCategory !== 'All') {
        filters.category = selectedCategory;
      }

      const response = await getEvents(filters);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  // No need to filter events locally as the API handles filtering

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      event_date: "",
      start_time: "",
      end_time: "",
      location: "",
      category: categories[1] || "", // Skip 'All' and use the first real category
      description: "",
      image: "",
      registration_required: false,
      registration_deadline: "",
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    
    // Format times by removing seconds if present
    const formatTime = (timeStr: string | null) => {
      if (!timeStr) return "";
      // If time has seconds (HH:MM:SS), remove the seconds part
      return timeStr.split(':').slice(0, 2).join(':');
    };
    
    setFormData({
      title: event.title,
      event_date: event.event_date,
      start_time: formatTime(event.start_time),
      end_time: formatTime(event.end_time),
      location: event.location || "",
      category: event.category,
      description: event.description || "",
      image: event.image || "",
      registration_required: event.registration_required,
      // Ensure registration_deadline is in YYYY-MM-DD format for the date input
      registration_deadline: event.registration_deadline || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        // Refresh events after deletion
        fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format the data to match API requirements
      const formattedData = {
        ...formData,
        // Format start_time to match API expectations (HH:MM:SS format without timezone)
        start_time: formData.start_time ? `${formData.start_time}:00` : '00:00:00',
        // Format end_time to match API expectations (HH:MM:SS format without timezone)
        end_time: formData.end_time ? `${formData.end_time}:00` : '00:00:00',
        // Handle registration_deadline (already in YYYY-MM-DD format from date input)
        registration_deadline: formData.registration_required 
          ? (formData.registration_deadline || formData.event_date) // Use event date as fallback
          : null // If registration not required, set to null
      };

      // Log the data being sent to help with debugging
      console.log('Sending event data:', formattedData);

      if (editingEvent) {
        // Edit existing event
        await updateEvent(editingEvent.id, formattedData);
        console.log('Event updated successfully');
      } else {
        // Add new event
        await createEvent(formattedData);
        console.log('Event created successfully');
      }

      // Refresh events after submission
      fetchEvents();
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (err: any) {
      console.error('Error saving event:', err);
      
      // Provide more detailed error information if available
      if (err.response) {
        console.error('Error response:', err.response.data);
        alert(`Failed to save event: ${err.response.data.detail || 'Please check your form data and try again.'}`);
      } else {
        alert('Failed to save event. Please try again.');
      }
    }
  };

  return (
    <div className="bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="mb-4">Upcoming Events</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Discover and register for upcoming events, workshops, and activities
            at the university.
          </p>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="mt-6">
              <Button
                onClick={handleAddEvent}
                className={themeClasses.primaryButton}
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Add New Event
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <EventFilters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={fetchEvents}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="relative">
                <div
                  className={`bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col border ${themeClasses.borderPrimary} hover:shadow-lg transition-shadow ${themeClasses.hoverBorderAccentYellow}`}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellow} ${themeClasses.textPrimary} text-xs font-semibold px-2 py-1`}
                      >
                        {event.category}
                      </span>
                      {event.registration_required && (
                        <span className="inline-flex items-center rounded-full bg-destructive/20 px-2.5 py-0.5 font-medium text-destructive">
                          Registration Required
                        </span>
                      )}
                    </div>
                    <h3 className={`mb-2 ${themeClasses.textPrimary}`}>
                      {event.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground mb-1">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{event.event_date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-1">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{event.start_time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    {event.registration_required &&
                      event.registration_deadline && (
                        <p className="text-muted mb-4">
                          Registration deadline: {event.registration_deadline}
                        </p>
                      )}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className={themeClasses.outlineButton}
                        asChild
                      >
                        <Link to={`/events/${event.id}`}>View Details</Link>
                      </Button>
                      {event.registration_required && (
                        <Button className={themeClasses.primaryButton} asChild>
                          <Link to={`/events/${event.id}/register`}>
                            Register
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="absolute top-12 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEvent(event)}
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
                      onClick={() => handleDeleteEvent(event.id)}
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
            ))}
          </div>
        ) : (
          <EmptyEventsState
            onReset={() => {
              setSelectedCategory(null);
              setSearchQuery("");
            }}
          />
        )}

        {/* Calendar View Section */}
        <div className="mt-16 text-center">
          <h2 className="mb-4">Prefer a calendar view?</h2>
          <Button variant="outline" asChild>
            <Link to="/events/calendar">View Calendar</Link>
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
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
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registrationRequired"
                  checked={formData.registration_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registration_required: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="registrationRequired" className="text-sm">
                  Registration Required
                </label>
              </div>
              {formData.registration_required && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Registration Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.registration_deadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_deadline: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required={formData.registration_required}
                  />
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className={themeClasses.primaryButton}>
                  {editingEvent ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

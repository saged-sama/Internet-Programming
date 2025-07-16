import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { getCurrentUser } from "../../lib/auth";
import themeClasses from "../../lib/theme-utils";
import EventFilters from "../../components/events/EventFilters";
import EmptyEventsState from "../../components/events/EmptyEventsState";
import EventCalendar from "../../components/events/EventCalendar";
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
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
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

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = useCallback(async (customDateRange?: { start: Date | null; end: Date | null }) => {
    setLoading(true);
    setError(null);

    try {
      const filters: EventFilterParams = {};
      
      if (searchQuery) {
        filters.search_query = searchQuery;
      }
      
      if (selectedCategory && selectedCategory !== 'All') {
        filters.category = selectedCategory;
      }

      // Add date range filters if in calendar view
      // Use customDateRange if provided, otherwise use the state dateRange
      const rangeToUse = customDateRange || dateRange;
      
      // Debug the date range being used
      console.log('Date range being used:', rangeToUse);
      
      if (rangeToUse.start && rangeToUse.end) {
        // Format dates properly for API - YYYY-MM-DD format
        const startDate = rangeToUse.start;
        const endDate = rangeToUse.end;
        
        // Format as YYYY-MM-DD
        filters.start_date = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
        filters.end_date = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        
        console.log('Formatted date filters:', filters.start_date, filters.end_date);
      } else {
        console.log('No date range provided');
      }

      console.log('Sending API request with filters:', filters);
      const response = await getEvents(filters);
      console.log('API response:', response);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError("Failed to fetch events. Please try again later.");
      // Fallback to empty array
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, dateRange]);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    // Format times by removing seconds if present
    const formatTime = (timeStr: string | null) => {
      return timeStr ? timeStr.replace(/:\d{2}$/, '') : '';
    };

    setEditingEvent(event);
    setFormData({
      title: event.title,
      event_date: event.event_date,
      start_time: formatTime(event.start_time),
      end_time: formatTime(event.end_time),
      location: event.location,
      category: event.category,
      description: event.description,
      image: event.image,
      registration_required: event.registration_required,
      registration_deadline: event.registration_deadline || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(event => event.id !== id));
      } catch (err) {
        console.error('Error deleting event:', err);
        setError("Failed to delete event. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEvent) {
        const updatedEvent = await updateEvent(editingEvent.id, formData);
        setEvents(events.map(event => 
          event.id === editingEvent.id ? updatedEvent : event
        ));
      } else {
        const newEvent = await createEvent(formData);
        setEvents([...events, newEvent]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving event:', err);
      setError("Failed to save event. Please check your inputs and try again.");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    
    // Reset date range based on view mode
    if (viewMode === 'calendar') {
      // For calendar view, set date range to current month
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setDateRange({ start, end });
      setCurrentCalendarDate(today);
      fetchEvents({ start, end });
    } else {
      // For grid view, clear date range
      setDateRange({ start: null, end: null });
      fetchEvents({ start: null, end: null });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className={`text-3xl font-bold mb-4 md:mb-0 ${themeClasses.textPrimary}`}>
            Events
          </h1>
          {isAdmin && (
            <Button
              onClick={handleAddEvent}
              className={themeClasses.primaryButton}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Event
            </Button>
          )}
        </div>

        <EventFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          viewMode={viewMode}
          setViewMode={(mode) => {
            setViewMode(mode);
            
            // Reset date range based on new view mode
            if (mode === 'calendar') {
              const today = new Date();
              const start = new Date(today.getFullYear(), today.getMonth(), 1);
              const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              setDateRange({ start, end });
              setCurrentCalendarDate(today);
              fetchEvents({ start, end });
            } else {
              // For grid view, reset date filters to show all events
              setDateRange({ start: null, end: null });
              fetchEvents({ start: null, end: null });
            }
          }}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Calendar View - Always show calendar even if no events */}
        {!loading && viewMode === 'calendar' && (
          <div className="mb-8">
            <EventCalendar 
              events={events}
              defaultDate={currentCalendarDate}
              onDateRangeChange={(start, end) => {
                setCurrentCalendarDate(start);
                setDateRange({ start, end });
                fetchEvents({ start, end });
              }}
            />
          </div>
        )}
        
        {/* Grid View with Events */}
        {!loading && viewMode === 'grid' && events.length > 0 && (
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
                        <span>
                          {event.start_time} - {event.end_time}
                        </span>
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
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="mt-auto flex justify-between items-center">
                        <Link
                          to={`/events/${event.id}`}
                          className={`inline-flex items-center ${themeClasses.textAccentYellow} hover:underline`}
                        >
                          View Details
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>

                        {/* Admin Controls */}
                        {isAdmin && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              aria-label="Edit event"
                            >
                              <svg
                                className="w-5 h-5"
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
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              aria-label="Delete event"
                            >
                              <svg
                                className="w-5 h-5"
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
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
        
        {/* Empty State for Grid View */}
        {!loading && viewMode === 'grid' && events.length === 0 && (
          <EmptyEventsState onReset={resetFilters} />
        )}

        {/* Event Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
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
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Event Date <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories
                        .filter((cat) => cat !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      End Time <span className="text-red-500">*</span>
                    </label>
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
                <div className="mt-4">
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
                <div className="mt-4 flex items-center">
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
                  <div className="mt-4">
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
                <div className="mt-6 flex gap-2 justify-end">
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
    </div>
  );
}

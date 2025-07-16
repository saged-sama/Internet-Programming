import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import themeClasses from '../../lib/theme-utils';
import type { Event } from '../../api/events';

interface EventCalendarProps {
  events: Event[];
  onDateRangeChange?: (start: Date, end: Date) => void;
  defaultDate?: Date;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Event;
}

const localizer = momentLocalizer(moment);

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onDateRangeChange, defaultDate }) => {
  // State to track the current date for navigation
  const [currentDate, setCurrentDate] = React.useState<Date>(defaultDate || new Date());
  
  // Convert events to calendar events
  const calendarEvents = useMemo(() => {
    return events.map(event => {
      const [year, month, day] = event.event_date.split('-').map(Number);
      const [startHour, startMinute] = event.start_time.split(':').map(Number);
      const [endHour, endMinute] = event.end_time.split(':').map(Number);
      
      const start = new Date(year, month - 1, day, startHour, startMinute);
      const end = new Date(year, month - 1, day, endHour, endMinute);
      
      return {
        id: event.id,
        title: event.title,
        start,
        end,
        allDay: false,
        resource: event
      };
    });
  }, [events]);

  // Custom event component to display event details
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="p-1 overflow-hidden">
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs">{event.resource.location}</div>
    </div>
  );

  // Custom toolbar component with direct navigation actions
  const CustomToolbar = (toolbar: any) => {
    // Access the parent component's onDateRangeChange function
    const parentOnDateRangeChange = onDateRangeChange;
    const goToCurrent = () => {
      const today = new Date();
      toolbar.onNavigate('TODAY');
      setCurrentDate(today);
      
      // Manually trigger the onDateRangeChange if available
      if (parentOnDateRangeChange) {
        // Get first day of the current month (1st)
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        // Get last day of the current month (28th, 30th, 31st depending on month)
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        console.log('Calendar today - date range:', { start, end });
        parentOnDateRangeChange(start, end);
      }
    };
    
    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span className="text-lg font-semibold">{date.format('MMMM YYYY')}</span>
      );
    };
    
    // Direct navigation handlers for buttons
    const handlePrevMonth = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newDate = new Date(toolbar.date);
      newDate.setMonth(newDate.getMonth() - 1);
      toolbar.onNavigate('DATE', newDate);
      setCurrentDate(newDate);
      
      // Manually trigger the onDateRangeChange if available
      if (parentOnDateRangeChange) {
        // Get first day of the month (1st)
        const start = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        // Get last day of the month (28th, 30th, 31st depending on month)
        const end = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        console.log('Calendar prev month - date range:', { start, end });
        parentOnDateRangeChange(start, end);
      }
    };
    
    const handleNextMonth = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newDate = new Date(toolbar.date);
      newDate.setMonth(newDate.getMonth() + 1);
      // Force a date change by using the proper navigation action
      toolbar.onNavigate('DATE', newDate);
      // Update our internal state
      setCurrentDate(newDate);
      
      // Manually trigger the onDateRangeChange if available
      if (parentOnDateRangeChange) {
        // Get first day of the month (1st)
        const start = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        // Get last day of the month (28th, 30th, 31st depending on month)
        const end = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        console.log('Calendar next month - date range:', { start, end });
        parentOnDateRangeChange(start, end);
      }
    };

    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex-grow text-center">
          {label()}
        </div>
        <div>
          <button
            onClick={goToCurrent}
            className={`px-3 py-1 rounded text-sm ${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`}
          >
            Today
          </button>
        </div>
      </div>
    );
  };

  // Custom event styling
  const eventStyleGetter = (event: CalendarEvent) => {
    const category = event.resource.category;
    let backgroundColor = '';
    
    switch (category) {
      case 'Academic':
        backgroundColor = '#DBEAFE'; // blue-100
        break;
      case 'Cultural':
        backgroundColor = '#DCFCE7'; // green-100
        break;
      case 'Sports':
        backgroundColor = '#FEF9C3'; // yellow-100
        break;
      case 'Workshop':
        backgroundColor = '#E0E7FF'; // indigo-100
        break;
      case 'Conference':
        backgroundColor = '#FCE7F3'; // pink-100
        break;
      default:
        backgroundColor = '#F3F4F6'; // gray-100
    }
    
    return {
      style: {
        backgroundColor,
        color: '#1F2937', // gray-800
        border: '1px solid',
        borderColor: event.resource.registration_required ? '#DC2626' : '#9CA3AF', // red-600 : gray-400
        borderRadius: '4px',
      }
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        date={currentDate}
        components={{
          event: EventComponent as any,
          toolbar: CustomToolbar as any,
        }}
        eventPropGetter={eventStyleGetter}
        views={['month']}
        popup
        selectable
        onNavigate={(date) => {
          setCurrentDate(date);
          // Ensure date range changes are triggered when navigating months
          if (onDateRangeChange) {
            // Get first day of the month (1st)
            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            // Get last day of the month (28th, 30th, 31st depending on month)
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            console.log('Calendar onNavigate - date range:', { start, end });
            onDateRangeChange(start, end);
          }
        }}
        onRangeChange={(range) => {
          if (onDateRangeChange && range) {
            // Handle different range types returned by react-big-calendar
            if (Array.isArray(range)) {
              // For week/day view
              console.log('Calendar onRangeChange (array) - date range:', { start: range[0], end: range[range.length - 1] });
              onDateRangeChange(range[0], range[range.length - 1]);
            } else {
              // For month view
              console.log('Calendar onRangeChange (object) - date range:', { start: range.start, end: range.end });
              onDateRangeChange(range.start, range.end);
            }
          }
        }}
      />
    </div>
  );
};

export default EventCalendar;

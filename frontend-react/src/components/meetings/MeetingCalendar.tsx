import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import themeClasses from '../../lib/theme-utils';
import type { Meeting } from '../../api/meetings';

interface MeetingCalendarProps {
  meetings: Meeting[];
  onDateRangeChange?: (start: Date, end: Date) => void;
  defaultDate?: Date;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Meeting;
}

const localizer = momentLocalizer(moment);

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({ meetings, onDateRangeChange, defaultDate }) => {
  // State to track the current date for navigation
  const [currentDate, setCurrentDate] = React.useState<Date>(defaultDate || new Date());
  // Convert meetings to calendar events
  const events = useMemo(() => {
    return meetings.map(meeting => {
      const [year, month, day] = meeting.meeting_date.split('-').map(Number);
      const [startHour, startMinute] = meeting.start_time.split(':').map(Number);
      const [endHour, endMinute] = meeting.end_time.split(':').map(Number);
      
      const start = new Date(year, month - 1, day, startHour, startMinute);
      const end = new Date(year, month - 1, day, endHour, endMinute);
      
      return {
        id: meeting.id,
        title: meeting.title,
        start,
        end,
        allDay: false,
        resource: meeting
      };
    });
  }, [meetings]);

  // Custom event component to display meeting details
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
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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
      const start = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const end = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
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
      const start = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const end = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
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
    const meetingType = event.resource.type;
    let backgroundColor = '';
    
    switch (meetingType) {
      case 'Faculty':
        backgroundColor = '#DBEAFE'; // blue-100
        break;
      case 'Department':
        backgroundColor = '#DCFCE7'; // green-100
        break;
      case 'Student':
        backgroundColor = '#FEF9C3'; // yellow-100
        break;
      case 'Administrative':
        backgroundColor = '#F3F4F6'; // gray-100
        break;
      default:
        backgroundColor = '#F3F4F6'; // gray-100
    }
    
    return {
      style: {
        backgroundColor,
        color: '#1F2937', // gray-800
        border: '1px solid',
        borderColor: event.resource.is_registration_required ? '#DC2626' : '#9CA3AF', // red-600 : gray-400
        borderRadius: '4px',
      }
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        date={currentDate}
        components={{
          event: EventComponent as any,
          toolbar: CustomToolbar as any,
        }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        popup
        selectable
        onNavigate={(date) => {
          setCurrentDate(date);
          // Ensure date range changes are triggered when navigating months
          if (onDateRangeChange) {
            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            onDateRangeChange(start, end);
          }
        }}
        onRangeChange={(range) => {
          if (onDateRangeChange && range) {
            // Handle different range types returned by react-big-calendar
            if (Array.isArray(range)) {
              // For week/day view
              onDateRangeChange(range[0], range[range.length - 1]);
            } else {
              // For month view
              onDateRangeChange(range.start, range.end);
            }
          }
        }}
      />
    </div>
  );
};

export default MeetingCalendar;

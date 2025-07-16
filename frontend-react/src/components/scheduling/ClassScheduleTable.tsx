import type { ClassSchedule } from '@/types/scheduling';
import { useState } from 'react';

interface ClassScheduleTableProps {
  schedules: ClassSchedule[];
}

interface TimeSlot {
  time: string;
  displayTime: string;
}

export default function ClassScheduleTable({ schedules }: ClassScheduleTableProps) {
  const [viewMode, setViewMode] = useState<'timetable' | 'list'>('timetable');

  if (schedules.length === 0) {
    return (
      <div className="bg-card p-8 rounded-lg shadow-sm border text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-muted-foreground text-lg">No schedules found with the selected filters.</p>
        <p className="text-muted-foreground/70 text-sm mt-2">Try adjusting your filters or clearing them to see more results.</p>
      </div>
    );
  }

  // Define days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Define time slots (8:00 AM to 6:00 PM)
  const timeSlots: TimeSlot[] = [
    { time: '08:00', displayTime: '8:00 AM' },
    { time: '09:00', displayTime: '9:00 AM' },
    { time: '10:00', displayTime: '10:00 AM' },
    { time: '11:00', displayTime: '11:00 AM' },
    { time: '12:00', displayTime: '12:00 PM' },
    { time: '13:00', displayTime: '1:00 PM' },
    { time: '14:00', displayTime: '2:00 PM' },
    { time: '15:00', displayTime: '3:00 PM' },
    { time: '16:00', displayTime: '4:00 PM' },
    { time: '17:00', displayTime: '5:00 PM' },
    { time: '18:00', displayTime: '6:00 PM' },
  ];

  // Group schedules by day and time
  const scheduleGrid: { [key: string]: { [key: string]: ClassSchedule[] } } = {};

  days.forEach(day => {
    scheduleGrid[day] = {};
    timeSlots.forEach(slot => {
      scheduleGrid[day][slot.time] = [];
    });
  });

  // Populate the grid with schedules
  schedules.forEach(schedule => {
    const startHour = schedule.startTime.split(':')[0];
    const timeKey = `${startHour.padStart(2, '0')}:00`;
    
    if (scheduleGrid[schedule.day] && scheduleGrid[schedule.day][timeKey]) {
      scheduleGrid[schedule.day][timeKey].push(schedule);
    }
  });

  // Calculate duration in time slots
  const getClassDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    return Math.max(1, Math.round(duration));
  };

  const TimetableView = () => (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 bg-primary">
            <div className="p-4 font-semibold text-center border-r border-primary-foreground/20 text-primary-foreground">
              Time
            </div>
            {days.map(day => (
              <div key={day} className="p-4 font-semibold text-center border-r border-primary-foreground/20 last:border-r-0 text-primary-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map(slot => (
            <div key={slot.time} className="grid grid-cols-8 border-b border-border">
              <div className="p-3 text-sm font-medium text-center bg-muted/30 border-r border-border text-primary">
                {slot.displayTime}
              </div>
              {days.map(day => (
                <div key={`${day}-${slot.time}`} className="p-2 border-r border-border last:border-r-0 min-h-[80px] bg-card">
                  {scheduleGrid[day][slot.time].map((schedule) => {
                    const duration = getClassDuration(schedule.startTime, schedule.endTime);
                    return (
                      <div
                        key={schedule.id}
                        className="mb-1 p-3 rounded-lg text-xs bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50 transition-all duration-200 cursor-pointer group"
                        style={{ minHeight: `${Math.max(duration * 25, 60)}px` }}
                      >
                        <div className="font-semibold text-primary mb-1">{schedule.courseCode}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2 mb-1 group-hover:text-foreground transition-colors">
                          {schedule.courseTitle}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          <span className="font-medium">Room:</span> {schedule.room}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2 line-clamp-1">
                          {schedule.instructor}
                        </div>
                        <div className="text-xs font-medium text-secondary">
                          Batch {schedule.batch} • Sem {schedule.semester}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ListView = () => (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary">
            <tr>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Course Code</th>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Course Title</th>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Batch</th>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Semester</th>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Room</th>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Day</th>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Time</th>
              <th className="px-6 py-4 text-left text-primary-foreground font-semibold">Instructor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-secondary/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-primary">{schedule.courseCode}</td>
                <td className="px-6 py-4 text-foreground">{schedule.courseTitle}</td>
                <td className="px-6 py-4">
                  <span className="bg-chart-1/10 text-chart-1 px-3 py-1 rounded-full text-xs font-medium border border-chart-1/20">
                    Batch {schedule.batch}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium border border-secondary/20">
                    Sem {schedule.semester}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-chart-2/10 text-chart-2 px-3 py-1 rounded-full text-xs font-medium border border-chart-2/20">
                    {schedule.room}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-primary">{schedule.day}</td>
                <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                  {schedule.startTime} - {schedule.endTime}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{schedule.instructor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="bg-muted/30 rounded-lg p-1 flex border shadow-sm">
          <button
            onClick={() => setViewMode('timetable')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'timetable'
                ? 'bg-secondary text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary hover:bg-secondary/10'
            }`}
          >
            📅 Timetable View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-secondary text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary hover:bg-secondary/10'
            }`}
          >
            📋 List View
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'timetable' ? <TimetableView /> : <ListView />}
    </div>
  );
}

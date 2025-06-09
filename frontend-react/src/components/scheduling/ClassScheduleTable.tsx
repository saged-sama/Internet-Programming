import type { ClassSchedule } from '@/types/scheduling';

interface ClassScheduleTableProps {
  schedules: ClassSchedule[];
}

export default function ClassScheduleTable({ schedules }: ClassScheduleTableProps) {
  if (schedules.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm text-center">
        <p className="text-muted-foreground">No schedules found with the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-muted-foreground">Course Code</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Course Title</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Batch</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Semester</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Room</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Day</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Instructor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">{schedule.courseCode}</td>
                <td className="px-4 py-3">{schedule.courseTitle}</td>
                <td className="px-4 py-3">{schedule.batch}</td>
                <td className="px-4 py-3">{schedule.semester}</td>
                <td className="px-4 py-3">{schedule.room}</td>
                <td className="px-4 py-3">{schedule.day}</td>
                <td className="px-4 py-3">
                  {schedule.startTime} - {schedule.endTime}
                </td>
                <td className="px-4 py-3">{schedule.instructor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

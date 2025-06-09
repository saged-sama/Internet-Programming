import type { ExamTimetable } from '@/types/scheduling';
import { format } from 'date-fns';

interface ExamTimetableTableProps {
  exams: ExamTimetable[];
}

export default function ExamTimetableTable({ exams }: ExamTimetableTableProps) {
  if (exams.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm text-center">
        <p className="text-muted-foreground">No exam timetables match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="py-3 px-4 text-left font-medium">Course</th>
              <th className="py-3 px-4 text-left font-medium">Batch</th>
              <th className="py-3 px-4 text-left font-medium">Semester</th>
              <th className="py-3 px-4 text-left font-medium">Exam Type</th>
              <th className="py-3 px-4 text-left font-medium">Date</th>
              <th className="py-3 px-4 text-left font-medium">Time</th>
              <th className="py-3 px-4 text-left font-medium">Room</th>
              <th className="py-3 px-4 text-left font-medium">Invigilator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="font-medium">{exam.courseCode}</div>
                  <div className="text-muted-foreground text-sm">{exam.courseTitle}</div>
                </td>
                <td className="py-3 px-4">Batch {exam.batch}</td>
                <td className="py-3 px-4">Semester {exam.semester}</td>
                <td className="py-3 px-4">{exam.examType}</td>
                <td className="py-3 px-4">
                  {format(new Date(exam.date), 'MMM dd, yyyy')}
                </td>
                <td className="py-3 px-4">
                  {exam.startTime} - {exam.endTime}
                </td>
                <td className="py-3 px-4">{exam.room}</td>
                <td className="py-3 px-4">{exam.invigilator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

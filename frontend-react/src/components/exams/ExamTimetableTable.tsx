import type { ExamTimetable } from '@/types/scheduling';
import { format } from 'date-fns';
import { useState } from 'react';

interface ExamTimetableTableProps {
  exams: ExamTimetable[];
}

export default function ExamTimetableTable({ exams }: ExamTimetableTableProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  if (exams.length === 0) {
    return (
      <div className="bg-card p-8 rounded-lg shadow-sm border text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-muted-foreground text-lg">No exam timetables match your filters.</p>
        <p className="text-muted-foreground/70 text-sm mt-2">Try adjusting your filters or clearing them to see more results.</p>
      </div>
    );
  }

  // Get exam type styling
  const getExamTypeBadge = (examType: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border";
    
    switch (examType) {
      case 'Midterm':
        return `${baseClasses} bg-chart-4/10 text-chart-4 border-chart-4/20`;
      case 'Final':
        return `${baseClasses} bg-chart-5/10 text-chart-5 border-chart-5/20`;
      case 'Quiz':
        return `${baseClasses} bg-chart-1/10 text-chart-1 border-chart-1/20`;
      default:
        return `${baseClasses} bg-secondary/10 text-secondary border-secondary/20`;
    }
  };

  // Group exams by date for timeline view
  const groupExamsByDate = () => {
    const grouped: { [key: string]: ExamTimetable[] } = {};
    
    exams.forEach(exam => {
      const dateKey = exam.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(exam);
    });

    // Sort exams within each date by start time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    // Return sorted dates
    return Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => ({
        date,
        exams: grouped[date]
      }));
  };

  const TimelineView = () => {
    const examsByDate = groupExamsByDate();

    return (
      <div className="space-y-6">
        {examsByDate.map(({ date, exams: dateExams }) => (
          <div key={date} className="bg-card rounded-lg shadow-sm border overflow-hidden">
            {/* Date Header */}
            <div className="bg-primary p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm">
                    {dateExams.length} exam{dateExams.length > 1 ? 's' : ''} scheduled
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl">📅</div>
                </div>
              </div>
            </div>

            {/* Exams for this date */}
            <div className="p-4">
              <div className="grid gap-4">
                {dateExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 hover:bg-secondary/10 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Time & Duration */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg">⏰</span>
                        </div>
                        <div>
                          <div className="font-semibold text-primary">
                            {exam.startTime} - {exam.endTime}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(() => {
                              const start = new Date(`1970-01-01T${exam.startTime}:00`);
                              const end = new Date(`1970-01-01T${exam.endTime}:00`);
                              const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                              return `${duration}h duration`;
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div>
                        <div className="font-semibold text-primary text-lg">
                          {exam.courseCode}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {exam.courseTitle}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-chart-1/10 text-chart-1 px-2 py-1 rounded-full text-xs font-medium border border-chart-1/20">
                            Batch {exam.batch}
                          </span>
                          <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium border border-secondary/20">
                            Sem {exam.semester}
                          </span>
                        </div>
                      </div>

                      {/* Exam Details */}
                      <div>
                        <div className="mb-2">
                          <span className={getExamTypeBadge(exam.examType)}>
                            {exam.examType}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-chart-2">📍</span>
                            <span className="bg-chart-2/10 text-chart-2 px-2 py-1 rounded-full text-xs font-medium border border-chart-2/20">
                              Room {exam.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Invigilator */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Invigilator:</div>
                        <div className="font-medium text-primary">
                          {exam.invigilator}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TableView = () => (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Course</th>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Batch</th>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Semester</th>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Exam Type</th>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Date</th>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Time</th>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Room</th>
              <th className="py-4 px-6 text-left font-semibold text-primary-foreground">Invigilator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-secondary/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-semibold text-primary">{exam.courseCode}</div>
                  <div className="text-muted-foreground text-sm mt-1">{exam.courseTitle}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-chart-1/10 text-chart-1 px-3 py-1 rounded-full text-xs font-medium border border-chart-1/20">
                    Batch {exam.batch}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium border border-secondary/20">
                    Sem {exam.semester}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={getExamTypeBadge(exam.examType)}>
                    {exam.examType}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-primary">
                    {format(new Date(exam.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(exam.date), 'EEEE')}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-mono text-sm text-muted-foreground">
                    {exam.startTime} - {exam.endTime}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(() => {
                      const start = new Date(`1970-01-01T${exam.startTime}:00`);
                      const end = new Date(`1970-01-01T${exam.endTime}:00`);
                      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      return `${duration}h duration`;
                    })()}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-chart-2/10 text-chart-2 px-3 py-1 rounded-full text-xs font-medium border border-chart-2/20">
                    {exam.room}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-muted-foreground">
                    {exam.invigilator}
                  </div>
                </td>
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
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'timeline'
                ? 'bg-secondary text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary hover:bg-secondary/10'
            }`}
          >
            📅 Timeline View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-secondary text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary hover:bg-secondary/10'
            }`}
          >
            📋 Table View
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'timeline' ? <TimelineView /> : <TableView />}
    </div>
  );
}

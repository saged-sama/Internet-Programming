import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ClassScheduleFilter from '@/components/scheduling/ClassScheduleFilter';
import ClassScheduleTable from '@/components/scheduling/ClassScheduleTable';
import type { ClassSchedule } from '@/types/scheduling';
import classScheduleData from '@/assets/classSchedule.json';

export default function ClassSchedulePage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ClassSchedule[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    // Load schedules from JSON data
    const loadedSchedules = classScheduleData as ClassSchedule[];
    setSchedules(loadedSchedules);
    setFilteredSchedules(loadedSchedules);

    // Extract unique room values only (batches and semesters are now predefined)
    const uniqueRooms = [...new Set(loadedSchedules.map((schedule) => schedule.room))];
    setRooms(uniqueRooms);
  }, []);

  const handleFilterChange = (filters: { batch: string; semester: string; room: string }) => {
    let filtered = [...schedules];

    if (filters.batch) {
      filtered = filtered.filter((schedule) => schedule.batch === filters.batch);
    }

    if (filters.semester) {
      filtered = filtered.filter((schedule) => schedule.semester === filters.semester);
    }

    if (filters.room) {
      filtered = filtered.filter((schedule) => schedule.room === filters.room);
    }

    setFilteredSchedules(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2">Weekly Class Schedule</h1>
          <p className="text-muted-foreground">
            View and filter class schedules by batch, semester, and room.
          </p>
        </div>

        <ClassScheduleFilter
          rooms={rooms}
          onFilterChange={handleFilterChange}
        />

        <ClassScheduleTable schedules={filteredSchedules} />
      </div>
    </Layout>
  );
}

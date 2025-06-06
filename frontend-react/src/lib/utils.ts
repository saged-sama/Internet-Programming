import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Meeting utilities
import type { Meeting } from '../components/meetings/MeetingCard';

export function filterMeetings(
  meetings: Meeting[],
  selectedType: string,
  selectedDate: string,
  searchQuery: string
): Meeting[] {
  return meetings.filter(meeting => {
    const matchesType = selectedType === 'All' || meeting.type === selectedType;
    const matchesDate = !selectedDate || meeting.date === selectedDate;
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesDate && matchesSearch;
  });
}

export function groupMeetingsByDate(meetings: Meeting[]): Record<string, Meeting[]> {
  return meetings.reduce((acc: Record<string, Meeting[]>, meeting: Meeting) => {
    if (!acc[meeting.date]) {
      acc[meeting.date] = [];
    }
    acc[meeting.date].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);
}

export function getSortedDates(meetingsByDate: Record<string, Meeting[]>): string[] {
  return Object.keys(meetingsByDate).sort();
}

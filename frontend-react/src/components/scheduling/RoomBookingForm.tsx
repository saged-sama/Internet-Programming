import { useState } from 'react';
import type { BookingFormData, RoomAvailability } from '@/types/scheduling';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

interface RoomBookingFormProps {
  room: RoomAvailability | null;
  onSubmit: (formData: BookingFormData) => void;
  onCancel: () => void;
}

export default function RoomBookingForm({ room, onSubmit, onCancel }: RoomBookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    room: room ? room.room : '',
    requestedBy: '',
    email: '',
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: 0,
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) || 0 : value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        date: formattedDate,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!room) return null;

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <h3 className="mb-4 text-primary">Book Room {room.room}</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="requestedBy" className="block mb-2 text-muted-foreground">
              Name
            </label>
            <Input
              id="requestedBy"
              name="requestedBy"
              value={formData.requestedBy}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-muted-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="purpose" className="block mb-2 text-muted-foreground">
            Purpose
          </label>
          <Input
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-muted-foreground">Date</label>
            <div className="border border-input rounded-md p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
                className="rounded-md"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="attendees" className="block mb-2 text-muted-foreground">
                Number of Attendees
              </label>
              <Input
                id="attendees"
                name="attendees"
                type="number"
                min="1"
                max={room.capacity}
                value={formData.attendees || ''}
                onChange={handleInputChange}
                required
              />
              <p className="text-muted-foreground text-xs mt-1">
                Maximum capacity: {room.capacity}
              </p>
            </div>
            <div>
              <label htmlFor="startTime" className="block mb-2 text-muted-foreground">
                Start Time
              </label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block mb-2 text-muted-foreground">
                End Time
              </label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
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
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Reset form when room changes
  useEffect(() => {
    if (room) {
      setFormData({
        room: room.room,
        requestedBy: '',
        email: '',
        purpose: '',
        date: '',
        startTime: '',
        endTime: '',
        attendees: 0,
      });
      setSelectedDate(undefined);
      setSelectedSlot('');
    }
  }, [room]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) || 0 : value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    try {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        date: formattedDate,
        }));
      } else {
        // Clear the date when no date is selected
        setFormData((prev) => ({
          ...prev,
          date: '',
        }));
      }
    } catch (error) {
      console.error('Error handling date change:', error);
    }
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotValue = e.target.value;
    setSelectedSlot(slotValue);
    
    if (slotValue) {
      // Parse the slot value to extract start and end time
      // Format: "day-startTime-endTime" (e.g., "Monday-09:00-10:00")
      const [_, startTime, endTime] = slotValue.split('-');
      setFormData((prev) => ({
        ...prev,
        startTime,
        endTime,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        startTime: '',
        endTime: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Generate slot options from room availability data
  const generateSlotOptions = () => {
    if (!room?.availableSlots) return [];
    
    const options: { value: string; label: string }[] = [];
    
    room.availableSlots.forEach((daySlot) => {
      daySlot.slots.forEach((slot) => {
        const value = `${daySlot.day}-${slot.startTime}-${slot.endTime}`;
        const label = `${daySlot.day} (${slot.startTime} - ${slot.endTime})`;
        options.push({ value, label });
      });
    });
    
    return options;
  };

  if (!room) return null;

  const slotOptions = generateSlotOptions();

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
            <div className="border border-input rounded-md p-2 bg-background">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                className="rounded-md w-full"
                defaultMonth={new Date()}
                fixedWeeks
              />
            </div>
            <div className="mt-2 p-2 bg-muted/30 rounded-md border">
              <p className="text-sm text-muted-foreground">Selected date:</p>
              <p className="text-sm font-medium text-primary">
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'No date selected'
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Form date: {formData.date || 'Not set'}
              </p>
              <button
                type="button"
                onClick={() => handleDateChange(new Date())}
                className="mt-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
              >
                Test: Select Today
              </button>
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
              <label htmlFor="timeSlot" className="block mb-2 text-muted-foreground">
                Available Time Slots
              </label>
              <select
                id="timeSlot"
                value={selectedSlot}
                onChange={handleSlotChange}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Select a time slot</option>
                {slotOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {slotOptions.length === 0 && (
                <p className="text-muted-foreground text-xs mt-1">
                  No available slots for this room
                </p>
              )}
            </div>
            {selectedSlot && (
              <div className="p-3 bg-muted/30 rounded-md border">
                <p className="text-sm text-muted-foreground mb-1">Selected slot:</p>
                <p className="text-sm font-medium text-primary">
                  {formData.startTime} - {formData.endTime}
                </p>
            </div>
            )}
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

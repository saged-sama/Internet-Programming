import { useState, useEffect } from 'react';
import RoomAvailabilityCard from '@/components/scheduling/RoomAvailabilityCard';
import RoomBookingForm from '@/components/scheduling/RoomBookingForm';
import type { RoomAvailability, BookingFormData } from '@/types/scheduling';
import roomAvailabilityData from '@/assets/roomAvailability.json';

export default function RoomAvailabilityPage() {
  const [rooms, setRooms] = useState<RoomAvailability[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomAvailability | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Load room availability data
    const loadedRooms = roomAvailabilityData as RoomAvailability[];
    setRooms(loadedRooms);
  }, []);

  const handleBookRoom = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId) || null;
    setSelectedRoom(room);
    setShowBookingForm(true);
    setBookingSuccess(false);
    // Scroll to booking form
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingSubmit = (formData: BookingFormData) => {
    // In a real application, this would send the data to a backend API
    console.log('Booking submitted:', formData);
    
    // Show success message and hide form
    setBookingSuccess(true);
    setShowBookingForm(false);
    
    // Scroll to success message
    setTimeout(() => {
      document.getElementById('booking-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2">Room Availability</h1>
          <p className="text-muted-foreground">
            Check room availability and submit booking requests for available time slots.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {rooms.map((room) => (
            <RoomAvailabilityCard key={room.id} room={room} onBookRoom={handleBookRoom} />
          ))}
        </div>

        {showBookingForm && (
          <div id="booking-form" className="mt-8 pt-4 border-t border-border">
            <RoomBookingForm
              room={selectedRoom}
              onSubmit={handleBookingSubmit}
              onCancel={handleCancelBooking}
            />
          </div>
        )}

        {bookingSuccess && (
          <div
            id="booking-result"
            className="mt-8 p-6 bg-card rounded-lg shadow-sm border-l-4 border-accent"
          >
            <h3 className="text-primary mb-2">Booking Request Submitted</h3>
            <p className="text-muted-foreground">
              Your room booking request has been submitted successfully. The request will be reviewed
              by an administrator and you will be notified of the decision.
            </p>
          </div>
        )}
      </div>
  );
}

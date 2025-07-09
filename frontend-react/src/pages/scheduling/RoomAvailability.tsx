import { useState, useEffect } from 'react';
import RoomAvailabilityCard from '@/components/scheduling/RoomAvailabilityCard';
import RoomBookingForm from '@/components/scheduling/RoomBookingForm';
import type { RoomAvailability, BookingFormData } from '@/types/scheduling';
import { schedulingApi } from '@/lib/schedulingApi';

export default function RoomAvailabilityPage() {
  const [rooms, setRooms] = useState<RoomAvailability[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomAvailability | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load room availability data from API
    const loadRoomData = async () => {
      try {
        setLoading(true);
        const roomData = await schedulingApi.roomAvailability.getAll();
        setRooms(roomData);
      } catch (err) {
        setError('Failed to load room availability data');
        console.error('Error loading rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
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

  const handleBookingSubmit = async (formData: BookingFormData) => {
    try {
      await schedulingApi.roomBooking.create(formData);
      
      // Show success message and hide form
      setBookingSuccess(true);
      setShowBookingForm(false);
      
      // Scroll to success message
      setTimeout(() => {
        document.getElementById('booking-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert('Failed to submit booking request. Please try again.');
    }
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading room availability...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card p-8 rounded-lg shadow-sm border text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-destructive text-lg mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2">Room Availability</h1>
          <p className="text-muted-foreground">
            Check room availability and submit booking requests for available time slots.
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-card p-8 rounded-lg shadow-sm border text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <p className="text-muted-foreground text-lg">No rooms available at the moment.</p>
            <p className="text-muted-foreground/70 text-sm mt-2">Please check back later or contact administration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {rooms.map((room) => (
              <RoomAvailabilityCard key={room.id} room={room} onBookRoom={handleBookRoom} />
            ))}
          </div>
        )}

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

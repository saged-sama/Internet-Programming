import { useState, useEffect } from 'react';
import AdminBookingApproval from '@/components/scheduling/AdminBookingApproval';
import type { RoomBooking } from '@/types/scheduling';
import { schedulingApi } from '@/lib/schedulingApi';

export default function AdminApprovalPage() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [actionTaken, setActionTaken] = useState<{
    type: 'approve' | 'reject';
    id: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingData = await schedulingApi.roomBooking.getAll();
      setBookings(bookingData);
    } catch (err) {
      setError('Failed to load booking data');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await schedulingApi.roomBooking.approve(id);
    setActionTaken({ type: 'approve', id });
      // Reload bookings to get updated data
      loadBookings();
    } catch (err) {
      console.error('Error approving booking:', err);
      alert('Failed to approve booking. Please try again.');
    }
  };

  const handleReject = async (id: number, reason: string) => {
    try {
      await schedulingApi.roomBooking.reject(id, reason);
    setActionTaken({ type: 'reject', id });
      // Reload bookings to get updated data
      loadBookings();
    } catch (err) {
      console.error('Error rejecting booking:', err);
      alert('Failed to reject booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading booking requests...</p>
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
            onClick={loadBookings} 
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
          <h1 className="mb-2">Room Booking Approval</h1>
          <p className="text-muted-foreground">
            Review and approve or reject room booking requests.
          </p>
        </div>

        {actionTaken && (
          <div className="mb-6 p-4 bg-card rounded-lg shadow-sm border-l-4 border-accent">
            <p className="text-muted-foreground">
              {actionTaken.type === 'approve'
                ? 'Booking request has been approved successfully.'
                : 'Booking request has been rejected.'}
            </p>
          </div>
        )}

        <AdminBookingApproval
          bookings={bookings}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <div className="mt-8">
          <h3 className="mb-4 text-primary">All Booking Requests</h3>
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-muted-foreground">Room</th>
                    <th className="px-4 py-3 text-left text-muted-foreground">Requested By</th>
                    <th className="px-4 py-3 text-left text-muted-foreground">Purpose</th>
                    <th className="px-4 py-3 text-left text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-muted-foreground">Time</th>
                    <th className="px-4 py-3 text-left text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">{booking.room}</td>
                      <td className="px-4 py-3">
                        <div>{booking.requestedBy}</div>
                        <div className="text-muted-foreground text-xs">{booking.email}</div>
                      </td>
                      <td className="px-4 py-3">{booking.purpose}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            booking.status === 'Approved'
                              ? 'bg-accent/20 text-accent-foreground'
                              : booking.status === 'Rejected'
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {booking.status}
                        </span>
                        {booking.rejectionReason && (
                          <div className="text-muted-foreground text-xs mt-1">
                            Reason: {booking.rejectionReason}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}

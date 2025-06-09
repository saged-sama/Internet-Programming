import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AdminBookingApproval from '@/components/scheduling/AdminBookingApproval';
import type { RoomBooking } from '@/types/scheduling';
import roomBookingsData from '@/assets/roomBookings.json';

export default function AdminApprovalPage() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [actionTaken, setActionTaken] = useState<{
    type: 'approve' | 'reject';
    id: number;
  } | null>(null);

  useEffect(() => {
    // Load room bookings data
    const loadedBookings = roomBookingsData as RoomBooking[];
    setBookings(loadedBookings);
  }, []);

  const handleApprove = (id: number) => {
    // In a real application, this would send the approval to a backend API
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id ? { ...booking, status: 'Approved' } : booking
      )
    );
    setActionTaken({ type: 'approve', id });
  };

  const handleReject = (id: number, reason: string) => {
    // In a real application, this would send the rejection to a backend API
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id ? { ...booking, status: 'Rejected', rejectionReason: reason } : booking
      )
    );
    setActionTaken({ type: 'reject', id });
  };

  return (
    <Layout>
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
    </Layout>
  );
}

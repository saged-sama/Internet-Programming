import type { RoomBooking } from '@/types/scheduling';

interface AdminBookingApprovalProps {
  bookings: RoomBooking[];
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

export default function AdminBookingApproval({
  bookings,
  onApprove,
  onReject,
}: AdminBookingApprovalProps) {
  const pendingBookings = bookings.filter((booking) => booking.status === 'Pending');

  const handleReject = (id: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      onReject(id, reason);
    }
  };

  if (pendingBookings.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm text-center">
        <p className="text-muted-foreground">No pending room booking requests.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-primary">Pending Room Booking Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-muted-foreground">Room</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Requested By</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Purpose</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Attendees</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Request Date</th>
              <th className="px-4 py-3 text-left text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pendingBookings.map((booking) => (
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
                <td className="px-4 py-3">{booking.attendees}</td>
                <td className="px-4 py-3">{booking.requestDate}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(booking.id)}
                      className="bg-accent text-accent-foreground px-3 py-1 rounded-md text-xs hover:bg-accent/90"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="bg-destructive text-primary-foreground px-3 py-1 rounded-md text-xs hover:bg-destructive/90"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

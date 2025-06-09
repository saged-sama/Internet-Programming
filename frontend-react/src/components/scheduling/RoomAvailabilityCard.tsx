import type { RoomAvailability } from '@/types/scheduling';

interface RoomAvailabilityCardProps {
  room: RoomAvailability;
  onBookRoom: (roomId: number) => void;
}

export default function RoomAvailabilityCard({ room, onBookRoom }: RoomAvailabilityCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h3 className="text-primary">Room {room.room}</h3>
          <button
            onClick={() => onBookRoom(room.id)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Book Room
          </button>
        </div>
        <div className="mt-2">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Capacity:</span> {room.capacity} people
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Facilities:</span>{' '}
            {room.facilities.join(', ')}
          </p>
        </div>
      </div>
      <div className="p-4">
        <h4 className="mb-3 text-muted-foreground">Available Slots</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {room.availableSlots.map((daySlot) => (
            <div key={daySlot.day} className="border border-border rounded-md p-3">
              <h5 className="font-medium mb-2">{daySlot.day}</h5>
              <ul className="space-y-1">
                {daySlot.slots.map((slot, index) => (
                  <li key={index} className="text-muted-foreground">
                    {slot.startTime} - {slot.endTime}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

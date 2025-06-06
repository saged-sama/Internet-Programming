import { useState } from "react";
import type { LabEquipment, BookingSlot } from "../../types/financials";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface LabEquipmentBookingProps {
  equipment: LabEquipment[];
  bookings: BookingSlot[];
  onBook: (
    equipmentId: string,
    startTime: string,
    endTime: string,
    purpose: string
  ) => void;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  isAdmin?: boolean;
}

export function LabEquipmentBooking({
  equipment,
  bookings,
  onBook,
  onApprove,
  onReject,
  isAdmin = false,
}: LabEquipmentBookingProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");

  const timeSlots = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const getStatusColor = (status: LabEquipment["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "booked":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleBooking = () => {
    if (selectedEquipment && selectedDate && startTime && endTime && purpose) {
      const startDateTime = `${format(
        selectedDate,
        "yyyy-MM-dd"
      )}T${startTime}`;
      const endDateTime = `${format(selectedDate, "yyyy-MM-dd")}T${endTime}`;
      onBook(selectedEquipment, startDateTime, endDateTime, purpose);
    }
  };

  return (
    <div className="space-y-6">
      <h2>Lab Equipment Booking</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3>Available Equipment</h3>
          <div className="grid gap-4">
            {equipment.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Location: {item.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3>Book Equipment</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Select
                  value={selectedEquipment}
                  onValueChange={setSelectedEquipment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment
                      .filter((item) => item.status === "available")
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <textarea
                  className="w-full rounded-md border p-2"
                  placeholder="Purpose of booking"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />

                <Button onClick={handleBooking} className="w-full">
                  Book Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isAdmin && (
        <div className="space-y-4">
          <h3>Pending Approvals</h3>
          <div className="grid gap-4">
            {bookings
              .filter((booking) => booking.status === "pending")
              .map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">
                          {
                            equipment.find((e) => e.id === booking.equipmentId)
                              ?.name
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.startTime), "PPP")} -{" "}
                          {format(new Date(booking.endTime), "p")}
                        </p>
                        <p className="text-sm">{booking.purpose}</p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => onApprove(booking.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => onReject(booking.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

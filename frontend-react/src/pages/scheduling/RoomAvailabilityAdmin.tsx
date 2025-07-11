import { useState, useEffect } from 'react';
import type { RoomAvailability } from '@/types/scheduling';
import { schedulingApi } from '@/lib/schedulingApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RoomFormData {
  room: string;
  capacity: number;
  facilities: string[];
  availableSlots: Array<{
    day: string;
    slots: Array<{ startTime: string; endTime: string }>;
  }>;
}

export default function RoomAvailabilityAdmin() {
  const [rooms, setRooms] = useState<RoomAvailability[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomAvailability | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState<RoomFormData>({
    room: '',
    capacity: 0,
    facilities: [],
    availableSlots: [],
  });

  const [newFacility, setNewFacility] = useState('');
  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const facilityOptions = [
    'Projector', 'Whiteboard', 'AC', 'Sound System', 'Microphone', 
    'Computer', 'TV', 'Video Conference', 'WiFi', 'Blackboard'
  ];

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCreateForm) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showCreateForm]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await schedulingApi.roomAvailability.admin.getAll();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.facilities.some(facility => 
          facility.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredRooms(filtered);
  };

  const resetForm = () => {
    setFormData({
      room: '',
      capacity: 0,
      facilities: [],
      availableSlots: [],
    });
    setNewFacility('');
    setNewSlot({ day: '', startTime: '', endTime: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseInt(value) || 0 : value 
    }));
  };

  const handleCreate = () => {
    resetForm();
    setEditingRoom(null);
    setShowCreateForm(true);
  };

  const handleEdit = (room: RoomAvailability) => {
    setFormData({
      room: room.room,
      capacity: room.capacity,
      facilities: [...room.facilities],
      availableSlots: [...room.availableSlots],
    });
    setEditingRoom(room);
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      let response;
      if (editingRoom) {
        // Update existing room
        response = await schedulingApi.roomAvailability.admin.update(editingRoom.id, formData);
        alert(`✅ ${response.message}`);
      } else {
        // Create new room
        response = await schedulingApi.roomAvailability.admin.create(formData);
        alert(`✅ ${response.message}`);
      }
      
      setShowCreateForm(false);
      resetForm();
      setEditingRoom(null);
      await loadRooms();
    } catch (err) {
      console.error('Error saving room:', err);
      alert('❌ Failed to save room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (room: RoomAvailability) => {
    if (isDeleting === room.id) return; // Prevent double deletion
    
    if (window.confirm(`Are you sure you want to delete room ${room.room}?\n\nThis will also delete:\n- All class schedules in this room\n- All booking requests for this room\n- All availability slots for this room`)) {
      try {
        setIsDeleting(room.id);
        const response = await schedulingApi.roomAvailability.admin.delete(room.id);
        alert(`✅ ${response.message}`);
        await loadRooms();
      } catch (err) {
        console.error('Error deleting room:', err);
        alert('❌ Failed to delete room. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    resetForm();
    setEditingRoom(null);
  };

  const addFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const removeFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }));
  };

  const addTimeSlot = () => {
    if (newSlot.day && newSlot.startTime && newSlot.endTime) {
      const dayIndex = formData.availableSlots.findIndex(slot => slot.day === newSlot.day);
      
      if (dayIndex >= 0) {
        // Add to existing day
        const updatedSlots = [...formData.availableSlots];
        updatedSlots[dayIndex].slots.push({
          startTime: newSlot.startTime,
          endTime: newSlot.endTime
        });
        setFormData(prev => ({ ...prev, availableSlots: updatedSlots }));
      } else {
        // Create new day
        setFormData(prev => ({
          ...prev,
          availableSlots: [...prev.availableSlots, {
            day: newSlot.day,
            slots: [{ startTime: newSlot.startTime, endTime: newSlot.endTime }]
          }]
        }));
      }
      
      setNewSlot({ day: '', startTime: '', endTime: '' });
    }
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    const updatedSlots = formData.availableSlots.map(daySlot => {
      if (daySlot.day === day) {
        return {
          ...daySlot,
          slots: daySlot.slots.filter((_, index) => index !== slotIndex)
        };
      }
      return daySlot;
    }).filter(daySlot => daySlot.slots.length > 0);

    setFormData(prev => ({ ...prev, availableSlots: updatedSlots }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading rooms...</p>
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="mb-2">Room Availability Administration</h1>
            <p className="text-muted-foreground">
              Manage rooms and their availability slots - create, edit, and delete room entries.
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
            + Create New Room
          </Button>
        </div>

        {/* Search */}
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block mb-2 text-muted-foreground text-sm">
                Search Rooms
              </label>
              <Input
                id="search"
                placeholder="Search by room name or facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setSearchTerm('')}
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full bg-card p-8 rounded-lg shadow-sm border text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <p className="text-muted-foreground text-lg">No rooms found.</p>
            <p className="text-muted-foreground/70 text-sm mt-2">
              {rooms.length === 0 ? 'Create your first room to get started.' : 'Try adjusting your search.'}
            </p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div key={room.id} className="bg-card rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-primary">Room {room.room}</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(room)}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(room)}
                      size="sm"
                      variant="destructive"
                      className="text-xs"
                      disabled={isDeleting === room.id}
                    >
                      {isDeleting === room.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-medium">Capacity:</span> {room.capacity} people
                </p>
                <div className="mt-2">
                  <span className="font-medium text-foreground">Facilities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium mb-3 text-foreground">Available Slots</h4>
                {room.availableSlots.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No availability slots defined</p>
                ) : (
                  <div className="space-y-2">
                    {room.availableSlots.map((daySlot, dayIndex) => (
                      <div key={dayIndex} className="border border-border rounded-md p-2">
                        <h5 className="font-medium text-sm mb-1">{daySlot.day}</h5>
                        <div className="space-y-1">
                          {daySlot.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="text-xs text-muted-foreground">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <div 
            className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary">
                {editingRoom ? 'Edit Room' : 'Create New Room'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="room" className="block mb-2 text-muted-foreground">
                      Room Number/Name
                    </label>
                    <Input
                      id="room"
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      placeholder="e.g., A101"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block mb-2 text-muted-foreground">
                      Capacity (people)
                    </label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      required
                    />
                  </div>

                  {/* Facilities */}
                  <div>
                    <label className="block mb-2 text-muted-foreground">Facilities</label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={newFacility}
                        onChange={(e) => setNewFacility(e.target.value)}
                        className="flex-1 p-2 border rounded-md bg-background"
                      >
                        <option value="">Select a facility</option>
                        {facilityOptions
                          .filter(facility => !formData.facilities.includes(facility))
                          .map((facility) => (
                            <option key={facility} value={facility}>{facility}</option>
                          ))}
                      </select>
                      <Button type="button" onClick={addFacility} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {facility}
                          <button
                            type="button"
                            onClick={() => removeFacility(facility)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Slots */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Available Time Slots</h3>
                  
                  <div className="border border-border rounded-md p-4 space-y-3">
                    <h4 className="font-medium">Add Time Slot</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={newSlot.day}
                        onChange={(e) => setNewSlot(prev => ({ ...prev, day: e.target.value }))}
                        className="p-2 border rounded-md bg-background"
                      >
                        <option value="">Select Day</option>
                        {days.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <Input
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                        placeholder="Start Time"
                      />
                      <Input
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                        placeholder="End Time"
                      />
                    </div>
                    <Button type="button" onClick={addTimeSlot} variant="outline" className="w-full">
                      Add Time Slot
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {formData.availableSlots.map((daySlot, dayIndex) => (
                      <div key={dayIndex} className="border border-border rounded-md p-3">
                        <h5 className="font-medium mb-2">{daySlot.day}</h5>
                        <div className="space-y-1">
                          {daySlot.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex justify-between items-center text-sm">
                              <span>{slot.startTime} - {slot.endTime}</span>
                              <button
                                type="button"
                                onClick={() => removeTimeSlot(daySlot.day, slotIndex)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6 mt-6 border-t border-border">
                <Button type="button" onClick={handleCancel} variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingRoom ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingRoom ? 'Update Room' : 'Create Room'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
export interface FeeStructure {
  id: string;
  title: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'paid' | 'overdue';
  transactionId?: string;
  paymentDate?: string;
}

export interface LabEquipment {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'booked' | 'maintenance';
  location: string;
  category: string;
}

export interface BookingSlot {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  purpose: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  year: number;
  topic: string;
  supervisor: string;
  team: string[];
  demoUrl?: string;
  status: 'ongoing' | 'completed';
}

export interface Award {
  id: string;
  title: string;
  type: 'research' | 'academic' | 'competition';
  year: number;
  recipient: string;
  amount?: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
} 
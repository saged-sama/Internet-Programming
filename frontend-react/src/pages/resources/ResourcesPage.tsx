import { useState, useEffect } from "react";
import { EnhancedFeeStructure } from "../../components/financials/EnhancedFeeStructure";
import { LabEquipmentBooking } from "../../components/lab/LabEquipmentBooking";
import { CourseMaterials } from "../../components/courses/CourseMaterials";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import type {
  FeeStructure as FeeStructureType,
  LabEquipment,
  BookingSlot,
  CourseMaterial,
} from "../../types/financials";

import financialsData from "../../assets/financials.json";

export function ResourcesPage() {
  const [fees, setFees] = useState<FeeStructureType[]>([]);
  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);

  // Sample user info - in a real app, this would come from auth context
  const userInfo = {
    studentId: "2020-1-60-001",
    batch: "2020",
    year: 4,
    isNewAdmission: false,
  };

  useEffect(() => {
    // Load mock data with enhanced fee structure
    const enhancedFees: FeeStructureType[] = [
      // Development Fees (Half-yearly)
      {
        id: "dev-001",
        title: "Development Fee - Fall 2024",
        description: "Infrastructure development and academic improvement fee",
        amount: 15000,
        deadline: "2024-12-31",
        status: "pending",
        category: "development",
        semester: "Fall 2024",
        academicYear: "2024-2025",
        installmentOptions: {
          count: 2,
          amount: 7500,
        },
      },
      {
        id: "dev-002",
        title: "Development Fee - Spring 2025",
        description: "Infrastructure development and academic improvement fee",
        amount: 15000,
        deadline: "2025-06-30",
        status: "pending",
        category: "development",
        semester: "Spring 2025",
        academicYear: "2024-2025",
        installmentOptions: {
          count: 2,
          amount: 7500,
        },
      },
      // Admission Fees for New Bachelor Students
      {
        id: "adm-001",
        title: "New Bachelor Admission Fee",
        description: "One-time admission fee for new bachelor students",
        amount: 25000,
        deadline: "2024-12-15",
        status: "pending",
        category: "admission",
        academicYear: "2024-2025",
      },
      // Yearly Admission Fees (1st to 3rd year)
      {
        id: "adm-002",
        title: "1st Year Admission Fee",
        description: "Annual admission fee for 1st year students",
        amount: 18000,
        deadline: "2024-12-31",
        status: "paid",
        category: "admission",
        academicYear: "2024-2025",
        paymentDate: "2024-01-15",
        transactionId: "TXN202401150001",
      },
      {
        id: "adm-003",
        title: "2nd Year Admission Fee",
        description: "Annual admission fee for 2nd year students",
        amount: 18000,
        deadline: "2025-01-31",
        status: "pending",
        category: "admission",
        academicYear: "2024-2025",
        installmentOptions: {
          count: 3,
          amount: 6000,
        },
      },
      {
        id: "adm-004",
        title: "3rd Year Admission Fee",
        description: "Annual admission fee for 3rd year students",
        amount: 18000,
        deadline: "2025-02-28",
        status: "overdue",
        category: "admission",
        academicYear: "2024-2025",
      },
      // Tuition Fees
      {
        id: "tui-001",
        title: "Fall 2024 Tuition Fee",
        description: "Semester tuition fee for enrolled courses",
        amount: 35000,
        deadline: "2024-12-20",
        status: "pending",
        category: "tuition",
        semester: "Fall 2024",
        academicYear: "2024-2025",
        installmentOptions: {
          count: 2,
          amount: 17500,
        },
      },
      {
        id: "tui-002",
        title: "Spring 2025 Tuition Fee",
        description: "Semester tuition fee for enrolled courses",
        amount: 35000,
        deadline: "2025-06-20",
        status: "pending",
        category: "tuition",
        semester: "Spring 2025",
        academicYear: "2024-2025",
        installmentOptions: {
          count: 2,
          amount: 17500,
        },
      },
      // Other Fees
      {
        id: "oth-001",
        title: "Library Fee",
        description: "Annual library access and maintenance fee",
        amount: 2000,
        deadline: "2024-12-31",
        status: "pending",
        category: "other",
        academicYear: "2024-2025",
      },
      {
        id: "oth-002",
        title: "Lab Equipment Fee",
        description: "Laboratory equipment usage and maintenance fee",
        amount: 5000,
        deadline: "2024-12-31",
        status: "paid",
        category: "other",
        academicYear: "2024-2025",
        paymentDate: "2024-01-10",
        transactionId: "TXN202401100002",
      },
    ];

    setFees(enhancedFees);
    setEquipment(financialsData.labEquipment as LabEquipment[]);
    setBookings(financialsData.bookings as BookingSlot[]);
    setMaterials(financialsData.courseMaterials as CourseMaterial[]);
  }, []);

  const handlePayment = async (feeId: string, paymentMethod: string, transactionId: string) => {
    // Update fee status in the state
    setFees(fees.map(fee => 
      fee.id === feeId
        ? { 
            ...fee, 
            status: "paid" as const, 
            paymentDate: new Date().toISOString(),
            transactionId
          }
        : fee
    ));
  };

  const handleBooking = async (
    equipmentId: string,
    startTime: string,
    endTime: string,
    purpose: string
  ) => {
    // Implement booking logic here
    const newBooking: BookingSlot = {
      id: `book${bookings.length + 1}`,
      equipmentId,
      userId: "currentUser", // This should come from auth context
      startTime,
      endTime,
      purpose,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings([...bookings, newBooking]);
  };

  const handleBookingApproval = async (
    bookingId: string,
    approved: boolean
  ) => {
    // Update booking status in the state
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: approved ? "approved" : "rejected" }
          : booking
      )
    );
  };

  return (
    <>
     
      <main className="container mx-auto py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Academic Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access essential academic resources including fee structure, lab equipment booking, and course materials
          </p>
        </div>

        <Tabs defaultValue="fees" className="w-full">
          <div className="relative">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <TabsTrigger value="fees" className="whitespace-nowrap">
                  Fee Structure
                </TabsTrigger>
                <TabsTrigger value="lab" className="whitespace-nowrap">
                  Lab Equipment
                </TabsTrigger>
                <TabsTrigger value="materials" className="whitespace-nowrap">
                  Course Materials
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="fees">
            <EnhancedFeeStructure 
              fees={fees} 
              onPayment={handlePayment}
              userInfo={userInfo}
            />
          </TabsContent>

          <TabsContent value="lab">
            <LabEquipmentBooking
              equipment={equipment}
              bookings={bookings}
              onBook={handleBooking}
              onApprove={(id) => handleBookingApproval(id, true)}
              onReject={(id) => handleBookingApproval(id, false)}
              isAdmin={true}
            />
          </TabsContent>

          <TabsContent value="materials">
            <CourseMaterials materials={materials} />
          </TabsContent>
        </Tabs>
      </main>
      
    </>
  );
}

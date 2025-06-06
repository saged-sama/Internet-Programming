import { useState, useEffect } from "react";
import { FeeStructure } from "../../components/financials/FeeStructure";
import { LabEquipmentBooking } from "../../components/lab/LabEquipmentBooking";
import { ProjectsShowcase } from "../../components/projects/ProjectsShowcase";
import { AwardsGrants } from "../../components/awards/AwardsGrants";
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
  Project,
  Award,
} from "../../types/financials";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import financialsData from "../../assets/financials.json";

export function ResourcesPage() {
  const [fees, setFees] = useState<FeeStructureType[]>([]);
  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);

  useEffect(() => {
    // Load mock data with proper type casting
    setFees(financialsData.fees as FeeStructureType[]);
    setEquipment(financialsData.labEquipment as LabEquipment[]);
    setBookings(financialsData.bookings as BookingSlot[]);
    setProjects(financialsData.projects as Project[]);
    setAwards(financialsData.awards as Award[]);
  }, []);

  const handlePayment = async (feeId: string) => {
    // Implement payment logic here
    console.log("Processing payment for fee:", feeId);
    // Update fee status in the state
    setFees(
      fees.map((fee) =>
        fee.id === feeId
          ? { ...fee, status: "paid", paymentDate: new Date().toISOString() }
          : fee
      )
    );
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

  const handleAwardApproval = async (awardId: string, approved: boolean) => {
    // Update award status in the state
    setAwards(
      awards.map((award) =>
        award.id === awardId
          ? { ...award, status: approved ? "approved" : "rejected" }
          : award
      )
    );
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8 space-y-8">
        <h1>Resources & Financials</h1>

        <Tabs defaultValue="fees" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fees">Fee Structure</TabsTrigger>
            <TabsTrigger value="lab">Lab Equipment</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="awards">Awards & Grants</TabsTrigger>
          </TabsList>

          <TabsContent value="fees">
            <FeeStructure fees={fees} onPayment={handlePayment} />
          </TabsContent>

          <TabsContent value="lab">
            <LabEquipmentBooking
              equipment={equipment}
              bookings={bookings}
              onBook={handleBooking}
              onApprove={(id) => handleBookingApproval(id, true)}
              onReject={(id) => handleBookingApproval(id, false)}
              isAdmin={true} // This should come from auth context
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsShowcase projects={projects} />
          </TabsContent>

          <TabsContent value="awards">
            <AwardsGrants
              awards={awards}
              isAdmin={true} // This should come from auth context
              onApprove={(id) => handleAwardApproval(id, true)}
              onReject={(id) => handleAwardApproval(id, false)}
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}

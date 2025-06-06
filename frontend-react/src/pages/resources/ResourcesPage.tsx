import { useState } from "react";
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

export function ResourcesPage() {
  const [fees, setFees] = useState<FeeStructureType[]>([]);
  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);

  const handlePayment = async (feeId: string) => {
    // Implement payment logic here
    console.log("Processing payment for fee:", feeId);
  };

  const handleBooking = async (
    equipmentId: string,
    startTime: string,
    endTime: string,
    purpose: string
  ) => {
    // Implement booking logic here
    console.log("Creating booking:", {
      equipmentId,
      startTime,
      endTime,
      purpose,
    });
  };

  const handleBookingApproval = async (
    bookingId: string,
    approved: boolean
  ) => {
    // Implement booking approval logic here
    console.log("Updating booking status:", { bookingId, approved });
  };

  const handleAwardApproval = async (awardId: string, approved: boolean) => {
    // Implement award approval logic here
    console.log("Updating award status:", { awardId, approved });
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

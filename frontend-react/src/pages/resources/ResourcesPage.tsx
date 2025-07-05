import { useState, useEffect } from "react";
import { FeeStructure } from "../../components/financials/FeeStructure";
import { LabEquipmentBooking } from "../../components/lab/LabEquipmentBooking";
import { ProjectsShowcase } from "../../components/projects/ProjectsShowcase";
import { AwardsGrants } from "../../components/awards/AwardsGrants";
import { ResearchPapers } from "../../components/research/ResearchPapers";
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
  Project,
  Award,
  ResearchPaper,
  CourseMaterial,
} from "../../types/financials";

import financialsData from "../../assets/financials.json";

export function ResourcesPage() {
  const [fees, setFees] = useState<FeeStructureType[]>([]);
  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);

  useEffect(() => {
    // Load mock data with proper type casting
    setFees(financialsData.fees as FeeStructureType[]);
    setEquipment(financialsData.labEquipment as LabEquipment[]);
    setBookings(financialsData.bookings as BookingSlot[]);
    setProjects(financialsData.projects as Project[]);
    setAwards(financialsData.awards as Award[]);
    setPapers(financialsData.researchPapers as ResearchPaper[]);
    setMaterials(financialsData.courseMaterials as CourseMaterial[]);
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
     
      <main className="container mx-auto py-8 space-y-8">
        <h1>Resources & Financials</h1>

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
                <TabsTrigger value="projects" className="whitespace-nowrap">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="awards" className="whitespace-nowrap">
                  Awards & Grants
                </TabsTrigger>
                <TabsTrigger value="papers" className="whitespace-nowrap">
                  Research Papers
                </TabsTrigger>
                <TabsTrigger value="materials" className="whitespace-nowrap">
                  Course Materials
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

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
              isAdmin={true}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsShowcase projects={projects} />
          </TabsContent>

          <TabsContent value="awards">
            <AwardsGrants
              awards={awards}
              isAdmin={true}
              onApprove={(id) => handleAwardApproval(id, true)}
              onReject={(id) => handleAwardApproval(id, false)}
            />
          </TabsContent>

          <TabsContent value="papers">
            <ResearchPapers papers={papers} />
          </TabsContent>

          <TabsContent value="materials">
            <CourseMaterials materials={materials} />
          </TabsContent>
        </Tabs>
      </main>
      
    </>
  );
}

import { useState, useEffect } from "react";
import axios from 'axios';
import { EnhancedFeeStructure } from "../../components/financials/EnhancedFeeStructure";
import { LabEquipmentBooking } from "../../components/lab/LabEquipmentBooking";
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
import { getCurrentUser } from "../../lib/auth";
import CourseMaterialPage from "@/components/courses/CourseMaterialPage";

export function ResourcesPage() {
  const [____, setFees] = useState<FeeStructureType[]>([]);
  const [equipment, __] = useState<LabEquipment[]>([]);
  const [equipments, setEquipments] = useState([]);
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [_ , setbookingList] = useState<BookingSlot[]>([]);
  const [___, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState({
    fees: false,
    equipment: false,
    bookings: false,
    materials: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("fees");

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    isSuccess: false,
  });

  const userInfo = {
    studentId: "2020-1-60-001",
    batch: "2020",
    year: 4,
    isNewAdmission: false,
  };

  // Load initial data (fees and course materials)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, fees: true }));

        const enhancedFees: FeeStructureType[] = [
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
            installmentOptions: { count: 2, amount: 7500 },
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
            installmentOptions: { count: 2, amount: 7500 },
          },
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
            installmentOptions: { count: 3, amount: 6000 },
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
          {
            id: "tui-001",
            title: "Fall 2024 Tuition Fee",
            description: "Semester tuition fee for enrolled courses",
            amount: 35000,
            deadline: "2024-12-20",
            status: "pending",
            category: "other",
            semester: "Fall 2024",
            academicYear: "2024-2025",
            installmentOptions: { count: 2, amount: 17500 },
          },
          {
            id: "tui-002",
            title: "Spring 2025 Tuition Fee",
            description: "Semester tuition fee for enrolled courses",
            amount: 35000,
            deadline: "2025-06-20",
            status: "pending",
            category: "other",
            semester: "Spring 2025",
            academicYear: "2024-2025",
            installmentOptions: { count: 2, amount: 17500 },
          },
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
        setMaterials(financialsData.courseMaterials as CourseMaterial[]);
      } catch (err) {
        setError("Failed to load initial data");
      } finally {
        setLoading(prev => ({ ...prev, fees: false }));
      }
    };

    loadInitialData();
  }, []);

  // Load Lab Equipment data on tab switch
  useEffect(() => {
    if (activeTab === "lab" && equipment.length === 0) {
      const fetchLabEquipment = async () => {
        try {
          setLoading(prev => ({ ...prev, equipment: true }));
          setError(null);

          const response = await axios.get('http://localhost:8000/staff-api/lab-equipments/');
          // setEquipment(response.data.data);
          console.log("Lab Equipment Data Loaded:", response.data);
          setEquipments(response.data.data); // Access the 'data' array from response
          if (isAdmin) {
            const bookingsResponse = await axios.get('/staff-api/lab-equipments/all/booking');
            setBookings(bookingsResponse.data.data);
            setbookingList(bookingsResponse.data.data);
            console.log("Bookings Data Loaded:", bookingsResponse.data.data);
          }
        } catch (err) {
          setError("Failed to load lab equipment data");
        } finally {
          setLoading(prev => ({ ...prev, equipment: false }));
        }
      };

      fetchLabEquipment();
    }
  }, [activeTab, isAdmin]);

  // const handlePayment = async (
  //   feeId: string,
  //   paymentMethod: string,
  //   transactionId: string
  // ) => {
  //   console.log(paymentMethod)
  //   setFees(
  //     fees.map((fee) =>
  //       fee.id === feeId
  //         ? {
  //             ...fee,
  //             status: "paid" as const,
  //             paymentDate: new Date().toISOString(),
  //             transactionId,
  //           }
  //         : fee
  //     )
  //   );
  // };

  const handleBooking = async (
  equipmentId: string,
  startTime: Date,
  endTime: Date,
  purpose: string
) => {
  try {
    setLoading(prev => ({ ...prev, bookings: true }));
    setError(null);

    // Convert dates to ISO strings for the API
    const bookingData = {
      equipment_id : equipmentId,
      start_time: new Date(startTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(endTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      purpose : purpose,
    };
    const response = await axios.post(
      `http://localhost:8000/staff-api/lab-equipments/${equipmentId}/bookings`,
      bookingData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    );

    // Transform the backend response to match frontend interface
    const newBooking: BookingSlot = {
      id: response.data.id,
      equipment_id: response.data.equipment_id,
      userId: response.data.user_id,
      start_time: response.data.start_time,
      end_time: response.data.end_time,
      purpose: response.data.purpose,
      status: response.data.status,
      createdAt: response.data.created_at,
      equipment_name: response.data.equipment_name || "Unknown Equipment",
    };

    setBookings(prev => [...prev, newBooking]);
        setDialogContent({
      title: 'Booking Successful',
      message: 'Your equipment booking has been confirmed.',
      isSuccess: true,
    });
    setDialogOpen(true);
    console.log("Booking created successfully:", newBooking);
    return { success: true, booking: newBooking };
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Failed to create booking";
    setError(errorMessage);

        // Show error dialog
    setDialogContent({
      title: 'Booking Failed',
      message: errorMessage,
      isSuccess: false,
    });
    setDialogOpen(true);

    return { success: false, error: errorMessage };
  } finally {
    setLoading(prev => ({ ...prev, bookings: false }));
  }
};


  const handleBookingApproval = async (
    bookingId: string,
    approved: boolean
  ) => {
    try {
      setLoading(prev => ({ ...prev, bookings: true }));

      await axios.put(`/staff-api/lab-equipments/bookings/${bookingId}/${approved ? 'approve' : 'reject'}`);

      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: approved ? "approved" : "rejected" }
            : booking
        )
      );
    } catch (err) {
      setError(`Failed to ${approved ? "approve" : "reject"} booking`);
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };


  const handleBookingApprovalByBookingId = async (bookingId: string, approved: boolean) => {
    try {
      setLoading(prev => ({ ...prev, bookings: true }));
      setError(null);

      // const updateData = {
      //   status: approved ? 'approved' : 'rejected',
      //   updated_at: new Date().toISOString()
      // };

      // const response = await axios.patch(
      //   `http://localhost:8000/staff-api/lab-equipments/bookings/${bookingId}`,
      //   updateData,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      //     }
      //   }
      // );

      setbookingList(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: approved ? 'approved' : 'rejected' }
            : booking
        )
      );

      setDialogContent({
        title: 'Booking Updated',
        message: `Booking has been ${approved ? 'approved' : 'rejected'} successfully.`,
        isSuccess: true
      });
      setDialogOpen(true);

    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to update booking";
      setError(errorMessage);
      setDialogContent({
        title: 'Update Failed',
        message: errorMessage,
        isSuccess: false
      });
      setDialogOpen(true);
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };
  


  if (loading.fees && activeTab === "fees") {
    return <div className="text-center py-8">Loading fee structure...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Academic Resources
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access essential academic resources including fee structure, lab
          equipment booking, and course materials
        </p>
      </div>

      <Tabs defaultValue="fees" className="w-full" onValueChange={setActiveTab}>
        <div className="relative">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="fees">Fee Structure</TabsTrigger>
              <TabsTrigger value="lab">Lab Equipment</TabsTrigger>
              <TabsTrigger value="materials">Course Materials</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="fees">
          <EnhancedFeeStructure
            userInfo={userInfo}
          />
        </TabsContent>

        <TabsContent value="lab">
          {loading.equipment ? (
            <div className="text-center py-8">Loading lab equipment...</div>
          ) : (

              <LabEquipmentBooking
                equipment={equipments}
                bookings={bookings}
                onBook={(equipmentId, startTime, endTime, purpose) => {
                  // Convert string dates to Date objects
                  const startDate = new Date(startTime);
                  const endDate = new Date(endTime);
                  
                  handleBooking(equipmentId, startDate, endDate, purpose)
                    .then(result => {
                      if (result.success) {
                        
                        // Show success notification
                      } else {
                        // Show error notification
                      }
                    });
                }}
              onApprove={(id) => handleBookingApproval(id, true)}
              onReject={(id) => handleBookingApproval(id, false)}
              isAdmin={isAdmin}
            />

            

          )}
        </TabsContent>

        <TabsContent value="materials">
          <CourseMaterialPage />
        </TabsContent>
      </Tabs>


          {isAdmin && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p><strong>Equipment ID:</strong> {booking.equipment_id}</p>
                        <p><strong>Equipment Name:</strong> {booking.equipment_name}</p>
                        <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
                        <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
                        <p><strong>Purpose:</strong> {booking.purpose}</p>
                        <p><strong>Status:</strong> <span className={`font-bold ${
                          booking.status === 'approved' ? 'text-green-600' : 
                          booking.status === 'rejected' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>{booking.status}</span></p>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookingApprovalByBookingId(booking.id, true)}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleBookingApprovalByBookingId(booking.id, false)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

            {/* Dialog Component */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">{dialogContent.title}</h3>
            <p className="mb-4">{dialogContent.message}</p>
            <button
              onClick={() => setDialogOpen(false)}
              className={`px-4 py-2 rounded text-white ${dialogContent.isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}





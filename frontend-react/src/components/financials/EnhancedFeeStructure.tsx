import { useState, useEffect } from "react";
import type { FeeStructure as FeeStructureType } from "../../types/financials";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PaymentModal } from "./PaymentModal";
import { format } from "date-fns";
import { financialApi } from "../../lib/financialApi";

interface EnhancedFeeStructureProps {
  userInfo?: {
    studentId: string;
    batch: string;
    year: number;
    isNewAdmission: boolean;
  };
}

export function EnhancedFeeStructure({ userInfo }: EnhancedFeeStructureProps) {
  const [fees, setFees] = useState<FeeStructureType[]>([]);
  const [selectedFee, setSelectedFee] = useState<FeeStructureType | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const feesData = await financialApi.getMyFees();
      setFees(feesData);
    } catch (err) {
      console.error('Error loading fees:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (feeId: string, paymentMethod: string, transactionId: string) => {
    try {
      // Update the fee status locally
      setFees(prevFees =>
        prevFees.map(fee =>
          fee.id === feeId
            ? {
                ...fee,
                status: 'paid' as const,
                transactionId,
                paymentDate: new Date().toISOString(),
              }
            : fee
        )
      );

      // Refresh fees from server to get latest data
      await loadFees();
    } catch (err) {
      console.error('Error updating fee status:', err);
      // Optionally show error to user
    }
  };

  const getStatusColor = (status: FeeStructureType["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusText = (status: FeeStructureType["status"]) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "overdue":
        return "Overdue";
      default:
        return "Pending";
    }
  };

  const categorizedFees = {
    development: fees.filter(fee => fee.category === "development"),
    admission: fees.filter(fee => fee.category === "admission"),
    tuition: fees.filter(fee => fee.category === "tuition_fee" || fee.category === "tuition"),
    other: fees.filter(fee => !fee.category || fee.category === "other"),
  };

  const handlePayNow = (fee: FeeStructureType) => {
    setSelectedFee(fee);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (feeId: string, paymentMethod: string, transactionId: string) => {
    handlePayment(feeId, paymentMethod, transactionId);
    setPaymentModalOpen(false);
    setSelectedFee(null);
  };

  const FeeCard = ({ fee }: { fee: FeeStructureType }) => (
    <Card key={fee.id} className="relative hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{fee.title}</h3>
            <p className="text-sm text-muted-foreground font-normal">{fee.description}</p>
          </div>
          <Badge className={`${getStatusColor(fee.status)} text-white`}>
            {getStatusText(fee.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              ${fee.amount.toLocaleString()}
            </span>
            {fee.installmentOptions && (
              <span className="text-sm text-muted-foreground">
                or {fee.installmentOptions.count} installments
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Deadline:</span>
              <span className={`font-medium ${
                new Date(fee.deadline) < new Date() && fee.status !== "paid" 
                  ? "text-red-600" : "text-gray-600"
              }`}>
                {format(new Date(fee.deadline), "MMM dd, yyyy")}
              </span>
            </div>
            
            {fee.semester && (
              <div className="flex justify-between text-sm">
                <span>Semester:</span>
                <span className="font-medium">{fee.semester}</span>
              </div>
            )}
            
            {fee.academicYear && (
              <div className="flex justify-between text-sm">
                <span>Academic Year:</span>
                <span className="font-medium">{fee.academicYear}</span>
              </div>
            )}
          </div>

          {fee.status === "pending" && (
            <div className="space-y-2">
              <Button
                onClick={() => handlePayNow(fee)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Pay Now
              </Button>
              {fee.installmentOptions && (
                <Button
                  variant="outline"
                  onClick={() => handlePayNow(fee)}
                  className="w-full"
                >
                  Pay in {fee.installmentOptions.count} Installments
                </Button>
              )}
            </div>
          )}
          
          {fee.status === "paid" && fee.paymentDate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Paid on {format(new Date(fee.paymentDate), "MMM dd, yyyy")}
                  </p>
                  {fee.transactionId && (
                    <p className="text-xs text-green-600">
                      Transaction ID: {fee.transactionId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {fee.status === "overdue" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Payment overdue
                  </p>
                  <p className="text-xs text-red-600">
                    Late fee may apply
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-red-800">Error Loading Fees</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadFees} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Fee Structure</h2>
          <p className="text-muted-foreground">
            Manage your academic fees and payments
          </p>
        </div>
        {userInfo && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Student ID: {userInfo.studentId}</p>
            <p className="text-sm text-muted-foreground">Batch: {userInfo.batch}</p>
            <p className="text-sm text-muted-foreground">Year: {userInfo.year}</p>
          </div>
        )}
      </div>

      {fees.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Fees Found</h3>
          <p className="text-muted-foreground">You don't have any fees assigned at the moment.</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Fees</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="tuition">Tuition</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {Object.entries(categorizedFees).map(([category, categoryFees]) => (
              categoryFees.length > 0 && (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary capitalize">
                    {category} Fees
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryFees.map(fee => <FeeCard key={fee.id} fee={fee} />)}
                  </div>
                </div>
              )
            ))}
          </TabsContent>

          <TabsContent value="development" className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800">Development Fee Information</h3>
              <p className="text-sm text-blue-700 mt-1">
                Development fees are collected half-yearly to support infrastructure development and academic improvements.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categorizedFees.development.map(fee => <FeeCard key={fee.id} fee={fee} />)}
            </div>
          </TabsContent>

          <TabsContent value="admission" className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800">Admission Fee Information</h3>
              <p className="text-sm text-green-700 mt-1">
                Admission fees vary by year level and are required for enrollment confirmation.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categorizedFees.admission.map(fee => <FeeCard key={fee.id} fee={fee} />)}
            </div>
          </TabsContent>

          <TabsContent value="tuition" className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-purple-800">Tuition Fee Information</h3>
              <p className="text-sm text-purple-700 mt-1">
                Semester-wise tuition fees for your enrolled courses.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categorizedFees.tuition.map(fee => <FeeCard key={fee.id} fee={fee} />)}
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800">Other Fees</h3>
              <p className="text-sm text-gray-700 mt-1">
                Additional fees for services, activities, and miscellaneous charges.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categorizedFees.other.map(fee => <FeeCard key={fee.id} fee={fee} />)}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        fee={selectedFee}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
} 
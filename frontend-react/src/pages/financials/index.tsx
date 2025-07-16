import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnhancedFeeStructure } from "../../components/financials/EnhancedFeeStructure";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { financialApi } from "../../lib/financialApi";
import { getCurrentUser, isAdmin, isStudent } from "../../lib/auth";
import type { FeeStructure } from "../../types/financials";

interface PaymentHistoryItem {
  id: string;
  fee_title: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  transaction_id: string;
  status: string;
}

export default function FinancialPage() {
  const navigate = useNavigate();
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_, setUserRole] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState({
    totalDue: 0,
    totalPaid: 0,
    paidFeesCount: 0,
    pendingFeesCount: 0,
    overdueFeesCount: 0
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    setUserRole(user.role);
    loadFinancialData();
  }, [navigate]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isStudent()) {
        // Student view - load their fees and payment history
        const [feesData, historyData] = await Promise.all([
          financialApi.getMyFees(),
          financialApi.getPaymentHistory()
        ]);
        
        setFees(feesData);
        setPaymentHistory(historyData);
      } else if (isAdmin()) {
        // Admin view - load all fees and payment statistics
        const [feesData, statsData] = await Promise.all([
          financialApi.getAllFees(),
          financialApi.getPaymentStatistics()
        ]);
        
        // Transform admin fee data to match FeeStructure interface
        const transformedFees = feesData.map((fee: any) => ({
          id: fee.id,
          title: fee.title,
          description: fee.description,
          amount: fee.amount,
          deadline: fee.deadline,
          status: 'pending' as const, // Default status for admin view
          category: fee.type,
          semester: fee.semester,
          academicYear: fee.academic_year,
          installmentOptions: fee.is_installment_available ? {
            count: fee.installment_count || 0,
            amount: fee.installment_amount || 0
          } : undefined
        }));
        
        setFees(transformedFees);
        setPaymentHistory(statsData.payment_history || []); // Use actual payment history from all students
        
        // Store additional statistics for admin dashboard
        setAdminStats({
          totalDue: statsData.total_due || 0,
          totalPaid: statsData.total_paid || 0,
          paidFeesCount: statsData.paid_fees_count || 0,
          pendingFeesCount: statsData.pending_fees_count || 0,
          overdueFeesCount: statsData.overdue_fees_count || 0
        });
      }
    } catch (err) {
      console.error('Error loading financial data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDue = () => {
    if (isAdmin()) {
      return adminStats.totalDue;
    }
    return fees
      .filter(fee => fee.status === 'pending' || fee.status === 'overdue')
      .reduce((total, fee) => total + fee.amount, 0);
  };

  const calculateTotalPaid = () => {
    if (isAdmin()) {
      return adminStats.totalPaid;
    }
    return paymentHistory.reduce((total, payment) => total + payment.amount_paid, 0);
  };

  const getOverdueFees = () => {
    if (isAdmin()) {
      // Return empty array with correct length for admin users
      return Array(adminStats.overdueFeesCount).fill({ amount: 0 });
    }
    return fees.filter(fee => fee.status === 'overdue');
  };

  const getOverdueFeeAmount = () => {
    if (isAdmin()) {
      // For admin, we'll calculate this from the total due and overdue count
      // This is a simplified calculation - in practice, you'd want a separate API endpoint
      return 0; // Admin doesn't need this calculation in the current implementation
    }
    return getOverdueFees().reduce((sum, fee) => sum + fee.amount, 0);
  };

  const getPaidFees = () => {
    if (isAdmin()) {
      return Array(adminStats.paidFeesCount).fill({ amount: 0 });
    }
    return fees.filter(fee => fee.status === 'paid');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Credit Card (Stripe)';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading financial information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-800">Error Loading Financial Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadFinancialData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {isAdmin() ? 'Financial Administration' : 'Financial Management'}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin() 
            ? 'Manage fees, payments, and financial operations for all students'
            : 'View and manage your academic fees and payment history'
          }
        </p>
        {isAdmin() && (
          <div className="mt-4 flex gap-3">
            <Button onClick={() => navigate('/dashboard/admin')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate('/fees/create')} className="bg-emerald-600 hover:bg-emerald-700">
              Create New Fee
            </Button>
          </div>
        )}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ৳{calculateTotalDue().toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {fees.filter(f => f.status === 'pending' || f.status === 'overdue').length} unpaid fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ৳{calculateTotalPaid().toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getPaidFees().length} paid fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getOverdueFees().length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {paymentHistory.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Fees Alert */}
      {getOverdueFees().length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <span className="text-red-600 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Overdue Fees</h3>
              <p className="text-sm text-red-700 mt-1">
                You have {getOverdueFees().length} overdue fees totaling ৳{getOverdueFeeAmount().toLocaleString()}. 
                Please make payment as soon as possible to avoid late fees.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="fees" className="w-full">
        <TabsList className={`grid w-full grid-cols-2`}>
          <TabsTrigger value="fees">{isAdmin() ? 'All Fees' : 'My Fees'}</TabsTrigger>
          {isStudent() && <TabsTrigger value="history">Payment History</TabsTrigger>}
          {isAdmin() && <TabsTrigger value="reports">Financial Reports</TabsTrigger>}
        </TabsList>

        <TabsContent value="fees" className="space-y-4">
          <EnhancedFeeStructure />
        </TabsContent>

        {isStudent() && (
          <TabsContent value="history" className="space-y-4">
            <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                  <p className="text-muted-foreground">You haven't made any payments yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Fee</th>
                        <th className="text-left p-3 font-medium">Amount</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Method</th>
                        <th className="text-left p-3 font-medium">Transaction ID</th>
                        <th className="text-left p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{payment.fee_title}</td>
                          <td className="p-3 text-green-600 font-medium">
                            ৳{payment.amount_paid.toLocaleString()}
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {formatDate(payment.payment_date)}
                          </td>
                          <td className="p-3 text-sm">
                            {formatPaymentMethod(payment.payment_method)}
                          </td>
                          <td className="p-3 text-sm font-mono">
                            {payment.transaction_id}
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {payment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        )}

        {/* Admin tabs content would go here */}
        {isAdmin() && (
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">
                      ৳{fees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Active Fees</h3>
                    <p className="text-2xl font-bold text-blue-600">{fees.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Fee Categories</h3>
                    <p className="text-sm text-muted-foreground">
                      Lab: {fees.filter(f => f.category === 'lab').length}<br/>
                      Library: {fees.filter(f => f.category === 'library').length}<br/>
                      Development: {fees.filter(f => f.category === 'development').length}<br/>
                      Admission: {fees.filter(f => f.category === 'admission').length}<br/>
                      Sports: {fees.filter(f => f.category === 'sports').length}<br/>
                      Other: {fees.filter(f => f.category === 'other').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
} 
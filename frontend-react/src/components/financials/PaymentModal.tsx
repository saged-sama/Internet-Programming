import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { FeeStructure as FeeStructureType } from "../../types/financials";
import { financialApi } from "../../lib/financialApi";
import { getCurrentUser, isStudent } from "../../lib/auth";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeStructureType | null;
  onPaymentSuccess: (feeId: string, paymentMethod: string, transactionId: string) => void;
}

export function PaymentModal({ isOpen, onClose, fee, onPaymentSuccess }: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<"details" | "processing" | "success" | "error">("details");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check authentication
  const user = getCurrentUser();
  const isLoggedIn = user !== null;
  const isStudentUser = isStudent();

  const handlePayment = async () => {
    if (!fee) return;

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Create payment intent
      const intentData = await financialApi.createPaymentIntent({
        student_fee_id: fee.id,
        amount: fee.amount,
        currency: "bdt",
      });

      // Simulate Stripe payment processing
      // In a real implementation, you would use Stripe.js here
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm payment
      const confirmData = await financialApi.confirmPayment({
        payment_intent_id: intentData.payment_intent_id,
        payment_method_id: "pm_card_visa", // In real implementation, this would come from Stripe
      });

      if (confirmData.success) {
        onPaymentSuccess(fee.id, "stripe", confirmData.transaction_id);
        setPaymentStep("success");
        
        // Auto close after success
        setTimeout(() => {
          onClose();
          resetModal();
        }, 3000);
      } else {
        throw new Error(confirmData.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Payment failed");
      setPaymentStep("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setPaymentStep("details");
    setPaymentDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    setErrorMessage("");
    setIsProcessing(false);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const calculateProcessingFee = () => {
    if (!fee) return 0;
    // 2.9% + ৳25 for Stripe processing (converted to BDT)
    return Math.round((fee.amount * 0.029 + 25) * 100) / 100;
  };

  const calculateTotal = () => {
    if (!fee) return 0;
    return fee.amount + calculateProcessingFee();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!fee) return null;

  // Don't show modal if user is not logged in or not a student
  if (!isLoggedIn || !isStudentUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment for {fee.title}</DialogTitle>
          <DialogDescription>
            Complete your payment securely using Stripe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* Fee Summary */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fee Amount:</span>
                  <span className="font-medium text-gray-800">৳{fee.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium text-gray-800">৳{calculateProcessingFee().toLocaleString()}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center text-lg font-bold bg-white p-3 rounded-lg">
                  <span className="text-gray-800">Total Amount:</span>
                  <span className="text-blue-600">৳{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-2 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600">💳</span>
                </div>
                Credit/Debit Card
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Powered by Stripe</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your payment is secured by Stripe. We don't store your card details.
              </p>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          {paymentStep === "details" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Cardholder Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={paymentDetails.cardholderName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardholderName: e.target.value})}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Card Number</label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: formatCardNumber(e.target.value)})}
                    maxLength={19}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Expiry Date</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: formatExpiryDate(e.target.value)})}
                      maxLength={5}
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">CVV</label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})}
                      maxLength={4}
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment} 
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  disabled={isProcessing || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName}
                >
                  Pay ৳{calculateTotal().toLocaleString()}
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {paymentStep === "processing" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Processing Payment...</h3>
              <p className="text-muted-foreground">Please wait while we process your payment securely</p>
            </div>
          )}

          {/* Success */}
          {paymentStep === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-800">Payment Successful!</h3>
              <p className="text-muted-foreground">Your payment has been processed successfully</p>
              <p className="text-sm text-muted-foreground mt-2">
                This window will close automatically in a few seconds
              </p>
            </div>
          )}

          {/* Error */}
          {paymentStep === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-800">Payment Failed</h3>
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={() => setPaymentStep("details")}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 
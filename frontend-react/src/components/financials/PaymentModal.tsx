import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { FeeStructure as FeeStructureType } from "../../types/financials";
import { financialApi } from "../../lib/financialApi";

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

  const handlePayment = async () => {
    if (!fee) return;

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Create payment intent
      const intentData = await financialApi.createPaymentIntent({
        student_fee_id: fee.id,
        amount: fee.amount,
        currency: "usd",
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
    // 2.9% + $0.30 for Stripe processing
    return Math.round((fee.amount * 0.029 + 0.30) * 100) / 100;
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment for {fee.title}</DialogTitle>
          <DialogDescription>
            Complete your payment securely using Stripe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Fee Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fee Amount:</span>
                  <span className="font-medium">${fee.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-medium">${calculateProcessingFee().toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">💳</span>
                Credit/Debit Card
                <Badge variant="secondary">Powered by Stripe</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
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
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={paymentDetails.cardholderName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardholderName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: formatCardNumber(e.target.value)})}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: formatExpiryDate(e.target.value)})}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment} 
                  className="bg-primary"
                  disabled={isProcessing || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName}
                >
                  Pay ${calculateTotal().toLocaleString()}
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
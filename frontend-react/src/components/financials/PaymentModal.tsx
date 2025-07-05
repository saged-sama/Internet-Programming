import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { FeeStructure as FeeStructureType } from "../../types/financials";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeStructureType | null;
  onPaymentSuccess: (feeId: string, paymentMethod: string, transactionId: string) => void;
}

export function PaymentModal({ isOpen, onClose, fee, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<"method" | "details" | "processing" | "success">("method");
  const [paymentDetails, setPaymentDetails] = useState({
    bkashNumber: "",
    transactionId: "",
    bankAccount: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const paymentMethods = [
    {
      id: "bkash",
      name: "bKash",
      icon: "💳",
      description: "Pay with bKash mobile banking",
      fee: "2% + ৳5",
    },
    {
      id: "nagad",
      name: "Nagad",
      icon: "📱",
      description: "Pay with Nagad mobile banking",
      fee: "1.5% + ৳3",
    },
    {
      id: "rocket",
      name: "Rocket",
      icon: "🚀",
      description: "Pay with Rocket mobile banking",
      fee: "2% + ৳5",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: "🏦",
      description: "Direct bank transfer",
      fee: "৳10",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Pay with your card",
      fee: "3% + ৳10",
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentStep("details");
  };

  const handlePayment = async () => {
    if (!fee) return;

    setPaymentStep("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      const transactionId = `TXN${Date.now()}`;
      onPaymentSuccess(fee.id, selectedMethod, transactionId);
      setPaymentStep("success");
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        resetModal();
      }, 3000);
    }, 2000);
  };

  const resetModal = () => {
    setSelectedMethod("");
    setPaymentStep("method");
    setPaymentDetails({
      bkashNumber: "",
      transactionId: "",
      bankAccount: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
  };

  const calculateTotal = () => {
    if (!fee) return 0;
    const method = paymentMethods.find(m => m.id === selectedMethod);
    let processingFee = 0;
    
    if (method) {
      if (method.id === "bkash" || method.id === "rocket") {
        processingFee = Math.round(fee.amount * 0.02) + 5;
      } else if (method.id === "nagad") {
        processingFee = Math.round(fee.amount * 0.015) + 3;
      } else if (method.id === "bank") {
        processingFee = 10;
      } else if (method.id === "card") {
        processingFee = Math.round(fee.amount * 0.03) + 10;
      }
    }
    
    return fee.amount + processingFee;
  };

  if (!fee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment for {fee.title}</DialogTitle>
          <DialogDescription>
            Complete your payment securely using your preferred method
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
                  <span className="font-medium">৳{fee.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-medium">
                    {selectedMethod ? `৳${(calculateTotal() - fee.amount).toLocaleString()}` : "---"}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">
                    ৳{selectedMethod ? calculateTotal().toLocaleString() : fee.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          {paymentStep === "method" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <Badge variant="secondary" className="mt-1">
                            Fee: {method.fee}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Payment Details */}
          {paymentStep === "details" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaymentStep("method")}
                >
                  ← Back
                </Button>
                <h3 className="text-lg font-semibold">
                  Payment Details - {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </h3>
              </div>

              {selectedMethod === "bkash" && (
                <div className="space-y-4">
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h4 className="font-medium text-pink-800 mb-2">bKash Payment Instructions</h4>
                    <ol className="text-sm text-pink-700 space-y-1">
                      <li>1. Dial *247# from your mobile</li>
                      <li>2. Select "Send Money"</li>
                      <li>3. Send ৳{calculateTotal().toLocaleString()} to: 01711-123456</li>
                      <li>4. Enter your bKash PIN</li>
                      <li>5. Save the transaction ID and enter it below</li>
                    </ol>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Your bKash Number</label>
                      <Input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={paymentDetails.bkashNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, bkashNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Transaction ID</label>
                      <Input
                        type="text"
                        placeholder="Enter bKash transaction ID"
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === "nagad" && (
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">Nagad Payment Instructions</h4>
                    <ol className="text-sm text-orange-700 space-y-1">
                      <li>1. Dial *167# from your mobile</li>
                      <li>2. Select "Send Money"</li>
                      <li>3. Send ৳{calculateTotal().toLocaleString()} to: 01711-123456</li>
                      <li>4. Enter your Nagad PIN</li>
                      <li>5. Save the transaction ID and enter it below</li>
                    </ol>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Transaction ID</label>
                      <Input
                        type="text"
                        placeholder="Enter Nagad transaction ID"
                        value={paymentDetails.transactionId}
                        onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate}
                          onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <Input
                          type="text"
                          placeholder="123"
                          value={paymentDetails.cvv}
                          onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handlePayment} className="bg-primary">
                  Confirm Payment ৳{calculateTotal().toLocaleString()}
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {paymentStep === "processing" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Processing Payment...</h3>
              <p className="text-muted-foreground">Please wait while we verify your payment</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
} 
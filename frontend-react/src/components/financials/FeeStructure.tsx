import { useState } from "react";
import type { FeeStructure as FeeStructureType } from "../../types/financials";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

interface FeeStructureProps {
  fees: FeeStructureType[];
  onPayment: (feeId: string) => void;
}

export function FeeStructure({ fees, onPayment }: FeeStructureProps) {
  const [selectedFee, setSelectedFee] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <h2>Fee Structure</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fees.map((fee) => (
          <Card key={fee.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{fee.title}</span>
                <Badge className={getStatusColor(fee.status)}>
                  {fee.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-bold">
                  ${fee.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Deadline: {format(new Date(fee.deadline), "PPP")}
                </p>
                {fee.status === "pending" && (
                  <Button
                    onClick={() => {
                      setSelectedFee(fee.id);
                      onPayment(fee.id);
                    }}
                    className="w-full"
                  >
                    Pay Now
                  </Button>
                )}
                {fee.status === "paid" && fee.paymentDate && (
                  <p className="text-sm text-muted-foreground">
                    Paid on: {format(new Date(fee.paymentDate), "PPP")}
                  </p>
                )}
              </div>
              <div className="hidden">
                {selectedFee}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

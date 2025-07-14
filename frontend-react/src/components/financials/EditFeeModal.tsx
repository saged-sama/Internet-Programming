import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { FeeStructure } from "../../types/financials";
import { financialApi } from "../../lib/financialApi";

interface EditFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeStructure | null;
  onSuccess: () => void;
}

export function EditFeeModal({ isOpen, onClose, fee, onSuccess }: EditFeeModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lab",
    amount: 0,
    deadline: "",
    semester: "",
    academic_year: "",
    is_installment_available: false,
    installment_count: 0,
    installment_amount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fee) {
      setFormData({
        title: fee.title || "",
        description: fee.description || "",
        type: fee.category || "lab",
        amount: fee.amount || 0,
        deadline: fee.deadline || "",
        semester: fee.semester || "",
        academic_year: fee.academicYear || "",
        is_installment_available: !!fee.installmentOptions,
        installment_count: fee.installmentOptions?.count || 0,
        installment_amount: fee.installmentOptions?.amount || 0,
      });
    }
  }, [fee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fee) return;

    setIsSubmitting(true);
    setError("");

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        amount: formData.amount,
        deadline: formData.deadline,
        semester: formData.semester,
        academic_year: formData.academic_year,
        is_installment_available: formData.is_installment_available,
        installment_count: formData.is_installment_available ? formData.installment_count : undefined,
        installment_amount: formData.is_installment_available ? formData.installment_amount : undefined,
      };

      await financialApi.updateFee(fee.id, updateData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update fee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!fee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Fee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Fee title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              >
                <option value="lab">Lab</option>
                <option value="library">Library</option>
                <option value="sports">Sports</option>
                <option value="development">Development</option>
                <option value="admission">Admission</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Fee description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (৳)</label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Semester</label>
              <Input
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="e.g., Spring 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Academic Year</label>
              <Input
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                placeholder="e.g., 2024"
              />
            </div>
          </div>

          {/* Installment Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Installment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="installment-available"
                    checked={formData.is_installment_available}
                    onChange={(e) => setFormData({ ...formData, is_installment_available: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="installment-available" className="text-sm font-medium">
                    Allow installment payments
                  </label>
                </div>

                {formData.is_installment_available && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Installments</label>
                      <Input
                        type="number"
                        value={formData.installment_count}
                        onChange={(e) => setFormData({ ...formData, installment_count: parseInt(e.target.value) || 0 })}
                        placeholder="e.g., 3"
                        min="2"
                        max="12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Amount per Installment (৳)</label>
                      <Input
                        type="number"
                        value={formData.installment_amount}
                        onChange={(e) => setFormData({ ...formData, installment_amount: parseFloat(e.target.value) || 0 })}
                        placeholder="Auto-calculated if left empty"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Updating..." : "Update Fee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
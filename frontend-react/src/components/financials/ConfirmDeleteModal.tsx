import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import type { FeeStructure } from "../../types/financials";
import { financialApi } from "../../lib/financialApi";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeStructure | null;
  onSuccess: () => void;
}

export function ConfirmDeleteModal({ isOpen, onClose, fee, onSuccess }: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!fee) return;

    setIsDeleting(true);
    setError("");

    try {
      await financialApi.deleteFee(fee.id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete fee");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!fee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div>
                <p className="font-medium text-yellow-800">Are you sure you want to delete this fee?</p>
                <p className="text-sm text-yellow-600 mt-1">This action cannot be undone.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Fee Details:</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Title:</span> {fee.title}</p>
              <p><span className="font-medium">Amount:</span> ৳{fee.amount.toLocaleString()}</p>
              <p><span className="font-medium">Category:</span> {fee.category}</p>
              <p><span className="font-medium">Deadline:</span> {fee.deadline}</p>
              {fee.semester && <p><span className="font-medium">Semester:</span> {fee.semester}</p>}
              {fee.academicYear && <p><span className="font-medium">Academic Year:</span> {fee.academicYear}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Fee"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
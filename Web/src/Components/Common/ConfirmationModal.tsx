import React from "react";
import Card from "@/Components/Common/Card";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Are you sure?",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isConfirming = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <Card
        className="w-full max-w-sm shadow-xl p-6 space-y-4 bg-primary-1 border text-center"
        padding="none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isConfirming}
              className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-primary-0 transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirming}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {isConfirming ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;

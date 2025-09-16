"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ExpenseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
  currentAmount?: number;
}

export function ExpenseEditModal({
  isOpen,
  onClose,
  onSave,
  currentAmount = 0
}: ExpenseEditModalProps) {
  const [amount, setAmount] = useState(currentAmount.toString());
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
    if (isNaN(numericAmount) || numericAmount < 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      await onSave(numericAmount);
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Error saving expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount(currentAmount.toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg shadow-lg"
        style={{
          height: '293px',
          width: '520px'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Expense
          </h2>
          <button
            onClick={handleClose}
            className="flex items-center justify-center"
            style={{
              height: '35px',
              width: '35px',
              borderRadius: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.08)'
            }}
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6">
          <p className="text-sm text-gray-600 mb-6">
            Please enter the expense for this batch
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-10">
              <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-3">
                Enter your batch expense
              </label>
              <input
                id="expense-amount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="PKR 30,000"
                className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00674F] focus:border-[#00674F]"
                style={{
                  height: '42px',
                  width: '472px',
                  borderRadius: '8px',
                  padding: '10px 12px'
                }}
                disabled={isLoading}
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="text-white font-medium hover:bg-[#005a42] focus:outline-none focus:ring-2 focus:ring-[#00674F] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                height: '45px',
                width: '472px',
                borderRadius: '12px',
                backgroundColor: '#00674F'
              }}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

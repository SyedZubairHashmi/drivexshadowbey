"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Customer {
  _id: string;
  vehicle: {
    companyName: string;
    model: string;
    chassisNumber: string;
  };
  customer: {
    name: string;
    phoneNumber: string;
    email?: string;
    address?: string;
  };
  sale: {
    saleDate: string;
    salePrice: number;
    paidAmount: number;
    remainingAmount: number;
    paymentStatus: string;
    note?: string;
    document?: string;
  };
  payments: Array<{
    _id?: string;
    paymentDate: string;
    amountPaid: number;
    remainingAfterPayment: number;
    totalPaidUpToDate: number;
    installmentNumber: number;
    paymentMethod: {
      type: string;
      details?: {
        bankName?: string;
        ibanNo?: string;
        accountNo?: string;
        chequeNo?: string;
        chequeClearanceDate?: string;
        slipNo?: string;
      };
    };
    status: string;
    note?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CustomerUpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSubmit: (data: any) => void;
}

const paymentMethods = [
  { value: "Cash", label: "Cash" },
  { value: "Bank", label: "Bank" },
  { value: "Cheque", label: "Cheque" },
  { value: "BankDeposit", label: "Bank Deposit" },
];

const statusOptions = [
  { value: "Completed", label: "Completed" },
  { value: "Pending", label: "Pending" },
];

export function CustomerUpdatePaymentModal({ isOpen, onClose, customer, onSubmit }: CustomerUpdatePaymentModalProps) {
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0], // Add payment date field
    paymentStatus: "Pending",
    salePrice: "",
    currentTotalPaid: "", // Current total paid from existing payments
    newPaymentAmount: "", // New payment amount user is entering
    remainingAmount: "", // Current remaining balance
    paymentMethod: "",
    notes: "",
    // Bank fields
    bankName: "",
    ibanNo: "",
    accountNo: "",
    // Cheque fields
    chequeNumber: "",
    chequeBankName: "",
    // Bank deposit fields
    depositBankName: "",
    slipNo: "",
  });

  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when customer changes
  useEffect(() => {
    if (customer) {
      const salePrice = customer.sale.salePrice || 0;
      const currentPaidAmount = customer.sale.paidAmount || 0;
      const currentRemainingAmount = customer.sale.remainingAmount || 0;
      
      setFormData({
        paymentDate: new Date().toISOString().split('T')[0], // Default to today's date
        paymentStatus: "Pending", // Always start with pending for new payment
        salePrice: salePrice.toString(),
        currentTotalPaid: currentPaidAmount.toString(), // Current total paid from customer.sale.paidAmount
        newPaymentAmount: "", // User will enter new payment amount
        remainingAmount: currentRemainingAmount.toString(), // Current remaining balance from customer.sale.remainingAmount
        paymentMethod: "",
        notes: "",
        // Bank fields
        bankName: "",
        ibanNo: "",
        accountNo: "",
        // Cheque fields
        chequeNumber: "",
        chequeBankName: "",
        // Bank deposit fields
        depositBankName: "",
        slipNo: "",
      });
    }
  }, [customer]);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showPaymentMethodDropdown && !target.closest('.payment-method-dropdown')) {
        setShowPaymentMethodDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPaymentMethodDropdown]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate remaining amount when new payment amount changes
      if (field === 'newPaymentAmount') {
        const salePrice = parseFloat(prev.salePrice) || 0;
        const currentTotalPaid = parseFloat(prev.currentTotalPaid) || 0;
        const newPaymentAmount = parseFloat(value) || 0;
        
        // New total paid amount = current total + new payment
        const newTotalPaid = currentTotalPaid + newPaymentAmount;
        const newRemainingAmount = Math.max(0, salePrice - newTotalPaid);
        
        newData.remainingAmount = newRemainingAmount.toString();
      }
      
      return newData;
    });
  };

  const selectPaymentMethod = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    setShowPaymentMethodDropdown(false);
  };

  const handleClose = () => {
    setFormData({
      paymentDate: new Date().toISOString().split('T')[0],
      paymentStatus: "Pending",
      salePrice: "",
      currentTotalPaid: "",
      newPaymentAmount: "",
      remainingAmount: "",
      paymentMethod: "",
      notes: "",
      bankName: "",
      ibanNo: "",
      accountNo: "",
      chequeNumber: "",
      chequeBankName: "",
      depositBankName: "",
      slipNo: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) {
      console.error('No customer data available');
      return;
    }

      // Validate required fields
    if (!formData.newPaymentAmount || parseFloat(formData.newPaymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (!formData.paymentMethod) {
      alert('Please select a payment method');
        return;
      }

    setIsLoading(true);
    try {
      // Prepare payment data for new customer model
      const paymentData = {
        paymentDate: formData.paymentDate, // Use the date from form
        amountPaid: parseFloat(formData.newPaymentAmount),
        paymentMethod: {
          type: formData.paymentMethod,
          details: {
            ...(formData.paymentMethod === 'Bank' && {
              bankName: formData.bankName,
              ibanNo: formData.ibanNo,
              accountNo: formData.accountNo,
            }),
            ...(formData.paymentMethod === 'Cheque' && {
              bankName: formData.chequeBankName,
              chequeNo: formData.chequeNumber,
            }),
            ...(formData.paymentMethod === 'BankDeposit' && {
              bankName: formData.depositBankName,
              slipNo: formData.slipNo,
            }),
          }
        },
        status: formData.paymentStatus,
        note: formData.notes,
      };

      // Submit payment to API
      const response = await fetch(`/api/customers/${customer._id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        // Call the onSubmit callback with updated customer data
        onSubmit(result.data);
        handleClose();
      } else {
        alert(result.error || 'Failed to add payment');
      }
    } catch (error) {
      alert('Failed to add payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Force re-render when payment method changes
  useEffect(() => {
    setModalKey(prev => prev + 1);
  }, [formData.paymentMethod]);

  const modalHeight = useMemo(() => {
    if (formData.paymentMethod === "Bank") return "680px";
    if (formData.paymentMethod === "Cheque") return "700px";
    if (formData.paymentMethod === "BankDeposit") return "700px";
    return "680px";
  }, [formData.paymentMethod]);

  const topPadding = useMemo(() => {
    return "16px"; // Reduced from 24px/0px to consistent 16px
  }, [formData.paymentMethod]);

  const titleSpacing = useMemo(() => {
    return "8px"; // Reduced gap between title and status buttons
  }, [formData.paymentMethod]);

  const labelInputGap = useMemo(() => {
    if (formData.paymentMethod === "Bank" || formData.paymentMethod === "BankDeposit" || formData.paymentMethod === "Cheque") return "0px";
    return "8px";
  }, [formData.paymentMethod]);

  const formContainerGap = useMemo(() => {
    if (formData.paymentMethod === "Bank") return "4px";
    if (formData.paymentMethod === "BankDeposit" || formData.paymentMethod === "Cheque") return "6px";
    return "10px";
  }, [formData.paymentMethod]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        key={modalKey} // Force re-render when payment method changes
        className=" border border-gray-300 bg-white"
        style={{
          width: '520px',
          height: modalHeight,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '12px',
          borderWidth: '1px',
          paddingTop: topPadding,
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '16px',
          
          opacity: 1
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Changing Status</h2>
            <p className="text-sm text-gray-600">Once Changed status can't be edit</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-0 rounded-full"
            style={{
              width: '35px',
              height: '35px',
              opacity: 1,
              background: '#00000014'
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Fields Container */}
        <div 
              style={{
            width: '100%',
            maxWidth: '472px',
            height: '480px', // Reduced height to make room for fixed button
            gap: formContainerGap,
            opacity: 1,
            display: 'flex',
            flexDirection: 'column',
            marginTop: titleSpacing,
            overflowY: 'auto',
            overflowX: 'hidden', // Prevent horizontal scrolling
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}
          className="scrollbar-hide" // Tailwind class for webkit browsers
        >
          {/* Status Selection */}
          <div className="flex flex-col gap-4">
                {statusOptions.map((option) => {
                  // Disable Completed status if there's remaining balance after this payment
                  const newPaymentAmount = parseFloat(formData.newPaymentAmount) || 0;
                  const currentTotalPaid = parseFloat(formData.currentTotalPaid) || 0;
                  const salePrice = parseFloat(formData.salePrice) || 0;
                  const newTotalPaid = currentTotalPaid + newPaymentAmount;
                  const newRemainingAmount = salePrice - newTotalPaid;
                  
                  const isCompletedDisabled = option.value === "Completed" && newRemainingAmount > 0;
                  
                  return (
              <label key={option.value} className={`flex ${isCompletedDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input
                  type="radio"
                  name="paymentStatus"
                  value={option.value}
                  checked={formData.paymentStatus === option.value}
                  onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                  disabled={isCompletedDisabled}
                  className="sr-only"
                />
                <div
                  className="flex items-center justify-start"
                    style={{
                    width: '100%',
                    height: '45px',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    padding: '12px',
                    gap: '8px',
                    opacity: 1,
                    backgroundColor: formData.paymentStatus === option.value ? '#0D97001A' : 'transparent',
                    borderColor: formData.paymentStatus === option.value ? '#0D9700' : '#D1D5DB',
                    color: formData.paymentStatus === option.value ? '#0D9700' : '#6B7280'
                  }}
                >
                  <div
                    className="rounded-full border-2 flex justify-center"
                        style={{
                      width: '16px',
                      height: '16px',
                      borderColor: formData.paymentStatus === option.value ? '#0D9700' : '#D1D5DB',
                      backgroundColor: formData.paymentStatus === option.value ? '#0D9700' : 'transparent'
                        }}
                      >
                        {formData.paymentStatus === option.value && (
                          <div 
                        className="rounded-full"
                        style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#0D970080'
                        }}
                          />
                        )}
                      </div>
                  <span className="text-sm font-medium">{option.label}</span>
                    </div>
              </label>
                  );
                })}
        </div>

          {/* Payment Date */}
          <div>
            <Label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: labelInputGap }}>Payment Date</Label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleInputChange('paymentDate', e.target.value)}
              style={{
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                padding: '12px',
                height: '45px',
                width: '100%',
                background: '#FFFFFF'
              }}
              className="placeholder:text-sm"
            />
          </div>

          {/* Sale Price and Total Paid Amount in same row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Sale Price</Label>
            <Input
              type="number"
              value={formData.salePrice}
              readOnly
              placeholder="Sale price"
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '12px',
                  height: '45px',
                  width: '100%',
                  background: '#F9FAFB',
                  color: '#6B7280',
                  
                }}
                className="placeholder:text-sm"
            />
          </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Total Paid Amount</Label>
            <Input
              type="number"
              value={formData.currentTotalPaid}
              readOnly
              placeholder="Total paid amount"
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '12px',
                  height: '45px',
                  width: '100%',
                  background: '#F9FAFB',
                  color: '#6B7280',
                }}
                className="placeholder:text-sm"
            />
          </div>
        </div>

          {/* Remaining Balance and Paid Amount in same row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Remaining Balance</Label>
            <Input
              type="number"
              value={formData.remainingAmount}
              readOnly
                placeholder="Remaining balance"
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '12px',
                  height: '45px',
                  width: '100%',
                  background: '#F9FAFB',
                  color: '#6B7280',
                }}
                className="placeholder:text-sm"
            />
          </div>
            <div>
              <Label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: labelInputGap }}>Paid Amount</Label>
            <Input
              type="number"
              value={formData.newPaymentAmount}
              onChange={(e) => handleInputChange('newPaymentAmount', e.target.value)}
              placeholder="Enter new payment amount"
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '12px',
                  height: '45px',
                  width: '100%',
                  background: '#FFFFFF',
                }}
                className="placeholder:text-sm"
            />
          </div>
        </div>

        {/* Payment Method */}
          <div>
            <Label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: labelInputGap }}>Payment Method</Label>
          <div className="relative payment-method-dropdown">
              <Button
              type="button"
                variant="outline"
              onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                className="w-full justify-between placeholder:text-sm"
              style={{
                  height: '45px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                padding: '12px',
                  background: '#FFFFFF',
                }}
              >
                <span>{paymentMethods.find(m => m.value === formData.paymentMethod)?.label || "Select payment method"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            {showPaymentMethodDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => selectPaymentMethod(method.value)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                      {method.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

          {/* Payment Method Specific Fields */}
          {formData.paymentMethod === "Cheque" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Bank Name</Label>
              <Input
                value={formData.chequeBankName}
                onChange={(e) => handleInputChange('chequeBankName', e.target.value)}
                placeholder="Enter bank name"
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    height: '45px',
                    width: '100%',
                    background: '#FFFFFF',
                  }}
                  className="placeholder:text-sm"
              />
            </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Cheque Number</Label>
              <Input
                value={formData.chequeNumber}
                onChange={(e) => handleInputChange('chequeNumber', e.target.value)}
                placeholder="Enter cheque number"
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    height: '45px',
                    width: '100%',
                    background: '#FFFFFF',
                  }}
                  className="placeholder:text-sm"
              />
            </div>
          </div>
        )}

          {formData.paymentMethod === "BankDeposit" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Bank Name</Label>
              <Input
                value={formData.depositBankName}
                onChange={(e) => handleInputChange('depositBankName', e.target.value)}
                placeholder="Enter bank name"
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    height: '45px',
                    width: '100%',
                    background: '#FFFFFF',
                  }}
                  className="placeholder:text-sm"
              />
            </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Slip No</Label>
              <Input
                value={formData.slipNo}
                onChange={(e) => handleInputChange('slipNo', e.target.value)}
                placeholder="Enter slip number"
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    height: '45px',
                    width: '100%',
                    background: '#FFFFFF',
                  }}
                  className="placeholder:text-sm"
              />
            </div>
          </div>
        )}

          {formData.paymentMethod === "Bank" && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Bank Name</Label>
                <Input
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Enter bank name"
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    height: '45px',
                    width: '100%',
                    background: '#FFFFFF',
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>IBAN/Account No</Label>
                  <Input
                    value={formData.ibanNo}
                    onChange={(e) => handleInputChange('ibanNo', e.target.value)}
                    placeholder="Enter IBAN or Account No"
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '12px',
                      height: '45px',
                      width: '100%',
                      background: '#FFFFFF',
                    }}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: labelInputGap }}>Account No</Label>
                  <Input
                    value={formData.accountNo}
                    onChange={(e) => handleInputChange('accountNo', e.target.value)}
                    placeholder="Enter account number"
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '12px',
                      height: '45px',
                      width: '100%',
                      background: '#FFFFFF',
                    }}
                  />
                </div>
            </div>
          </div>
        )}

        {/* Notes */}
          <div>
            <Label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: labelInputGap }}>Notes (optional)</Label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter notes"
              rows={formData.paymentMethod === "Bank" ? 2 : 3}
            style={{
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                
                padding: '12px',
                width: '100%',
                height: formData.paymentMethod === "Bank" ? '80px' : '100px',
                background: '#FFFFFF',
                resize: 'none',
            }}
            className="placeholder:text-sm"
          />
        </div>

        </div>

        {/* Fixed Save Button at Bottom */}
        <div 
          className="flex justify-center"
          style={{
            width: '100%',
            marginTop: '12px'
          }}
        >
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-white w-full"
            style={{
              height: '45px',
              borderRadius: '8px',
              backgroundColor: isLoading ? '#9CA3AF' : '#00674F',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              'Save & close'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
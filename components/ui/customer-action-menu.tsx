"use client"

import { useState } from "react"
import { MoreHorizontal, History, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomerUpdatePaymentModal } from "./customer-update-payment-modal"

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
    paymentStatus: string;
    note?: string;
    document?: string;
  };
  payments?: Array<{
    _id?: string;
    paymentDate: string;
    amount: number;
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

interface CustomerActionMenuProps {
  customer: Customer
  onGenerateInvoice?: () => void
  onPaymentHistory?: () => void
  onUpdatePayment?: () => void
  onDelete?: () => void
  onView?: () => void
}

export function CustomerActionMenu({ customer, onGenerateInvoice, onPaymentHistory, onUpdatePayment }: CustomerActionMenuProps) {
  const [isUpdatePaymentModalOpen, setIsUpdatePaymentModalOpen] = useState(false)

  const handleGenerateInvoice = () => {
    console.log("Generate invoice for customer:", customer);
    onGenerateInvoice?.();
  };

  const handlePaymentHistory = () => {
    console.log("View payment history for customer:", customer);
    onPaymentHistory?.();
  };

  const handleUpdatePayment = () => {
    console.log("Update payment for customer:", customer);
    setIsUpdatePaymentModalOpen(true);
  };

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleGenerateInvoice}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none" className="mr-2">
              <path d="M2.875 12.625H9.125C9.81536 12.625 10.375 12.0654 10.375 11.375V5.38388C10.375 5.21812 10.3092 5.05915 10.1919 4.94194L6.80806 1.55806C6.69085 1.44085 6.53188 1.375 6.36612 1.375H2.875C2.18464 1.375 1.625 1.93464 1.625 2.625V11.375C1.625 12.0654 2.18464 12.625 2.875 12.625Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Invoice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePaymentHistory}>
            <History className="h-4 w-4 mr-2" />
            Payment History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUpdatePayment}>
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

      <CustomerUpdatePaymentModal
        isOpen={isUpdatePaymentModalOpen}
        onClose={() => setIsUpdatePaymentModalOpen(false)}
        customer={customer}
        onSubmit={() => {
          console.log("Payment updated successfully");
          setIsUpdatePaymentModalOpen(false);
          // Refresh the customer data by calling the parent callback
          onUpdatePayment?.();
        }}
      />
    </>
  )
}
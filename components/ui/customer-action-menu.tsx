"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatusChangeModal } from "./status-change-modal"
import SuccessPopupCard from "./success-popup-card"

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
  createdAt: string;
  updatedAt: string;
}

interface CustomerActionMenuProps {
  customer: Customer
  onGenerateInvoice?: () => void
  onChangeStatus?: (newStatus: string) => Promise<boolean>
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
}

export function CustomerActionMenu({ customer, onGenerateInvoice, onChangeStatus, onEdit }: CustomerActionMenuProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGenerateInvoice = () => {
    console.log("Generate invoice for customer:", customer);
    onGenerateInvoice?.();
  };

  const handleChangeStatus = () => {
    console.log("Change status for customer:", customer);
    setIsStatusModalOpen(true);
  };

  const handleEdit = () => {
    console.log("Edit customer:", customer);
    onEdit?.();
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      console.log("Updating status to:", newStatus);
      
      // Call API to update customer status
      const response = await fetch(`/api/customers/${customer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle: customer.vehicle,
          customer: customer.customer,
          sale: {
            ...customer.sale,
            paymentStatus: newStatus
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update status:', errorData);
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
        return false; // Return false to indicate error
      }

      const result = await response.json();
      
      // Verify the response indicates success
      if (result.success === true) {
        console.log("Status updated successfully:", result);
        
        // Don't call onChangeStatus here - let StatusChangeModal handle the success first
        // The StatusChangeModal will call onClose which will trigger a refresh
        console.log("Returning true for success");
        return true; // Return true to indicate success
      } else {
        console.error('API returned success: false', result);
        alert(`Failed to update status: ${result.error || 'Unknown error'}`);
        return false; // Return false to indicate error
      }
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
      return false; // Return false to indicate error
    }
  };

  const handleStatusModalClose = () => {
    setIsStatusModalOpen(false)
    // Show success popup after modal closes
    setShowSuccess(true)
    // Auto-hide success popup after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      // Refresh the data after success popup closes
      onChangeStatus?.(customer.sale.paymentStatus)
    }, 3000)
  }

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
        <DropdownMenuItem onClick={handleChangeStatus}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="mr-2" style={{ width: '13.333px', height: '13.333px', flexShrink: 0 }}>
              <path d="M7.03399 11.6666L8.93398 9.78331L7.03399 7.89998L6.33399 8.59998L7.05065 9.31665C6.73954 9.32776 6.43687 9.27776 6.14265 9.16665C5.84843 9.05553 5.58443 8.88331 5.35065 8.64998C5.12843 8.42776 4.95887 8.1722 4.84199 7.88331C4.7251 7.59442 4.66687 7.30553 4.66732 7.01665C4.66732 6.82776 4.69243 6.63887 4.74265 6.44998C4.79287 6.26109 4.86221 6.07776 4.95065 5.89998L4.21732 5.16665C4.02843 5.44442 3.88954 5.73887 3.80065 6.04998C3.71176 6.36109 3.66732 6.67776 3.66732 6.99998C3.66732 7.4222 3.75065 7.83887 3.91732 8.24998C4.08399 8.66109 4.32843 9.02776 4.65065 9.34998C4.97287 9.6722 5.33399 9.91398 5.73399 10.0753C6.13399 10.2366 6.5451 10.3226 6.96732 10.3333L6.33399 10.9666L7.03399 11.6666ZM9.78399 8.83331C9.97287 8.55553 10.1118 8.26109 10.2007 7.94998C10.2895 7.63887 10.334 7.3222 10.334 6.99998C10.334 6.57776 10.2533 6.1582 10.092 5.74131C9.93065 5.32442 9.6891 4.95509 9.36732 4.63331C9.04554 4.31153 8.68154 4.07265 8.27532 3.91665C7.8691 3.76065 7.45532 3.68287 7.03399 3.68331L7.66732 3.03331L6.96732 2.33331L5.06732 4.21665L6.96732 6.09998L7.66732 5.39998L6.93398 4.66665C7.23398 4.66665 7.53954 4.72509 7.85065 4.84198C8.16176 4.95887 8.42843 5.1282 8.65065 5.34998C8.87287 5.57176 9.04243 5.82731 9.15932 6.11665C9.27621 6.40598 9.33443 6.69487 9.33399 6.98331C9.33399 7.1722 9.3091 7.36109 9.25932 7.54998C9.20954 7.73887 9.13999 7.9222 9.05065 8.09998L9.78399 8.83331ZM7.00065 13.6666C6.07843 13.6666 5.21176 13.4915 4.40065 13.1413C3.58954 12.7911 2.88399 12.3162 2.28399 11.7166C1.68399 11.1171 1.2091 10.4115 0.859319 9.59998C0.509541 8.78842 0.33443 7.92176 0.333985 6.99998C0.333541 6.0782 0.508652 5.21153 0.859319 4.39998C1.20999 3.58842 1.68487 2.88287 2.28399 2.28331C2.8831 1.68376 3.58865 1.20887 4.40065 0.858646C5.21265 0.508424 6.07932 0.333313 7.00065 0.333313C7.92199 0.333313 8.78865 0.508424 9.60065 0.858646C10.4127 1.20887 11.1182 1.68376 11.7173 2.28331C12.3164 2.88287 12.7915 3.58842 13.1427 4.39998C13.4938 5.21153 13.6687 6.0782 13.6673 6.99998C13.666 7.92176 13.4909 8.78842 13.142 9.59998C12.7931 10.4115 12.3182 11.1171 11.7173 11.7166C11.1164 12.3162 10.4109 12.7913 9.60065 13.142C8.79043 13.4926 7.92376 13.6675 7.00065 13.6666ZM7.00065 12.3333C8.48954 12.3333 9.75065 11.8166 10.784 10.7833C11.8173 9.74998 12.334 8.48887 12.334 6.99998C12.334 5.51109 11.8173 4.24998 10.784 3.21665C9.75065 2.18331 8.48954 1.66665 7.00065 1.66665C5.51176 1.66665 4.25065 2.18331 3.21732 3.21665C2.18399 4.24998 1.66732 5.51109 1.66732 6.99998C1.66732 8.48887 2.18399 9.74998 3.21732 10.7833C4.25065 11.8166 5.51176 12.3333 7.00065 12.3333Z" fill="black"/>
            </svg>
          Change Status
        </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-2">
              <path d="M11.7167 6.51667L12.4833 7.28333L4.93333 14.8333H4.16667V14.0667L11.7167 6.51667ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L13.8417 7.28333L15.7333 5.39167L13.6083 3.26667L11.7167 5.15833Z" fill="black"/>
            </svg>
            Edit
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={handleStatusModalClose}
        currentStatus={customer.sale.paymentStatus}
        onStatusChange={handleStatusChange}
        customerName={customer.customer.name}
      />

      {/* Success Popup Card - Rendered independently of modal */}
      <SuccessPopupCard
        heading="Status Updated"
        message="The status has been updated"
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}

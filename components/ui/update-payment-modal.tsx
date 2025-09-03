"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Calendar, ChevronDown } from "lucide-react";
import { investorAPI, batchAPI } from "@/lib/api";

interface UpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}



const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "cheque", label: "Cheque" },
  { value: "bank_deposit", label: "Bank Deposit" },
];

export function UpdatePaymentModal({ isOpen, onClose, onSubmit }: UpdatePaymentModalProps) {
  const [formData, setFormData] = useState({
    investorName: "",
    investorId: "",
    investmentAmount: "",
    percentageShare: "",
    amountPaid: "",
    remainingPaid: "",
    paymentDate: "",
    paymentMethod: "",
    selectedBatch: "",
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
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [showInvestorDropdown, setShowInvestorDropdown] = useState(false);
  const [isInvestorAutoFilled, setIsInvestorAutoFilled] = useState(false);
  const [originalInvestorData, setOriginalInvestorData] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [batchInvestors, setBatchInvestors] = useState<any[]>([]);
  const [currentBatchNo, setCurrentBatchNo] = useState<string>("");

  // Fetch batches and current batch investors on component mount
  useEffect(() => {
    const fetchBatchesAndInvestors = async () => {
      try {
        // Get current batch number from URL
        const urlParams = new URLSearchParams(window.location.search);
        const batchNo = urlParams.get('batchNo');
        setCurrentBatchNo(batchNo || "");

        // Fetch all batches
        const batchesResponse = await batchAPI.getAll();
        if (batchesResponse.success) {
          setBatches(batchesResponse.data);
        }

        // Fetch investors for current batch
        if (batchNo) {
          const investorsResponse = await investorAPI.getAll({ batchNo });
          if (investorsResponse.success) {
            setBatchInvestors(investorsResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching batches and investors:', error);
      }
    };
    
    if (isOpen) {
      fetchBatchesAndInvestors();
    }
  }, [isOpen]);

  // Handle click outside for payment method dropdown
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

  // Handle click outside for batch dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showBatchDropdown && !target.closest('.batch-dropdown')) {
        setShowBatchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBatchDropdown]);

  // Handle click outside for investor dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showInvestorDropdown && !target.closest('.investor-dropdown')) {
        setShowInvestorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInvestorDropdown]);

  const handleInputChange = (field: string, value: string) => {
    let newValue = value;
    
    // Auto-format CNIC field
    if (field === 'investorId') {
      // Remove all non-digits first
      const digitsOnly = value.replace(/\D/g, '');
      
      // Limit to 13 digits maximum
      if (digitsOnly.length > 13) {
        return; // Don't update if more than 13 digits
      }
      
      // Auto-format with hyphens
      if (digitsOnly.length <= 5) {
        newValue = digitsOnly;
      } else if (digitsOnly.length <= 12) {
        newValue = digitsOnly.slice(0, 5) + '-' + digitsOnly.slice(5);
      } else {
        newValue = digitsOnly.slice(0, 5) + '-' + digitsOnly.slice(5, 12) + '-' + digitsOnly.slice(12);
      }
    }

    setFormData(prev => ({ ...prev, [field]: newValue }));

    // Auto-fill investor details when name is entered
    if (field === 'investorName' && value.trim()) {
      searchInvestor(value.trim());
    }

    // Calculate remaining amount when amount paid is entered
    if (field === 'amountPaid') {
      const amountPaid = parseFloat(newValue) || 0;
      const pastRemaining = parseFloat(formData.investmentAmount) || 0; // This is past remaining amount
      const newRemaining = Math.max(0, pastRemaining - amountPaid);
      
      setFormData(prev => ({
        ...prev,
        remainingPaid: newRemaining.toString()
      }));
    }
  };

  const searchInvestor = async (searchTerm: string) => {
    try {
      // Search by name only
      const response = await investorAPI.getAll({
        name: searchTerm, // Use name-specific search instead of general search
        limit: 1
      });

      if (response.success && response.data.length > 0) {
        const investor = response.data[0];
        
        // Store original investor data for calculations
        setOriginalInvestorData(investor);
        
        // Auto-fill the form with investor details
        // investmentAmount now shows the past remaining amount from database
        setFormData(prev => ({
          ...prev,
          investorName: investor.name, // This will update the name field
          investorId: investor.investorId,
          investmentAmount: investor.remainingAmount.toString(), // Past remaining amount
          percentageShare: investor.percentageShare.toString(),
          amountPaid: "", // Clear amount paid for new payment
          remainingPaid: investor.remainingAmount.toString() // Initial remaining (same as past remaining)
        }));
        
        // Set flag to indicate investor was auto-filled
        setIsInvestorAutoFilled(true);
      } else {
        // Reset flag if no investor found
        setIsInvestorAutoFilled(false);
      }
    } catch (error) {
      console.error('Error searching investor:', error);
      setIsInvestorAutoFilled(false);
    }
  };

  const selectPaymentMethod = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    setShowPaymentMethodDropdown(false);
  };

  const selectBatch = (batchNo: string) => {
    setFormData(prev => ({ ...prev, selectedBatch: batchNo }));
    setShowBatchDropdown(false);
  };

  const selectInvestor = (investor: any) => {
    // Auto-fill the form with investor details
    setFormData(prev => ({
      ...prev,
      investorName: investor.name,
      investorId: investor.investorId,
      investmentAmount: investor.remainingAmount.toString(),
      percentageShare: investor.percentageShare.toString(),
      amountPaid: "",
      remainingPaid: investor.remainingAmount.toString()
    }));
    
    // Store original investor data for calculations
    setOriginalInvestorData(investor);
    setIsInvestorAutoFilled(true);
    setShowInvestorDropdown(false);
  };

  const clearForm = () => {
    setFormData({
      investorName: "",
      investorId: "",
      investmentAmount: "",
      percentageShare: "",
      amountPaid: "",
      remainingPaid: "",
      paymentDate: "",
      paymentMethod: "",
      selectedBatch: "",
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
    setIsInvestorAutoFilled(false);
    setOriginalInvestorData(null);
    setShowInvestorDropdown(false);
  };

  const handleClose = () => {
    clearForm();
    setShowInvestorDropdown(false);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.investorName.trim()) {
        alert('Please enter investor name');
        return;
      }
      if (!formData.amountPaid.trim()) {
        alert('Please enter amount paid');
        return;
      }
      if (!formData.paymentDate.trim()) {
        alert('Please enter payment date');
        return;
      }
      if (!formData.paymentMethod.trim()) {
        alert('Please select payment method');
        return;
      }

      // Prepare payment method data
      let paymentMethodData = {
        type: formData.paymentMethod,
        details: {}
      };

      // Map form values to model enum values
      if (formData.paymentMethod === 'bank') {
        paymentMethodData.type = 'Bank';
        paymentMethodData.details = {
          bankName: formData.bankName,
          ibanNo: formData.ibanNo,
          accountNo: formData.accountNo
        };
      } else if (formData.paymentMethod === 'cheque') {
        paymentMethodData.type = 'Cheque';
        paymentMethodData.details = {
          chequeNo: formData.chequeNumber,
          bankName: formData.chequeBankName
        };
      } else if (formData.paymentMethod === 'bank_deposit') {
        paymentMethodData.type = 'BankDeposit';
        paymentMethodData.details = {
          bankName: formData.depositBankName,
          slipNo: formData.slipNo
        };
      } else if (formData.paymentMethod === 'cash') {
        paymentMethodData.type = 'Cash';
        paymentMethodData.details = {};
      }

      // Calculate the correct values for database update
      const pastRemaining = Number(formData.investmentAmount); // Past remaining amount from DB
      const newAmountPaid = Number(formData.amountPaid); // New payment amount
      const newRemaining = Number(formData.remainingPaid); // Calculated remaining amount
      
      // Get the original investor data to get the MongoDB _id and preserve existing data
      const investorResponse = await investorAPI.getAll({
        search: formData.investorName,
        limit: 1
      });
      
      if (!investorResponse.success || investorResponse.data.length === 0) {
        throw new Error('Investor not found');
      }

      const originalInvestor = investorResponse.data[0];
      const investorId = originalInvestor._id; // MongoDB _id
      
      // Calculate total amount paid (past amount paid + new amount paid)
      const totalAmountPaid = originalInvestor.amountPaid + newAmountPaid;

      // Prepare investor data for update - preserve existing data and only update payment-related fields
      const investorData = {
        // Preserve all existing data
        name: originalInvestor.name,
        contactNumber: originalInvestor.contactNumber,
        emailAddress: originalInvestor.emailAddress,
        investorId: originalInvestor.investorId,
        investAmount: originalInvestor.investAmount,
        percentageShare: originalInvestor.percentageShare,
        batchNo: originalInvestor.batchNo,
        // Update payment-related fields
        amountPaid: totalAmountPaid, // Total amount paid (past + new)
        remainingAmount: newRemaining, // New calculated remaining amount
        paymentDate: formData.paymentDate,
        paymentMethod: paymentMethodData
      };

      // Update the investor in database using MongoDB _id
      const response = await investorAPI.update(investorId, investorData);
      
      if (response.success) {
        console.log('Payment updated successfully:', response.data);
        onSubmit(formData);
        clearForm();
        onClose();
      } else {
        console.error('Failed to update payment:', response.error);
        alert('Failed to update payment: ' + response.error);
      }
    } catch (error: any) {
      console.error('Error updating payment:', error);
      alert('Error updating payment: ' + (error.message || 'Please try again.'));
    }
  };

  const getModalHeight = () => {
    switch (formData.paymentMethod) {
      case "bank":
        return "710px";
      case "cheque":
      case "bank_deposit":
        return "620px";
      default:
        return "530px";
    }
  };

  const getModalTop = () => {
    switch (formData.paymentMethod) {
      case "bank":
        return "90px";
      case "cheque":
      case "bank_deposit":
        return "135px";
      default:
        return "173px";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div
         className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col"
         style={{
           width: "520px",
           height: getModalHeight(),
           top: getModalTop(),
           left: "460px",
           gap: "24px",
         }}
       >
                 {/* Header */}
         <div className="space-y-4">
           {/* Close Button */}
           <div className="flex justify-between">
           <div>
                     <h2 className="text-xl font-semibold text-gray-900">Batch Investor Payment</h2>
        <p className="text-sm text-gray-600 mt-1">Update Batch Investor Payment</p>
           </div>
                <Button
                variant="ghost"
                onClick={handleClose}
                style={{
                  width: "35px",
                  height: "35px",
                  opacity: 1,
                  background: "#00000014",
                }}
                className="p-0 rounded-full"
              >
               <X className="h-4 w-4" />
             </Button>
           
           </div>
           {/* Title */}
         </div>

                                                                       {/* Form */}
                       <div className="space-y-4">
                       {/* Investor Details */}
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Investor Name</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter Investor Name"
                    value={formData.investorName}
                    onChange={(e) => handleInputChange("investorName", e.target.value)}
                    onClick={() => setShowInvestorDropdown(!showInvestorDropdown)}
                    style={{
                      width: "230px",
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 40px 10px 12px",
                      cursor: "pointer",
                    }}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  
                  {showInvestorDropdown && batchInvestors.length > 0 && (
                    <div className="investor-dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {batchInvestors.slice(0, 5).map((investor) => (
                        <div
                          key={investor._id}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectInvestor(investor)}
                        >
                          {investor.name}
                        </div>
                      ))}
                      {batchInvestors.length > 5 && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center border-t border-gray-100">
                          Scroll for more ({batchInvestors.length - 5} more)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">ID/CNIC</Label>
                <Input
                  placeholder="54303-5476210-3"
                  value={formData.investorId}
                  onChange={(e) => handleInputChange("investorId", e.target.value)}
                  style={{
                    width: "230px",
                    height: "42px",
                    borderRadius: "8px",
                    borderWidth: "1px",
                    padding: "10px 12px",
                  }}
                />
              </div>
            </div>

                     {/* Investment Details */}
           <div className="flex gap-4">
             <div className="space-y-1">
                               <Label className="text-sm font-medium text-gray-700">Past Remaining Amount</Label>
               <Input
                 placeholder="Past remaining amount from database"
                 value={formData.investmentAmount}
                 onChange={(e) => handleInputChange("investmentAmount", e.target.value)}
                 readOnly={isInvestorAutoFilled}
                 style={{
                   width: "230px",
                   height: "42px",
                   borderRadius: "8px",
                   borderWidth: "1px",
                   padding: "10px 12px",
                   backgroundColor: isInvestorAutoFilled ? "#f3f4f6" : "white",
                   cursor: isInvestorAutoFilled ? "not-allowed" : "text"
                 }}
               />
             </div>
             <div className="space-y-1">
                               <Label className="text-sm font-medium text-gray-700">Percentage Share</Label>
               <Input
                 placeholder="Enter Percentage Share"
                 value={formData.percentageShare}
                 onChange={(e) => handleInputChange("percentageShare", e.target.value)}
                 readOnly={isInvestorAutoFilled}
                 style={{
                   width: "230px",
                   height: "42px",
                   borderRadius: "8px",
                   borderWidth: "1px",
                   padding: "10px 12px",
                   backgroundColor: isInvestorAutoFilled ? "#f3f4f6" : "white",
                   cursor: isInvestorAutoFilled ? "not-allowed" : "text"
                 }}
               />
             </div>
           </div>

                     {/* Payment Amounts */}
           <div className="flex gap-4">
             <div className="space-y-1">
                               <Label className="text-sm font-medium text-gray-700">Amount Paid</Label>
               <Input
                 placeholder="Enter Amount Paid"
                 value={formData.amountPaid}
                 onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                 style={{
                   width: "230px",
                   height: "42px",
                   borderRadius: "8px",
                   borderWidth: "1px",
                   padding: "10px 12px",
                 }}
               />
             </div>
             <div className="space-y-1">
                               <Label className="text-sm font-medium text-gray-700">Remaining Paid (Auto-calculated)</Label>
               <Input
                 placeholder="Auto-calculated"
                 value={formData.remainingPaid}
                 readOnly={true}
                 style={{
                   width: "230px",
                   height: "42px",
                   borderRadius: "8px",
                   borderWidth: "1px",
                   padding: "10px 12px",
                   backgroundColor: "#f3f4f6",
                   cursor: "not-allowed"
                 }}
               />
             </div>
           </div>

                     {/* Payment Details */}
           <div className="flex gap-4">
             <div className="space-y-1">
                               <Label className="text-sm font-medium text-gray-700">Payment Date</Label>
               <div className="relative">
                 <Input
                   type="date"
                   placeholder="Enter Payment Date"
                   value={formData.paymentDate}
                   onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                   onClick={() => {
                     // Focus the input to open the date picker
                     const input = e.target as HTMLInputElement;
                     input.showPicker();
                   }}
                   style={{
                     width: "230px",
                     height: "42px",
                     borderRadius: "8px",
                     borderWidth: "1px",
                     padding: "10px 40px 10px 12px",
                     cursor: "pointer",
                   }}
                 />
                 <Calendar 
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer" 
                   onClick={() => {
                     // Find the date input and trigger the date picker
                     const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                     if (dateInput) {
                       dateInput.showPicker();
                     }
                   }}
                 />
               </div>
             </div>
             <div className="space-y-1">
                               <Label className="text-sm font-medium text-gray-700">Payment Method</Label>
               <div className="relative">
                 <Input
                   placeholder="Select Payment Method"
                   value={paymentMethods.find(m => m.value === formData.paymentMethod)?.label || ""}
                   onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                   readOnly
                   style={{
                     width: "230px",
                     height: "42px",
                     borderRadius: "8px",
                     borderWidth: "1px",
                     padding: "10px 12px",
                   }}
                 />
                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 
                 {showPaymentMethodDropdown && (
                   <div className="payment-method-dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                     {paymentMethods.map((method) => (
                       <div
                         key={method.value}
                         className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                         onClick={() => selectPaymentMethod(method.value)}
                       >
                         {method.label}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </div>

          {/* Conditional Fields based on Payment Method */}
                     {formData.paymentMethod === "bank" && (
             <>
               <div className="flex gap-4">
                 <div className="space-y-1">
                   <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                   <Input
                     placeholder="Enter Bank Name"
                     value={formData.bankName}
                     onChange={(e) => handleInputChange("bankName", e.target.value)}
                     style={{
                       width: "230px",
                       height: "42px",
                       borderRadius: "8px",
                       borderWidth: "1px",
                       padding: "10px 12px",
                     }}
                   />
                 </div>
                 <div className="space-y-1">
                   <Label className="text-sm font-medium text-gray-700">IBAN No</Label>
                   <Input
                     placeholder="Enter IBAN No"
                     value={formData.ibanNo}
                     onChange={(e) => handleInputChange("ibanNo", e.target.value)}
                     style={{
                       width: "230px",
                       height: "42px",
                       borderRadius: "8px",
                       borderWidth: "1px",
                       padding: "10px 12px",
                     }}
                   />
                 </div>
               </div>
               <div className="space-y-1">
                 <Label className="text-sm font-medium text-gray-700">Account No</Label>
                 <Input
                   placeholder="Enter Account No"
                   value={formData.accountNo}
                   onChange={(e) => handleInputChange("accountNo", e.target.value)}
                   style={{
                     width: "100%",
                     height: "42px",
                     borderRadius: "8px",
                     borderWidth: "1px",
                     padding: "10px 12px",
                   }}
                 />
               </div>
             </>
           )}

                     {formData.paymentMethod === "cheque" && (
             <div className="flex gap-4">
               <div className="space-y-1">
                 <Label className="text-sm font-medium text-gray-700">Cheque Number</Label>
                 <Input
                   placeholder="Enter Cheque Number"
                   value={formData.chequeNumber}
                   onChange={(e) => handleInputChange("chequeNumber", e.target.value)}
                   style={{
                     width: "230px",
                     height: "42px",
                     borderRadius: "8px",
                     borderWidth: "1px",
                     padding: "10px 12px",
                   }}
                 />
               </div>
               <div className="space-y-1">
                 <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                 <Input
                   placeholder="Enter Bank Name"
                   value={formData.chequeBankName}
                   onChange={(e) => handleInputChange("chequeBankName", e.target.value)}
                   style={{
                     width: "230px",
                     height: "42px",
                     borderRadius: "8px",
                     borderWidth: "1px",
                     padding: "10px 12px",
                   }}
                 />
               </div>
             </div>
           )}

                     {formData.paymentMethod === "bank_deposit" && (
             <div className="flex gap-4">
               <div className="space-y-1">
                 <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                 <Input
                   placeholder="Enter Bank Name"
                   value={formData.depositBankName}
                   onChange={(e) => handleInputChange("depositBankName", e.target.value)}
                   style={{
                     width: "230px",
                     height: "42px",
                     borderRadius: "8px",
                     borderWidth: "1px",
                     padding: "10px 12px",
                   }}
                 />
               </div>
               <div className="space-y-1">
                 <Label className="text-sm font-medium text-gray-700">Slip No</Label>
                 <Input
                   placeholder="Enter Slip No"
                   value={formData.slipNo}
                   onChange={(e) => handleInputChange("slipNo", e.target.value)}
                   style={{
                     width: "230px",
                     height: "42px",
                     borderRadius: "8px",
                     borderWidth: "1px",
                     padding: "10px 12px",
                   }}
                 />
               </div>
             </div>
           )}
        </div>

                 {/* Action Button */}
         <div className="pt-4">
                       <Button
              onClick={handleSubmit}
              style={{
                width: "100%",
                height: "45px",
                maxHeight: "45px",
                borderRadius: "12px",
                opacity: 1,
                gap: "15px",
                background: "#00674F",
              }}
              className="text-white font-medium"
            >
             Save & Continue
           </Button>
         </div>
      </div>
    </div>
  );
}

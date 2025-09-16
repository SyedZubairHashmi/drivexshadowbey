"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, ChevronDown, ChevronUp, Eye, Users, DollarSign, Calendar, Car, TrendingUp, Plus, X, ArrowLeft, FileText } from "lucide-react";
import { batchAPI, investorAPI } from "@/lib/api";

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "cheque", label: "Cheque" },
  { value: "bank_deposit", label: "Bank Deposit" },
];

interface Batch {
  _id: string;
  batchNo: string;
  countryOfOrigin?: string;
  flagImage?: string;
  status?: string;
  investors?: Array<{
    _id: string;
    name: string;
    emailAddress: string;
    investorId: string;
    investAmount: number;
    percentageShare: number;
    amountPaid: number;
    remainingAmount: number;
    paymentDate: string;
  }>;
  cars?: Array<{
    _id: string;
    carName: string;
    company: string;
    status: string;
  }>;
  totalCars?: number;
  soldCars?: number;
  revenue?: number;
  expectedProfit?: number;
  profitDistributionDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvestorFormData {
  investorName: string;
  contactNumber: string;
  emailAddress: string;
  investorId: string;
  investmentAmount: string;
  percentageShare: string;
  amountPaid: string;
  remainingPaid: string;
  paymentDate: string;
  paymentMethod: string;
  selectedBatch: string;
  // Bank fields
  bankName: string;
  ibanNo: string;
  accountNo: string;
  // Cheque fields
  chequeNumber: string;
  chequeBankName: string;
  // Bank deposit fields
  depositBankName: string;
  slipNo: string;
}

export default function InvestorsPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [formData, setFormData] = useState<InvestorFormData>({
    investorName: '',
    contactNumber: '',
    emailAddress: '',
    investorId: '',
    investmentAmount: '',
    percentageShare: '',
    amountPaid: '',
    remainingPaid: '',
    paymentDate: new Date().toISOString().split('T')[0], // Set today's date as default
    paymentMethod: '',
    selectedBatch: '',
    // Bank fields
    bankName: '',
    ibanNo: '',
    accountNo: '',
    // Cheque fields
    chequeNumber: '',
    chequeBankName: '',
    // Bank deposit fields
    depositBankName: '',
    slipNo: ''
  });
  // CNIC validation function
  const validateCNIC = (cnic: string) => {
    // CNIC format: XXXXX-XXXXXXX-X (5 digits, hyphen, 7 digits, hyphen, 1 digit)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

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



  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await batchAPI.getAll();
      
      if (response.success) {
        setBatches(response.data);
        // Set the first batch as expanded by default
        if (response.data.length > 0) {
          setExpandedBatches(new Set([response.data[0]._id]));
        }
      } else {
        setError(response.error || "Failed to fetch batches");
      }
    } catch (error: any) {
      console.error("Error fetching batches:", error);
      setError(error.message || "An error occurred while fetching batches");
    } finally {
      setLoading(false);
    }
  };

  const toggleBatchExpansion = (batchId: string) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };

  const handleInputChange = (field: keyof InvestorFormData, value: string) => {
    setFormData(prev => {
      let newValue = value;
      
      // Auto-format CNIC field
      if (field === 'investorId') {
        // Remove all non-digits first
        const digitsOnly = value.replace(/\D/g, '');
        
        // Limit to 13 digits maximum
        if (digitsOnly.length > 13) {
          return prev; // Don't update if more than 13 digits
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
      
      const newData = { ...prev, [field]: newValue };
      
      // Auto-calculate remaining amount when investment amount or amount paid changes
      if (field === 'investmentAmount' || field === 'amountPaid') {
        const investmentAmount = field === 'investmentAmount' ? parseFloat(newValue) || 0 : parseFloat(prev.investmentAmount) || 0;
        const amountPaid = field === 'amountPaid' ? parseFloat(newValue) || 0 : parseFloat(prev.amountPaid) || 0;
        const remainingAmount = Math.max(0, investmentAmount - amountPaid);
        newData.remainingPaid = remainingAmount.toString();
      }
      
      return newData;
    });
  };

  const selectPaymentMethod = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    setShowPaymentMethodDropdown(false);
  };

  const handleNext = async () => {
    try {
      // Validate required fields first
      const requiredFields = [
        'investorName', 'contactNumber', 'emailAddress', 'investorId',
        'investmentAmount', 'percentageShare', 'amountPaid', 'remainingPaid',
        'paymentMethod', 'selectedBatch'
      ];
      
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          alert(`Please fill in all required fields. Missing: ${field}`);
          return;
        }
      }

      // Validate CNIC format
      if (!validateCNIC(formData.investorId)) {
        alert('Please enter a valid CNIC in format: XXXXX-XXXXXXX-X');
        return;
      }

      // Map payment method to API expected format
      let paymentMethodType = '';
      switch (formData.paymentMethod) {
        case 'cash':
          paymentMethodType = 'Cash';
          break;
        case 'bank':
          paymentMethodType = 'Bank';
          break;
        case 'cheque':
          paymentMethodType = 'Cheque';
          break;
        case 'bank_deposit':
          paymentMethodType = 'BankDeposit';
          break;
        default:
          alert('Please select a valid payment method');
          return;
      }

      // Prepare payment method data
      let paymentMethodData = {
        type: paymentMethodType,
        details: {}
      };

      // Add payment method details based on type
      if (formData.paymentMethod === 'bank') {
        if (!formData.bankName || !formData.accountNo) {
          alert('Bank payment method requires Bank Name and Account Number');
          return;
        }
        paymentMethodData.details = {
          bankName: formData.bankName,
          ibanNo: formData.ibanNo || '',
          accountNo: formData.accountNo
        };
      } else if (formData.paymentMethod === 'cheque') {
        if (!formData.chequeNumber) {
          alert('Cheque payment method requires Cheque Number');
          return;
        }
        paymentMethodData.details = {
          chequeNo: formData.chequeNumber,
          bankName: formData.chequeBankName || ''
        };
      } else if (formData.paymentMethod === 'bank_deposit') {
        if (!formData.slipNo) {
          alert('Bank deposit payment method requires Slip Number');
          return;
        }
        paymentMethodData.details = {
          bankName: formData.depositBankName || '',
          slipNo: formData.slipNo
        };
      }

      // Prepare investor data
      const investorData = {
        name: formData.investorName,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        investorId: formData.investorId,
        investAmount: Number(formData.investmentAmount),
        percentageShare: Number(formData.percentageShare),
        amountPaid: Number(formData.amountPaid),
        remainingAmount: Number(formData.remainingPaid),
        paymentDate: formData.paymentDate || new Date().toISOString(),
        batchNo: formData.selectedBatch,
        paymentMethod: paymentMethodData
      };

      console.log('Sending investor data:', JSON.stringify(investorData, null, 2));

            // Save to database using direct fetch
      console.log('About to call API with data:', investorData);
      
      const response = await fetch('/api/investors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investorData),
      });

      const responseData = await response.json();
      console.log('API Response received:', responseData);
      
      if (responseData.success) {
        console.log('Investor saved successfully:', responseData.data);
        alert('Investor saved successfully!');
        // Reset form and close modal after successful submission
        resetForm();
        setShowModal(false);
        // Refresh the batches to show the new investor
        fetchBatches();
      } else {
        console.error('Failed to save investor:', responseData);
        alert('Failed to save investor: ' + (responseData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving investor:', error);
      alert('Error saving investor. Please try again.');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const resetForm = () => {
    setFormData({
      investorName: '',
      contactNumber: '',
      emailAddress: '',
      investorId: '',
      investmentAmount: '',
      percentageShare: '',
      amountPaid: '',
      remainingPaid: '',
      paymentDate: new Date().toISOString().split('T')[0], // Reset to today's date
      paymentMethod: '',
      selectedBatch: '',
      // Bank fields
      bankName: '',
      ibanNo: '',
      accountNo: '',
      // Cheque fields
      chequeNumber: '',
      chequeBankName: '',
      // Bank deposit fields
      depositBankName: '',
      slipNo: ''
    });
    setCurrentStep(1);
    setShowPaymentMethodDropdown(false);
    setShowBatchDropdown(false);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = (batch.batchNo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (batch.investors?.some(investor => investor.name?.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    const matchesFilter = filterStatus === "all" || (batch.status?.toLowerCase() || '') === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (country: string | undefined) => {
    if (!country) return 'bg-gray-100 text-gray-800';
    
    switch (country.toLowerCase()) {
      case 'japan':
        return 'bg-red-100 text-red-800';
      case 'germany':
        return 'bg-yellow-100 text-yellow-800';
      case 'usa':
        return 'bg-blue-100 text-blue-800';
      case 'uk':
        return 'bg-purple-100 text-purple-800';
      case 'france':
        return 'bg-indigo-100 text-indigo-800';
      case 'italy':
        return 'bg-green-100 text-green-800';
      case 'south korea':
        return 'bg-pink-100 text-pink-800';
      case 'china':
        return 'bg-orange-100 text-orange-800';
      case 'india':
        return 'bg-teal-100 text-teal-800';
      case 'australia':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Dynamic height function based on payment method and step
  const getModalHeight = () => {
    // If on step 2, reduce height by 100px
    if (currentStep === 2) {
      switch (formData.paymentMethod) {
        case 'bank':
          return '660px'; // 760px - 100px
        case 'cash':
          return '600px'; // 700px - 100px
        case 'cheque':
          return '660px'; // 760px - 100px
        case 'bank_deposit':
          return '660px'; // 760px - 100px
        default:
          return '600px'; // 700px - 100px
      }
    }
    
    // Step 1 heights
    switch (formData.paymentMethod) {
      case 'bank':
        return '760px'; // Increased height for bank (extra fields)
      case 'cash':
        return '700px'; // Decreased height for cash (fewer fields)
      case 'cheque':
        return '760px'; // Standard height for cheque
      case 'bank_deposit':
        return '760px'; // Standard height for bank deposit
      default:
        return '700px'; // Default height
    }
  };

  // Dynamic width function based on step
  const getModalWidth = () => {
    return currentStep === 2 ? '480px' : '520px';
  };

  const renderStep1 = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold text-black-900">Batch Investor</h2>
          <p className="text-sm text-gray-600 mt-1">Enter specific details for create a new batch</p>
        </div>
        {/* Close Button */}
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

      {/* Form */}
      <div className={`${formData.paymentMethod === 'bank' || formData.paymentMethod === 'cheque' || formData.paymentMethod === 'bank_deposit' ? 'space-y-2' : 'space-y-3'}`}>
        {/* Investor Details */}
        <div className="flex gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Investor Name</Label>
            <Input
              placeholder="Enter Investor Name"
              value={formData.investorName}
              onChange={(e) => handleInputChange('investorName', e.target.value)}
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
            <Label className="text-sm font-medium text-gray-700">Contact Number</Label>
            <Input
              placeholder="Enter Contact Number"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
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

        {/* Email and ID */}
        <div className="flex gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input
              placeholder="Enter Email Address"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
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
            <Label className="text-sm font-medium text-gray-700">ID/CNIC</Label>
            <Input
              placeholder="54303-5476210-3"
              value={formData.investorId}
              onChange={(e) => handleInputChange('investorId', e.target.value)}
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
            <Label className="text-sm font-medium text-gray-700">Investment Amount</Label>
            <Input
              placeholder="Enter Investment Amount"
              value={formData.investmentAmount}
              onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
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
            <Label className="text-sm font-medium text-gray-700">Percentage Share</Label>
            <Input
              placeholder="Enter Percentage Share"
              value={formData.percentageShare}
              onChange={(e) => handleInputChange('percentageShare', e.target.value)}
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

        {/* Payment Amount Details */}
        <div className="flex gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Amount Paid</Label>
            <Input
              placeholder="Enter Amount Paid"
              value={formData.amountPaid}
              onChange={(e) => handleInputChange('amountPaid', e.target.value)}
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
            <Label className="text-sm font-medium text-gray-700">Remaining Amount</Label>
            <Input
              placeholder="Auto-calculated"
              value={formData.remainingPaid}
              readOnly
              style={{
                width: "230px",
                height: "42px",
                borderRadius: "8px",
                borderWidth: "1px",
                padding: "10px 12px",
                backgroundColor: "#f3f4f6",
                color: "#6b7280"
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
                placeholder="Select Payment Date"
                value={formData.paymentDate}
                onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                style={{
                  width: "230px",
                  height: "42px",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  padding: "10px 12px",
                }}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                padding: "10px 40px 10px 12px",
                cursor: "pointer",
              }}
            />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              
              {showPaymentMethodDropdown && (
                <div className="payment-method-dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
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
                  onChange={(e) => handleInputChange('ibanNo', e.target.value)}
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
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Account No</Label>
                <Input
                  placeholder="Enter Account No"
                  value={formData.accountNo}
                  onChange={(e) => handleInputChange('accountNo', e.target.value)}
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
                <Label className="text-sm font-medium text-gray-700">Select Batch</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter batch no as 02, 03, 11..."
                    value={formData.selectedBatch}
                    onChange={(e) => handleInputChange('selectedBatch', e.target.value)}
                    onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                    style={{
                      width: "230px",
                      height: "42px",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      padding: "10px 40px 10px 12px",
                    }}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  
                  {showBatchDropdown && (
                    <div className="batch-dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {batches.map((batch) => (
                        <div
                          key={batch._id}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            handleInputChange('selectedBatch', batch.batchNo);
                            setShowBatchDropdown(false);
                          }}
                        >
                          {batch.batchNo}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
                onChange={(e) => handleInputChange('chequeNumber', e.target.value)}
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
                onChange={(e) => handleInputChange('chequeBankName', e.target.value)}
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
                onChange={(e) => handleInputChange('depositBankName', e.target.value)}
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
                onChange={(e) => handleInputChange('slipNo', e.target.value)}
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

        {/* Batch Selection for other payment methods */}
        {formData.paymentMethod !== "bank" && (
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Select Batch</Label>
            <div className="relative">
              <Input
                placeholder="Enter batch no as 02, 03, 11..."
                value={formData.selectedBatch}
                onChange={(e) => handleInputChange('selectedBatch', e.target.value)}
                onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  padding: "10px 40px 10px 12px",
                }}
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              
              {showBatchDropdown && (
                <div className="batch-dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {batches.map((batch) => (
                    <div
                      key={batch._id}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        handleInputChange('selectedBatch', batch.batchNo);
                        setShowBatchDropdown(false);
                      }}
                    >
                      {batch.batchNo}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Action Button */}
      <div>
        <Button
          onClick={handleNext}
          style={{
            width: "470px",
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
    </>
  );



  const renderStep2 = () => (
    <>
      {/* Header */}
      <div className="space-y-8 ">
        {/* Top Row - Back Arrow and Close Button */}
        <div className="flex items-center justify-between ">
          <Button
            variant="ghost"
            onClick={handleBack}
            style={{
              width: "35px",
              height: "35px",
              opacity: 1,
              background: "#00000014",
            }}
            className="p-0 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
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
        {/* Second Row - Title */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Supporting Documents</h2>
          <p className="text-sm text-gray-600 mt-1">Please provide supporting documents</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-3">
      {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-900 mb-2">Sales Agreement PDF</p>
        <Button
          variant="outline"
            className="mt-3"
          style={{
              width: '107px',
              height: '33px',
              borderRadius: '1000px',
              opacity: 1,
              gap: '10px',
              paddingTop: '8px',
              paddingRight: '14px',
              paddingBottom: '8px',
              paddingLeft: '14px',
              background: '#8080801F',
              border: 'none'
          }}
        >
          Browse Files
        </Button>
      </div>

      {/* Document List */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Please upload any relevant files:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Sales Agreement (PDF)</li>
          <li>Payment Receipt (Image or PDF)</li>
          <li>Customer ID Copy (Image or PDF)</li>
        </ul>
          <p className="text-xs text-gray-500">
            <strong>Note:</strong> These documents are optional but recommended.
        </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleBack}
          style={{
            width: "230px",
            height: "45px",
            maxHeight: "45px",
            borderRadius: "12px",
            opacity: 1,
            gap: "15px",
            background: "#00674F",
          }}
          className="text-white font-medium"
        >
          Add More Investor
        </Button>
        <Button
          onClick={handleClose}
          style={{
            width: "230px",
            height: "45px",
            maxHeight: "45px",
            borderRadius: "12px",
            opacity: 1,
            gap: "15px",
            background: "#000000",
          }}
          className="text-white font-medium"
        >
          Save & Close
        </Button>
      </div>
    </>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading investors...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={fetchBatches}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col space-y-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 
              className="text-gray-900 font-semibold"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: '22px',
                lineHeight: '30px',
                letterSpacing: '0%'
              }}
            >
              Batch Investors
            </h1>
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center  border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '170px',
                height: '45px',
                borderRadius: '50px',
                opacity: 1,
                paddingTop: '10px',
                paddingRight: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                gap: '10px',
                borderWidth: '1px'
              }}
            >
              <Plus className="h-4 w-4" />
              Add more Investor
            </Button>
          </div>

          <div >

          {/* Search, Filter, and See All Button in one row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center"
                style={{
                  width: "300px",
                  height: "41px",
                  borderRadius: "12px",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "white",
                  padding: "0 12px",
                  gap: "10px"
                }}
              >
                <Search className="text-gray-400 h-4 w-4 flex-shrink-0" />
                <input
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{
                    color: "#374151"
                  }}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                style={{
                  height: "41px",
                  borderRadius: "12px",
                  gap: "10px",
                  padding: "12px",
                  borderWidth: "1px",
                  color: "#0000008F"
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button
              className="flex items-center gap-2.5 border rounded-[12px]  border-gray-300 bg-white text-black-[#00000099] hover:bg-gray-50"
              style={{
                width: '65px',
                height: '41px',
                opacity: 1,
                gap: '10px',
                color:'#00000099',
                paddingLeft:'2px'

              }}
            >
              <Users className="h-4 w-4" />
              See All
            </Button>
          </div>

          {/* Batches */}
          <div className="space-y-4 w-full  ">
            {filteredBatches.map((batch) => (
              <div
                key={batch._id}
                className="bg-white border border-gray-200 rounded-lg "
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  opacity: 1,
                  borderWidth: '1px',
                  paddingTop: '12px',
                  paddingBottom: '0px',
                  paddingLeft: '10px',
                  paddingRight: '8px',
                  gap: '40px'
                }}
              >
                {/* Batch Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Batch {batch.batchNo}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      style={{
                        width: '95px',
                        height: '41px',
                        borderRadius: '12px',
                        opacity: 1,
                        gap: '8px',
                        borderWidth: '1px',
                        padding: '12px'
                      }}
                    >
                      View Batch
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBatchExpansion(batch._id)}
                    className="flex items-center justify-center text-gray-500 bg-white"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "100%",
                      opacity: 0.4
                    }}
                  >
                    {expandedBatches.has(batch._id) ? (
                      <i className="fa-solid fa-circle-minus" style={{ fontSize: "20px" }}></i>
                    ) : (
                      <i className="fa-solid fa-circle-plus" style={{ fontSize: "20px" }}></i>
                    )}
                  </Button>
                </div>

                {/* Batch Body */}
                {expandedBatches.has(batch._id) && (
                  <div className="border-gray-200 pt-4 space-y-8">
                    {/* Data Display */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">Investors:</span>
                        <span className="ml-2 text-gray-900">{batch.investors?.length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">All Investment:</span>
                        <span className="ml-2 text-gray-900">
                          PKR {batch.investors?.reduce((total, investor) => total + (investor.investAmount || 0), 0).toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">Cars Purchased:</span>
                        <span className="ml-2 text-gray-900">{batch.cars?.length || 0}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pb-2">
                      <Button
                        className="flex-1"
                        style={{
                          backgroundColor: "#00674F",
                          height: '45px',
                          borderRadius: '12px'
                        }}
                        onClick={() => window.location.href = `/investors/all-investors?batchNo=${batch.batchNo}`}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        See All Investors
                      </Button>
                      <Button
                        className="flex-1 bg-black hover:bg-gray-800"
                        style={{
                          height: '45px',
                          borderRadius: '12px'
                        }}
                        onClick={() => window.location.href = `/investors/payment-history?batchNo=${batch.batchNo}`}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        See Payment History
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-xl border border-gray-200 flex flex-col"
            style={{
              width: getModalWidth(),
              height: getModalHeight(),
              top: '99px',
              left: '460px',
              borderWidth: '1px',
              padding: '24px',
              gap: '40px',
            }}
          >
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </div>
        </div>
      )}
    </MainLayout>
  );
}

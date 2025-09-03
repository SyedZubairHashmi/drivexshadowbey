"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { BatchHeader } from "@/components/ui/batch-header";
import { CarTable } from "@/components/ui/car-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SuccessPopupCard from "@/components/ui/success-popup-card";
import { useEffect, useState, Suspense } from "react";
import { carAPI, customerAPI } from "@/lib/api";
import { Plus, X, ArrowLeft, Upload, FileText, ChevronDown, Search, Filter } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SoldCarFormData {
  // Step 1: Car Details
  companyName: string;
  model: string;
  chassisNumber: string;
  
  // Step 2: Customer Details
  customerName: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  
  // Step 3: Sale Details
  saleDate: string;
  salePrice: number;
  paidAmount: number;
  remainingBalance: number;
  paymentMethod: {
    type: string;
    details: {
      bankName?: string;
      ibanNo?: string;
      accountNo?: string;
      chequeNo?: string;
      chequeClearanceDate?: string;
      slipNo?: string;
    };
  };
  paymentStatus: string;
  notes: string;
  
  // Step 4: Documents
  salesAgreement: File | null;
  additionalDocuments: File[];
}

function SoldCarsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [soldCars, setSoldCars] = useState<any[]>([]);
  const [filteredSoldCars, setFilteredSoldCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [importYearFilter, setImportYearFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SoldCarFormData>({
    companyName: '',
    model: '',
    chassisNumber: '',
    customerName: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    saleDate: '',
    salePrice: 0,
    paidAmount: 0,
    remainingBalance: 0,
    paymentMethod: {
      type: '',
      details: {}
    },
    paymentStatus: '',
    notes: '',
    salesAgreement: null,
    additionalDocuments: []
  });

  // Payment method dropdown state
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [showPaymentStatusDropdown, setShowPaymentStatusDropdown] = useState(false);

  // Chassis number dropdown state
  const [showChassisDropdown, setShowChassisDropdown] = useState(false);
  const [availableCars, setAvailableCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);

  const paymentMethods = [
    { value: "Cash", label: "Cash" },
    { value: "Bank", label: "Bank" },
    { value: "Cheque", label: "Cheque" },
    { value: "BankDeposit", label: "Bank Deposit" },
  ];

  const paymentStatuses = [
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
  ];

  useEffect(() => {
    fetchSoldCars();
    fetchAvailableCars();
  }, []);

  // Filter sold cars when search term or filters change
  useEffect(() => {
    filterSoldCars();
  }, [searchTerm, companyFilter, gradeFilter, importYearFilter, paymentStatusFilter, soldCars]);

  const filterSoldCars = () => {
    let filtered = soldCars;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((car: any) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          car.carName?.toLowerCase().includes(searchLower) ||
          car.company?.toLowerCase().includes(searchLower) ||
          car.chassisNumber?.toLowerCase().includes(searchLower) ||
          car.engineNumber?.toLowerCase().includes(searchLower) ||
          car.saleInfo?.buyerInfo?.name?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply company filter
    if (companyFilter && companyFilter !== 'all') {
      filtered = filtered.filter((car: any) => 
        car.company === companyFilter
      );
    }

    // Apply grade filter
    if (gradeFilter && gradeFilter !== 'all') {
      filtered = filtered.filter((car: any) => 
        car.auctionGrade?.toString() === gradeFilter
      );
    }

    // Apply import year filter
    if (importYearFilter && importYearFilter !== 'all') {
      filtered = filtered.filter((car: any) => 
        car.importYear?.toString() === importYearFilter
      );
    }

    // Apply payment status filter
    if (paymentStatusFilter && paymentStatusFilter !== 'all') {
      filtered = filtered.filter((car: any) => 
        car.saleInfo?.paymentStatus === paymentStatusFilter
      );
    }

    setFilteredSoldCars(filtered);
  };

  // Check for modal parameter and open modal if needed
  useEffect(() => {
    const modalParam = searchParams.get('modal');
    const fromCustomer = searchParams.get('from') === 'customer';
    if (modalParam === 'open') {
      setShowModal(true);
      // Store the source page for navigation after submission
      if (fromCustomer) {
        sessionStorage.setItem('soldCarFormSource', 'customer');
      }
    }
  }, [searchParams]);

  // Filter cars when company name or model changes
  useEffect(() => {
    filterCarsByCompanyAndModel();
  }, [formData.companyName, formData.model, availableCars]);

  const handleInputChange = (field: keyof SoldCarFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If company name or model changes, show chassis dropdown
    if (field === 'companyName' || field === 'model') {
      setShowChassisDropdown(true);
    }
  };

  const handlePaymentMethodChange = (methodType: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: {
        type: methodType,
        details: {}
      }
    }));
    setShowPaymentMethodDropdown(false);
  };

  const handlePaymentStatusChange = (status: string) => {
    setFormData(prev => ({ ...prev, paymentStatus: status }));
    setShowPaymentStatusDropdown(false);
  };

  const handlePaymentDetailChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: {
        ...prev.paymentMethod,
        details: {
          ...prev.paymentMethod.details,
          [field]: value
        }
      }
    }));
  };

  // Fetch available cars for chassis number dropdown
  const fetchAvailableCars = async () => {
    try {
      const response = await carAPI.getAll({ limit: 1000 });
      if (response.success) {
        // Filter cars that are not sold
        const availableCars = response.data.filter((car: any) => car.status !== 'sold');
        setAvailableCars(availableCars);
      }
    } catch (error) {
      console.error('Error fetching available cars:', error);
    }
  };

  // Filter cars based on company name and model
  const filterCarsByCompanyAndModel = () => {
    if (!formData.companyName && !formData.model) {
      setFilteredCars([]);
      return;
    }

    const filtered = availableCars.filter((car: any) => {
      const companyMatch = !formData.companyName || 
        car.company?.toLowerCase().includes(formData.companyName.toLowerCase()) ||
        car.companyName?.toLowerCase().includes(formData.companyName.toLowerCase());
      
      const modelMatch = !formData.model || 
        car.model?.toLowerCase().includes(formData.model.toLowerCase());
      
      return companyMatch && modelMatch;
    });

    setFilteredCars(filtered);
  };

  // Handle chassis number selection
  const handleChassisSelection = (chassisNumber: string) => {
    setFormData(prev => ({ ...prev, chassisNumber }));
    setShowChassisDropdown(false);
  };

  const handleAmountChange = (field: 'salePrice' | 'paidAmount', value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => {
      const newData = { ...prev, [field]: numValue };
      
      // Calculate remaining balance
      if (field === 'salePrice') {
        newData.remainingBalance = Math.max(0, numValue - newData.paidAmount);
      } else if (field === 'paidAmount') {
        newData.remainingBalance = Math.max(0, newData.salePrice - numValue);
      }
      
      return newData;
    });
  };

  const fetchSoldCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch cars with sold status using the car API
      const response = await carAPI.getAll({ status: 'sold' });
      console.log('Sold cars data:', response)
      
      if (response.success) {
        setSoldCars(response.data);
        setFilteredSoldCars(response.data); // Initialize filtered data
      } else {
        setError(response.error || "Failed to fetch sold cars");
      }
    } catch (error: any) {
      console.error("Error fetching sold cars:", error);
      setError(error.message || "An error occurred while fetching sold cars");
    } finally {
      setLoading(false);
    }
  };


  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setFormData({
      companyName: '',
      model: '',
      chassisNumber: '',
      customerName: '',
      phoneNumber: '',
      emailAddress: '',
      address: '',
      saleDate: '',
      salePrice: 0,
      paymentMethod: '',
      paymentStatus: '',
      remainingBalance: 0,
      notes: '',
      salesAgreement: null,
      additionalDocuments: []
    });
    
    // Check if user came from customer page and navigate back
    const sourcePage = sessionStorage.getItem('soldCarFormSource');
    if (sourcePage === 'customer') {
      sessionStorage.removeItem('soldCarFormSource'); // Clean up
      router.push('/sales-and-payments/customers');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Start loading
      console.log('Form submitted:', formData);
      
      // First, find the car by chassis number and update its status to 'sold'
      const carsResponse = await carAPI.getAll({ limit: 1000 });
      if (carsResponse.success) {
        const car = carsResponse.data.find((c: any) => 
          c.chasisNumber === formData.chassisNumber ||
          c.chassisNumber === formData.chassisNumber
        );
        
        if (car) {
          // Update car status to sold
          const updateResponse = await carAPI.update(car._id, {
            status: 'sold',
            saleInfo: {
              soldPrice: formData.salePrice,
              soldDate: formData.saleDate,
              buyerInfo: {
                name: formData.customerName,
                contactNumber: formData.phoneNumber,
                emailAddress: formData.emailAddress,
                cnic: formData.address, // Using address field for CNIC if needed
              },
            },
          });
          
          if (!updateResponse.success) {
            console.error('Failed to update car status:', updateResponse.error);
          }
        } else {
          console.warn('Car not found with chassis number:', formData.chassisNumber);
        }
      }
      
      // Prepare customer data for API using the new structure
      const customerData = {
        vehicle: {
          companyName: formData.companyName,
          model: formData.model,
          chassisNumber: formData.chassisNumber,
        },
        customer: {
          name: formData.customerName,
          phoneNumber: formData.phoneNumber,
          email: formData.emailAddress,
          address: formData.address,
        },
        sale: {
          saleDate: formData.saleDate,
          salePrice: formData.salePrice,
          paidAmount: formData.paidAmount,
          remainingAmount: formData.remainingBalance,
          paymentMethod: {
            type: formData.paymentMethod.type,
            details: formData.paymentMethod.details
          },
          paymentStatus: formData.paymentStatus,
          note: formData.notes,
          document: formData.salesAgreement ? formData.salesAgreement.name : undefined,
        },
      };

      // Save customer data using the new API structure
      const response = await customerAPI.create(customerData);
      
      if (response.success) {
        console.log('Customer saved successfully:', response.data);
        // Show success popup instead of alert
        setShowSuccess(true);
        handleCloseModal();
        
        // Auto-hide success popup after 8 seconds (longer than car add popup)
        setTimeout(() => {
          setShowSuccess(false);
          // Check if user came from customer page and navigate back
          const sourcePage = sessionStorage.getItem('soldCarFormSource');
          if (sourcePage === 'customer') {
            sessionStorage.removeItem('soldCarFormSource'); // Clean up
            router.push('/sales-and-payments/customers');
          } else {
            // Refresh the sold cars list if not from customer page
            fetchSoldCars();
          }
        }, 8000);
      } else {
        console.error('Failed to save customer:', response.error);
        alert('Failed to save sold car data: ' + response.error);
      }
    } catch (error: any) {
      console.error('Error saving customer:', error);
      alert('Error saving sold car data: ' + error.message);
    } finally {
      setIsSubmitting(false); // Stop loading regardless of success/failure
    }
  };

  const handleFileUpload = (field: 'salesAgreement' | 'additionalDocuments', file: File) => {
    if (field === 'salesAgreement') {
      setFormData(prev => ({ ...prev, salesAgreement: file }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        additionalDocuments: [...prev.additionalDocuments, file] 
      }));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-10">
      <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add Sold Car</h2>
        <p className="text-sm text-gray-600">Please provide specific sold car details.</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Company</label>
            <Input
              type="text"
              placeholder="Enter Company Name"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">Model</label>
            <Input
              type="text"
              placeholder="Enter Model"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Chassis Number</label>
          <div className="relative">
          <Input
            type="text"
            placeholder="Enter Chassis number"
            value={formData.chassisNumber}
            onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
              onClick={() => setShowChassisDropdown(!showChassisDropdown)}
              className="placeholder-custom text-sm cursor-pointer"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              opacity: 1,
              gap: '12px',
              border: '1px solid #0000003D',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
              paddingLeft: '12px'
            }}
          />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            
            {showChassisDropdown && filteredCars.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredCars.map((car: any, index: number) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleChassisSelection(car.chassisNumber || car.chasisNumber)}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {car.chassisNumber || car.chasisNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {car.company || car.companyName} - {car.model}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-10">
      <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Customer Details</h2>
        <p className="text-sm text-gray-600">Please provide customer details.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Customer Name</label>
                      <Input
              type="text"
              placeholder="Enter Customer Name"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                      <Input
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Email Address (optional)</label>
                      <Input
              type="email"
              placeholder="Enter Email Address"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Address (optional)</label>
                      <Input
              type="text"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="placeholder-custom text-sm"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    // Determine spacing based on payment method
    const isCompactLayout = formData.paymentMethod.type === "Bank" || formData.paymentMethod.type === "Cheque";
    const containerSpacing = isCompactLayout ? "space-y-3" : "space-y-5";
    const gridGap = isCompactLayout ? "gap-2" : "gap-4";

    return (
      <div className={containerSpacing}>
      <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sale Details</h2>
        <p className="text-sm text-gray-600">Please provide payment details.</p>
      </div>
      
        <div className={`grid grid-cols-2 ${gridGap}`}>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Sale Date</label>
          <Input
            type="date"
            value={formData.saleDate}
            onChange={(e) => handleInputChange('saleDate', e.target.value)}
            className="placeholder-custom text-sm"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              opacity: 1,
              gap: '12px',
              border: '1px solid #0000003D',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
              paddingLeft: '12px'
            }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Sale Price</label>
          <Input
            type="number"
            placeholder="Enter Sale Price"
              value={formData.salePrice || ''}
              onChange={(e) => handleAmountChange('salePrice', e.target.value)}
            className="placeholder-custom text-sm"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              opacity: 1,
              gap: '12px',
              border: '1px solid #0000003D',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
              paddingLeft: '12px'
            }}
          />
        </div>
          
        <div>
            <label className="block text-sm font-medium text-black mb-2">Amount Paid</label>
          <Input
            type="number"
              placeholder="Enter Amount Paid"
              value={formData.paidAmount || ''}
              onChange={(e) => handleAmountChange('paidAmount', e.target.value)}
            className="placeholder-custom text-sm"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              opacity: 1,
              gap: '12px',
              border: '1px solid #0000003D',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
              paddingLeft: '12px'
              }}
          />
        </div>
          
        <div>
          <label className="block text-sm font-medium text-black mb-2">Remaining Balance</label>
          <Input
            type="number"
              placeholder="Auto-calculated"
              value={formData.remainingBalance || ''}
              readOnly
            className="placeholder-custom text-sm"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              opacity: 1,
              gap: '12px',
              border: '1px solid #0000003D',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
                paddingLeft: '12px',
                backgroundColor: '#f3f4f6',
                cursor: 'not-allowed'
            }}
          />
        </div>

          <div>
          <label className="block text-sm font-medium text-black mb-2">Payment Status</label>
          <div className="relative">
            <Input
              type="text"
                placeholder="Select Payment Status"
              value={formData.paymentStatus}
                onClick={() => setShowPaymentStatusDropdown(!showPaymentStatusDropdown)}
                readOnly
                className="placeholder-custom text-sm cursor-pointer"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                opacity: 1,
                gap: '12px',
                border: '1px solid #0000003D',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '12px'
              }}
            />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {showPaymentStatusDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {paymentStatuses.map((status) => (
                    <div
                      key={status.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handlePaymentStatusChange(status.value)}
                    >
                      {status.label}
            </div>
                  ))}
                </div>
              )}
          </div>
        </div>
        
          <div>
          <label className="block text-sm font-medium text-black mb-2">Payment Method</label>
            <div className="relative">
          <Input
            type="text"
                placeholder="Select Payment Method"
                value={paymentMethods.find(m => m.value === formData.paymentMethod.type)?.label || ""}
                onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                readOnly
                className="placeholder-custom text-sm cursor-pointer"
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '8px',
                  opacity: 1,
                  gap: '12px',
                  border: '1px solid #0000003D',
                  paddingTop: '10px',
                  paddingRight: '12px',
                  paddingBottom: '10px',
                  paddingLeft: '12px'
                }}
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {showPaymentMethodDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.value}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handlePaymentMethodChange(method.value)}
                    >
                      {method.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conditional Payment Method Fields */}
        {formData.paymentMethod.type === "Bank" && (
          <>
            <div className={`grid grid-cols-2 ${gridGap}`}>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Bank Name</label>
                <Input
                  placeholder="Enter Bank Name"
                  value={formData.paymentMethod.details.bankName || ''}
                  onChange={(e) => handlePaymentDetailChange('bankName', e.target.value)}
            className="placeholder-custom text-sm"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              opacity: 1,
              gap: '12px',
              border: '1px solid #0000003D',
              paddingTop: '10px',
              paddingRight: '12px',
              paddingBottom: '10px',
              paddingLeft: '12px'
            }}
          />
        </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">IBAN No</label>
                <Input
                  placeholder="Enter IBAN No"
                  value={formData.paymentMethod.details.ibanNo || ''}
                  onChange={(e) => handlePaymentDetailChange('ibanNo', e.target.value)}
                  className="placeholder-custom text-sm"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    opacity: 1,
                    gap: '12px',
                    border: '1px solid #0000003D',
                    paddingTop: '10px',
                    paddingRight: '12px',
                    paddingBottom: '10px',
                    paddingLeft: '12px'
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Account No</label>
              <Input
                placeholder="Enter Account No"
                value={formData.paymentMethod.details.accountNo || ''}
                onChange={(e) => handlePaymentDetailChange('accountNo', e.target.value)}
                className="placeholder-custom text-sm"
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '8px',
                  opacity: 1,
                  gap: '12px',
                  border: '1px solid #0000003D',
                  paddingTop: '10px',
                  paddingRight: '12px',
                  paddingBottom: '10px',
                  paddingLeft: '12px'
                }}
              />
            </div>
          </>
        )}

        {formData.paymentMethod.type === "Cheque" && (
          <>
            <div className={`grid grid-cols-2 ${gridGap}`}>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Cheque Number</label>
                <Input
                  placeholder="Enter Cheque Number"
                  value={formData.paymentMethod.details.chequeNo || ''}
                  onChange={(e) => handlePaymentDetailChange('chequeNo', e.target.value)}
                  className="placeholder-custom text-sm"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    opacity: 1,
                    gap: '12px',
                    border: '1px solid #0000003D',
                    paddingTop: '10px',
                    paddingRight: '12px',
                    paddingBottom: '10px',
                    paddingLeft: '12px'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Cheque Clearance Date</label>
                <Input
                  type="date"
                  value={formData.paymentMethod.details.chequeClearanceDate || ''}
                  onChange={(e) => handlePaymentDetailChange('chequeClearanceDate', e.target.value)}
                  className="placeholder-custom text-sm"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    opacity: 1,
                    gap: '12px',
                    border: '1px solid #0000003D',
                    paddingTop: '10px',
                    paddingRight: '12px',
                    paddingBottom: '10px',
                    paddingLeft: '12px'
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Bank Name</label>
              <Input
                placeholder="Enter Bank Name"
                value={formData.paymentMethod.details.bankName || ''}
                onChange={(e) => handlePaymentDetailChange('bankName', e.target.value)}
                className="placeholder-custom text-sm"
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '8px',
                  opacity: 1,
                  gap: '12px',
                  border: '1px solid #0000003D',
                  paddingTop: '10px',
                  paddingRight: '12px',
                  paddingBottom: '10px',
                  paddingLeft: '12px'
                }}
              />
            </div>
          </>
        )}

        {formData.paymentMethod.type === "BankDeposit" && (
          <div className={`grid grid-cols-2 ${gridGap}`}>
                        <div>
              <label className="block text-sm font-medium text-black mb-2">Bank Name</label>
              <Input
                placeholder="Enter Bank Name"
                value={formData.paymentMethod.details.bankName || ''}
                onChange={(e) => handlePaymentDetailChange('bankName', e.target.value)}
                className="placeholder-custom text-sm"
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '8px',
                  opacity: 1,
                  gap: '12px',
                  border: '1px solid #0000003D',
                  paddingTop: '10px',
                  paddingRight: '12px',
                  paddingBottom: '10px',
                  paddingLeft: '12px'
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Slip No</label>
              <Input
                placeholder="Enter Slip No"
                value={formData.paymentMethod.details.slipNo || ''}
                onChange={(e) => handlePaymentDetailChange('slipNo', e.target.value)}
                className="placeholder-custom text-sm"
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '8px',
                  opacity: 1,
                  gap: '12px',
                  border: '1px solid #0000003D',
                  paddingTop: '10px',
                  paddingRight: '12px',
                  paddingBottom: '10px',
                  paddingLeft: '12px'
                }}
              />
            </div>
          </div>
        )}
      
      <div>
        <label className="block text-sm font-medium text-black mb-2">Notes (optional)</label>
        <Textarea
          placeholder="Enter notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
            className=" text-sm"
          style={{
            width: '100%',
            height: '100px',
            borderRadius: '8px',
            opacity: 1,
            gap: '12px',
            borderWidth: '1px',
            paddingTop: '10px',
            paddingRight: '12px',
            paddingBottom: '10px',
            paddingLeft: '12px'
          }}
        />
      </div>
    </div>
  );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Supporting Documents</h2>
        <p className="text-gray-600">Please provide customer details</p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Agreement PDF</h3>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => e.target.files?.[0] && handleFileUpload('salesAgreement', e.target.files[0])}
          className="hidden"
          id="sales-agreement"
        />
        <label
          htmlFor="sales-agreement"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          Browse Files
        </label>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">
          Please upload any relevant files to verify and record the sale:
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Sales Agreement (PDF)</li>
          <li>• Payment Receipt (Image or PDF)</li>
          <li>• Customer ID Copy (Image or PDF)</li>
        </ul>
      </div>

      <div className="text-sm text-gray-500 italic">
        Note: These documents are optional but recommended for record accuracy.
      </div>
    </div>
  );

  const getModalHeight = () => {
    switch (currentStep) {
      case 1: return '458px';
      case 2: return '458px';
      case 3: {
        // Dynamic height based on payment method for step 3
        switch (formData.paymentMethod.type) {
          case "Bank":
            return '780px'; // Bank has 3 additional fields
          case "Cheque":
            return '780px'; // Cheque has 3 additional fields
          case "BankDeposit":
            return '720px'; // Bank Deposit has 2 additional fields
          case "Cash":
          default:
            return '630px'; // Cash has no additional fields
        }
      }
      case 4: return '656px';
      default: return '358px';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sold cars...</p>
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
              onClick={fetchSoldCars}
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
        <div className="flex-1 flex flex-col space-y-5 pt-6">
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
              Cars Sold
            </h1>
            <Button
              onClick={() => setShowModal(true)}
              className="flex items-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '138px',
                height: '50px',
                borderRadius: '50px',
                paddingTop: '10px',
                paddingRight: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                gap: '5px',
                borderWidth: '1px',
                opacity: 1
              }}
            >
              <Plus className="h-4 w-4"/>
              Add Sold Car
            </Button>
          </div>

          {/* Search and Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
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
                  placeholder="Search sold cars..." 
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
                  color: "#00000099"
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex gap-2">
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger 
                  className="w-32"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Company" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {/* Japanese Brands */}
                  <SelectItem value="TOYOTA">TOYOTA</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Suzuki">Suzuki</SelectItem>
                  <SelectItem value="Daihatsu">Daihatsu</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                  <SelectItem value="Mazda">Mazda</SelectItem>
                  <SelectItem value="Isuzu">Isuzu</SelectItem>
                  <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                  
                  {/* German Luxury Brands */}
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                  
                  {/* Japanese Luxury Brands */}
                  <SelectItem value="Lexus">Lexus</SelectItem>
                  <SelectItem value="Acura">Acura</SelectItem>
                  
                  {/* Korean Brands */}
                  <SelectItem value="Kia">Kia</SelectItem>
                  <SelectItem value="Hyundai">Hyundai</SelectItem>
                  
                  {/* Chinese Brands */}
                  <SelectItem value="GWM">GWM</SelectItem>
                  <SelectItem value="BYD">BYD</SelectItem>
                  <SelectItem value="Changan">Changan</SelectItem>
                  <SelectItem value="Chery">Chery</SelectItem>
                  <SelectItem value="FAW">FAW</SelectItem>
                  
                  {/* American Brands */}
                  <SelectItem value="Tesla">Tesla</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="Cadillac">Cadillac</SelectItem>
                  <SelectItem value="Chrysler">Chrysler</SelectItem>
                  <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                  <SelectItem value="GMC">GMC</SelectItem>
                  <SelectItem value="Jeep">Jeep</SelectItem>
                  
                  {/* British Brands */}
                  <SelectItem value="Land Rover">Land Rover</SelectItem>
                  <SelectItem value="MG">MG</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger 
                  className="w-24"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Grade" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="4.5">4.5</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="3.5">3.5</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={importYearFilter} onValueChange={setImportYearFilter}>
                <SelectTrigger 
                  className="w-32"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Import Year" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger 
                  className="w-28"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Payment Status" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <CarTable cars={filteredSoldCars} batchNumber="sold" />
          </div>
        </div>
      </div>

      {/* Add Sold Car Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "#000000CC" }}>
          <div 
            className="bg-white rounded-xl border border-gray-200 flex flex-col"
            style={{
              width: "520px",
              height: getModalHeight(),
              borderRadius: "12px",
              opacity: 1,
              borderWidth: "1px",
              padding: "24px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {currentStep > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevStep}
                    className="p-0 rounded-full"
                    style={{
                      width: '35px',
                      height: '35px',
                      opacity: 1,
                      background: '#00000014'
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <span className="text-sm font-medium text-gray-600">STEP {currentStep}/4</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
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

            {/* Content */}
            <div className="flex-1">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={currentStep === 4 ? handleSubmit : handleNextStep}
                disabled={currentStep === 4 && isSubmitting}
                style={{
                  width: "472px",
                  height: "45px",
                  gap: "12px",
                  backgroundColor: "#00674F"
                }}
                className="text-white"
              >
                {currentStep === 4 ? (
                  isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save & close'
                  )
                ) : (
                  'Save & Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup Card - Shows when car is sold successfully */}
      <SuccessPopupCard
        heading="Car Sold Successfully"
        message="The car has been marked as sold and customer data has been saved"
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </MainLayout>
  );
}

export default function SoldCarsPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sold cars...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <SoldCarsContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Plus, Download, FileText, X, ChevronDown } from 'lucide-react';
import type { Customer } from '@/types';
import { CustomerUpdatePaymentModal } from '@/components/ui/customer-update-payment-modal';
import SuccessPopupCard from '@/components/ui/success-popup-card';

interface CustomerDetailPageProps {
  params: {
    customerId: string;
  };
}


export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const router = useRouter();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCustomerDetailsExpanded, setIsCustomerDetailsExpanded] = useState(true);
  const [isPaymentHistoryExpanded, setIsPaymentHistoryExpanded] = useState(true);
  
  // Modal state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // View detail modal state
  const [showViewDetailModal, setShowViewDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    amountPaid: 0,
    paymentMethod: {
      type: '',
      details: {}
    }
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${customerId}`);
        const result = await response.json();
        console.log('API Response:', result);
        
        if (response.ok && result.success && result.data) {
          console.log('Setting customer data:', result.data);
          setCustomer(result.data);
        } else {
          console.error('API returned error:', result.error);
          setCustomer(null);
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  // Debug: Log customer state changes
  useEffect(() => {
    console.log('Customer state changed:', customer);
  }, [customer]);



  const handleViewPaymentDetail = (payment: any) => {
    setSelectedPayment(payment);
    setEditFormData({
      amountPaid: (payment as any).amountPaid || payment.amount || 0,
      paymentMethod: {
        type: payment.paymentMethod?.type || '',
        details: payment.paymentMethod?.details || {}
      }
    });
    setIsEditMode(false);
    setShowViewDetailModal(true);
  };

  const handleCloseViewDetailModal = () => {
    setShowViewDetailModal(false);
    setSelectedPayment(null);
    setIsEditMode(false);
    setEditFormData({
      amountPaid: 0,
      paymentMethod: {
        type: '',
        details: {}
      }
    });
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditPaymentMethodChange = (method: string) => {
    setEditFormData(prev => ({
      ...prev,
      paymentMethod: {
        ...prev.paymentMethod,
        type: method,
        details: {}
      }
    }));
  };

  const handleSaveChanges = async () => {
    if (!selectedPayment || !customer) return;

    try {
      setIsSubmitting(true);
      
      // Prepare update data
      const updateData = {
        amountPaid: editFormData.amountPaid,
        paymentMethod: editFormData.paymentMethod
      };

      // Call API to update payment
      const response = await fetch(`/api/customers/${customer._id}/payments/${selectedPayment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setCustomer(result.data);
        setIsEditMode(false);
        handleCloseViewDetailModal();
      } else {
        alert(result.error || 'Failed to update payment');
      }
    } catch (error) {
      alert('Failed to update payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!customer) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Customer not found</div>
        </div>
      </MainLayout>
    );
  }

  // Remove strict validation - show available data even if some fields are missing

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col space-y-3 mt-[14px] ">
          {/* Breadcrumb and Update Payment Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Customer</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{customer.customer?.name || 'Unknown Customer'}</span>
            </div>
            <Button
              onClick={() => setShowUpdatePaymentModal(true)}
              className="text-gray-700 border border-gray-300 bg-white hover:bg-gray-50"
              style={{
                width: '185px',
                height: '50px',
                borderRadius: '50px',
                borderWidth: '1px',
                paddingTop: '10px',
                paddingRight: '18px',
                paddingBottom: '10px',
                paddingLeft: '18px',
                gap: '10px'
              }}
            >
              <Plus className="h-4 w-4" />
              Update Payment
            </Button>
          </div>

          {/* Customer Details Section */}
          <div 
            className="bg-white w-full "
            style={{
              height: 'auto',
              gap: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
              <button 
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => setIsCustomerDetailsExpanded(!isCustomerDetailsExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {isCustomerDetailsExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" ></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" ></i>
                )}
              </button>
            </div>
            
            {/* Collapsible Customer Details Content */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCustomerDetailsExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >

              <div className='space-y-7'>


              {/* First Row - Full Name, Phone, Email */}
              <div className="grid grid-cols-3 gap-4">
              <div className='flex'>
                <div 
                  className="text-gray-700 font-medium"
                  style={{
                    width: '155px',
                    height: 'auto'
                  }}
                >
                  Full Name
                </div>
                <div 
                  className="text-gray-900"
                  style={{
                    width: '102px',
                    height: '22px'
                  }}
                >
                  {customer.customer?.name || 'N/A'}
                </div>
              </div>
              <div className='flex'>
                <div 
                  className="text-gray-700 font-medium"
                  style={{
                    width: '140px',
                    height: 'auto'
                  }}
                >
                  Phone Number
                </div>
                <div 
                  className="text-gray-900"
                  style={{
                    height: '22px'
                  }}
                >
                  {customer.customer?.phoneNumber || 'N/A'}
                </div>
              </div>
              <div className='flex'>
                <div 
                  className="text-gray-700 font-medium"
                  style={{
                    width: '140px',
                    height: 'auto'
                  }}
                >
                  Email Address
                </div>
                <div 
                  className="text-gray-900"
                  style={{
                    height: '22px'
                  }}
                >
                  {customer.customer?.email || 'N/A'}
                </div>
              </div>
            </div>
            {/* Second Row - Sale Price */}
            <div className='flex '>
              <div 
                className="text-gray-700 font-medium"
                style={{
                  width: '155px',
                  height: 'auto'
                }}
              >
                Sale Price
              </div>
              <div 
                className="text-gray-900"
                style={{
                  height: '22px',
                }}
              >
                Rs {customer.sale?.salePrice?.toLocaleString() || '0'}
              </div>
            </div>
            {/* Third Row - Notes */}
            <div className="flex gap-4 ">
              <div 
                className="text-gray-700 font-medium flex items-center"
                style={{
                  width: '140px',
                  height: 'auto'
                }}
              >
                Notes
              </div>
              <div 
                className="text-gray-900 flex-1"
              >
                {customer.sale?.note || 'No notes available'}
              </div>
            </div>
            {/* Fourth Row - Documents */}
            <div className="flex gap-4">
              <div 
                className="text-gray-700 font-medium flex items-center"
                style={{
                  width: '140px',
                  height: 'auto'
                }}
              >
                Documents
              </div>
              <div className="flex gap-4">
                {/* Invoice Document */}
                <div 
                  className="bg-gray-100 rounded-lg border flex flex-col"
                  style={{
                    width: '388px',
                    height: 'auto',
                    minHeight: '84px',
                    borderRadius: '12px',
                    borderWidth: '1px',
                    paddingTop: '16px',
                    paddingRight: '12px',
                    paddingBottom: '16px',
                    paddingLeft: '12px',
                    gap: '24px'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Vitara Invoice.pdf
                      </div>
                      <div className="text-xs text-gray-500">
                        525KB • 100% uploaded
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-green-600 cursor-pointer" />
                  </div>
                </div>

                {/* Auction Sheet Document */}
                <div 
                  className="bg-gray-100 rounded-lg border flex flex-col"
                  style={{
                    width: '388px',
                    height: 'auto',
                    minHeight: '84px',
                    borderRadius: '12px',
                    borderWidth: '1px',
                    paddingTop: '16px',
                    paddingRight: '12px',
                    paddingBottom: '16px',
                    paddingLeft: '12px',
                    gap: '24px'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Auction Sheet.pdf
                      </div>
                      <div className="text-xs text-gray-500">
                        425KB • 100% uploaded
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-green-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>

          {/* 40px Gap */}
          <div style={{ height: '40px' }}></div>

          {/* Payment History Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
              <button 
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                onClick={() => setIsPaymentHistoryExpanded(!isPaymentHistoryExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {isPaymentHistoryExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" ></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" ></i>
                )}
              </button>
            </div>
            
            {/* Collapsible Payment History Table */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isPaymentHistoryExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr style={{ height: '55px' }}>
                    <th className="w-16 text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Sr.no</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Name</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Number</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Cars Purchased</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Last Payment Date</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Sale Price</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Amount Paid</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Remaining Balance</th>
                    <th className="text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}>Status</th>
                    <th className="w-20 text-left text-sm font-medium bg-gray-100 text-muted-foreground" style={{ height: '55px', padding: '8px 16px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {customer.payments && Array.isArray(customer.payments) && customer.payments.length > 0 ? (
                    customer.payments.map((payment, index) => {
                      return (
                      <tr key={payment._id || index} style={{ height: '50px' }}>
                        <td className="text-sm text-gray-900" style={{ height: '50px', padding: '8px 16px' }}>
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="text-sm text-gray-900" style={{ height: '50px', padding: '8px 16px' }}>
                          {customer.customer?.name || 'N/A'}
                        </td>
                        <td className="text-sm text-gray-900" style={{ height: '50px', padding: '8px 16px' }}>
                          {customer.customer?.phoneNumber || 'N/A'}
                        </td>
                        <td className="text-sm text-gray-900" style={{ height: '50px', padding: '8px 16px' }}>
                          {customer.vehicle?.companyName || 'N/A'} {customer.vehicle?.model || ''}
                        </td>
                        <td className="text-sm text-gray-900" style={{ height: '50px', padding: '8px 16px' }}>
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="text-sm text-gray-900" style={{ height: '50px', padding: '8px 16px' }}>
                          Rs {customer.sale?.salePrice?.toLocaleString() || '0'}
                        </td>
                        <td className="text-sm text-gray-900" style={{ height: '50px', padding: '8px 16px' }}>
                          Rs {((payment as any).amountPaid || payment.amount || 0).toLocaleString()}
                        </td>
                        <td className="text-sm text-red-600" style={{ height: '50px', padding: '8px 16px' }}>
                          Rs {((payment as any).remainingAfterPayment || 0).toLocaleString()}
                        </td>
                        <td className="text-sm" style={{ height: '50px', padding: '8px 16px' }}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="text-sm" style={{ height: '50px', padding: '8px 16px' }}>
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => handleViewPaymentDetail(payment)}
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      );
                    })
                  ) : (
                    <tr style={{ height: '50px' }}>
                      <td colSpan={10} className="text-sm text-gray-500 text-center" style={{ height: '50px', padding: '8px 16px' }}>
                        {customer.payments ? 'No payment history available' : 'Payment history not loaded'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* View Payment Detail Modal */}
      {showViewDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white"
            style={{
              width: '520px',
              height: '650px',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              paddingTop: '24px',
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingBottom: '24px',
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
                onClick={handleCloseViewDetailModal}
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
                height: '450px',
                gap: '10px',
                opacity: 1,
                display: 'flex',
                flexDirection: 'column',
                marginTop: '16px',
                overflowY: 'auto',
                overflowX: 'hidden', // Prevent horizontal scrolling
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingBottom: '80px', // Space for fixed buttons
              }}
              className="scrollbar-hide"
            >
              {/* Status Selection - Show only current status */}
              <div className="flex flex-col gap-4" style={{ marginTop: '8px' }}>
                <div
                  className="flex items-center"
                  style={{
                    width: '100%',
                    height: '45px',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    padding: '12px',
                    gap: '8px',
                    opacity: 1,
                    backgroundColor: '#0D97001A',
                    borderColor: '#FF0000',
                    color: '#0D9700'
                  }}
                >
                  <div
                    className="rounded-full border-2 flex justify-center"
                    style={{
                      width: '16px',
                      height: '16px',
                      borderColor: '#0D9700',
                      backgroundColor: '#0D9700'
                    }}
                  >
                    <div 
                      className="rounded-full"
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#0D970080'
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-left">{selectedPayment.status || 'Unknown'}</span>
                </div>
              </div>

              {/* Sale Price and Total Paid Amount in same row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Sale Price</label>
                  <Input
                    type="number"
                    value={customer?.sale?.salePrice || 0}
                    readOnly
                    placeholder="Sale price"
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '12px',
                      height: '45px',
                      width: '100%',
                      background: '#F9FAFB',
                      color: '#6B7280'
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Total Paid Amount</label>
                  <Input
                    type="number"
                      value={(selectedPayment as any).totalPaidUpToDate || customer.sale?.paidAmount || 0}
                    readOnly
                    placeholder="Total paid amount"
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '12px',
                      height: '45px',
                      width: '100%',
                      background: '#F9FAFB',
                      color: '#6B7280'
                    }}
                  />
                </div>
              </div>

              {/* Remaining Balance and Paid Amount in same row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Remaining Balance</label>
                  <Input
                    type="number"
                      value={(selectedPayment as any).remainingAfterPayment || customer.sale?.remainingAmount || 0}
                    readOnly
                    placeholder="Remaining balance"
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '12px',
                      height: '45px',
                      width: '100%',
                      background: '#F9FAFB',
                      color: '#6B7280'
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: '8px' }}>Paid Amount</label>
                  <Input
                    type="number"
                      value={isEditMode ? editFormData.amountPaid : ((selectedPayment as any).amountPaid || selectedPayment.amount || 0)}
                    onChange={isEditMode ? (e) => handleEditFormChange('amountPaid', parseFloat(e.target.value) || 0) : undefined}
                    readOnly={!isEditMode}
                    placeholder="Payment amount"
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '12px',
                      height: '45px',
                      width: '100%',
                      background: isEditMode ? '#FFFFFF' : '#F9FAFB',
                      color: isEditMode ? '#000000' : '#6B7280'
                    }}
                  />
                </div>
              </div>

              {/* Payment Date and Payment Method in same row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: '8px' }}>Payment Date</label>
                  <Input
                    type="date"
                    value={selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toISOString().split('T')[0] : ''}
                    readOnly
                    style={{
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '12px',
                      height: '45px',
                      width: '100%',
                      background: '#F9FAFB',
                      color: '#6B7280'
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: '8px' }}>Payment Method</label>
                  {isEditMode ? (
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                        className="w-full justify-between"
                        style={{
                          height: '45px',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          padding: '12px',
                          background: '#FFFFFF'
                        }}
                      >
                        <span>{editFormData.paymentMethod.type || "Select payment method"}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      {showPaymentMethodDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {[
                            { value: "Cash", label: "Cash" },
                            { value: "Bank", label: "Bank" },
                            { value: "Cheque", label: "Cheque" },
                            { value: "BankDeposit", label: "Bank Deposit" },
                          ].map((method) => (
                            <button
                              key={method.value}
                              type="button"
                              onClick={() => {
                                handleEditPaymentMethodChange(method.value);
                                setShowPaymentMethodDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {method.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      value={selectedPayment.paymentMethod?.type || 'N/A'}
                      readOnly
                      placeholder="Payment method"
                      style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        padding: '12px',
                        height: '45px',
                        width: '100%',
                        background: '#F9FAFB',
                        color: '#6B7280'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Payment Method Specific Fields */}
              {selectedPayment.paymentMethod?.type === "Cheque" && selectedPayment.paymentMethod?.details && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Bank Name</label>
                    <Input
                      value={selectedPayment.paymentMethod.details.bankName || ''}
                      readOnly
                      placeholder="Enter bank name"
                      style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        padding: '12px',
                        height: '45px',
                        width: '100%',
                        background: '#F9FAFB',
                        color: '#6B7280'
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Cheque Number</label>
                    <Input
                      value={selectedPayment.paymentMethod.details.chequeNo || ''}
                      readOnly
                      placeholder="Enter cheque number"
                      style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        padding: '12px',
                        height: '45px',
                        width: '100%',
                        background: '#F9FAFB',
                        color: '#6B7280'
                      }}
                    />
                  </div>
                </div>
              )}

              {selectedPayment.paymentMethod?.type === "BankDeposit" && selectedPayment.paymentMethod?.details && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Bank Name</label>
                    <Input
                      value={selectedPayment.paymentMethod.details.bankName || ''}
                      readOnly
                      placeholder="Enter bank name"
                      style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        padding: '12px',
                        height: '45px',
                        width: '100%',
                        background: '#F9FAFB',
                        color: '#6B7280'
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Slip No</label>
                    <Input
                      value={selectedPayment.paymentMethod.details.slipNo || ''}
                      readOnly
                      placeholder="Enter slip number"
                      style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        padding: '12px',
                        height: '45px',
                        width: '100%',
                        background: '#F9FAFB',
                        color: '#6B7280'
                      }}
                    />
                  </div>
                </div>
              )}

              {selectedPayment.paymentMethod?.type === "Bank" && selectedPayment.paymentMethod?.details && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Bank Name</label>
                    <Input
                      value={selectedPayment.paymentMethod.details.bankName || ''}
                      readOnly
                      placeholder="Enter bank name"
                      style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        padding: '12px',
                        height: '45px',
                        width: '100%',
                        background: '#F9FAFB',
                        color: '#6B7280'
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>IBAN/Account No</label>
                      <Input
                        value={selectedPayment.paymentMethod.details.ibanNo || ''}
                        readOnly
                        placeholder="Enter IBAN or Account No"
                        style={{
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          padding: '12px',
                          height: '45px',
                          width: '100%',
                          background: '#F9FAFB',
                          color: '#6B7280'
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block" style={{ marginBottom: '8px' }}>Account No</label>
                      <Input
                        value={selectedPayment.paymentMethod.details.accountNo || ''}
                        readOnly
                        placeholder="Enter account number"
                        style={{
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          padding: '12px',
                          height: '45px',
                          width: '100%',
                          background: '#F9FAFB',
                          color: '#6B7280'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-neutral-900 block" style={{ marginBottom: '8px' }}>Notes (optional)</label>
                <textarea
                  value={selectedPayment.note || ''}
                  readOnly
                  placeholder="Enter notes"
                  rows={selectedPayment.paymentMethod?.type === "Bank" ? 2 : 3}
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '100%',
                    height: selectedPayment.paymentMethod?.type === "Bank" ? '80px' : '100px',
                    background: '#F9FAFB',
                    color: '#6B7280',
                    resize: 'none'
                  }}
                />
              </div>

            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div 
              className="flex justify-center items-center"
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                gap: '12px'
              }}
            >
                  <Button
                    type="button"
                    onClick={handleEditMode}
                className={isEditMode ? "hover:bg-gray-100" : "text-white hover:bg-gray-800"}
                    style={{
                      height: '45px',
                      borderRadius: '8px',
                  width: '230px',
                  backgroundColor: isEditMode ? 'white' : 'black',
                  color: isEditMode ? '#00674F' : 'white',
                  border: isEditMode ? '1px solid #00674F' : 'none'
                    }}
                  >
                    Edit
                  </Button>
              {!isEditMode && (
                  <Button
                    type="button"
                    onClick={handleCloseViewDetailModal}
                    className="text-white"
                    style={{
                      height: '45px',
                      borderRadius: '8px',
                      width: '230px',
                      backgroundColor: '#00674F'
                    }}
                  >
                    Close
                  </Button>
              )}
              {isEditMode && (
                  <Button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={isSubmitting}
                    className="text-white"
                    style={{
                      height: '45px',
                      borderRadius: '8px',
                      width: '230px',
                      backgroundColor: '#00674F'
                    }}
                  >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save & Close'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Update Payment Modal */}
      {customer && (
        <CustomerUpdatePaymentModal
          isOpen={showUpdatePaymentModal}
          onClose={() => setShowUpdatePaymentModal(false)}
          customer={{
            _id: customer._id,
            vehicle: customer.vehicle,
            customer: customer.customer,
            sale: customer.sale,
            payments: (customer.payments || []).map(payment => ({
              ...payment,
              installmentNumber: payment.installmentNumber || 1
            })) as any,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt
          }}
          onSubmit={(updatedCustomer) => {
            console.log("Payment updated successfully");
            setShowUpdatePaymentModal(false);
            // Show success popup
            setShowSuccess(true);
            // Update the customer data with the new payment information
            if (updatedCustomer) {
              setCustomer(updatedCustomer);
            }
            // Auto-hide success popup after 5 seconds
            setTimeout(() => {
              setShowSuccess(false);
            }, 5000);
          }}
        />
      )}

      {/* Success Popup Card - Shows when payment is updated successfully */}
      <SuccessPopupCard
        heading="Payment Updated Successfully"
        message="The payment status has been updated successfully"
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </MainLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ChevronRight, Eye, MoreVertical, Plus } from "lucide-react";
import { UpdatePaymentModal } from "@/components/ui/update-payment-modal";
import { investorAPI } from "@/lib/api";

interface PaymentHistory {
  _id: string;
  name: string;
  emailAddress: string;
  contactNumber: string;
  investorId: string;
  investAmount: number;
  percentageShare: number;
  amountPaid: number;
  remainingAmount: number;
  paymentDate: string;
  batchNo: string;
  paymentMethod: {
    type: string;
    details: any;
  };
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'inprogress':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PaymentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBatchNo, setSelectedBatchNo] = useState<string | null>(null);

  // Fetch payment history data with batch filter
  const fetchPayments = async (batchNo?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filters object
      const filters: any = {};
      if (batchNo) {
        filters.batchNo = batchNo;
      }
      
      console.log('Fetching payments with filters:', filters);
      console.log('Batch number:', batchNo);
      
      const response = await investorAPI.getAll(filters);
      
      if (response.success) {
        console.log('Payments fetched:', response.data.length);
        if (response.data.length > 0) {
          console.log('First payment batch:', response.data[0]?.batchNo);
        }
        setPayments(response.data);
      } else {
        setError(response.error || "Failed to fetch payment history");
      }
    } catch (error: any) {
      console.error("Error fetching payment history:", error);
      setError(error.message || "An error occurred while fetching payment history");
    } finally {
      setLoading(false);
    }
  };

  // Load payment history on component mount
  useEffect(() => {
    // Get batch number from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const batchNo = urlParams.get('batchNo');
    console.log('URL batch number:', batchNo);
    
    setSelectedBatchNo(batchNo);
    fetchPayments(batchNo);
  }, []);

  const filteredPayments = payments.filter((payment: PaymentHistory) => {
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || payment.paymentMethod.type === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUpdatePayment = (data: any) => {
    console.log("Update payment data:", data);
    // Here you would typically make an API call to update the payment
    // For now, we'll just log the data
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col space-y-4 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className="flex items-center"
                style={{
                gap: '12px',
                opacity: 1
              }}
            >
              <span className="text-gray-600">Batch Investment</span>
              <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              <span className="font-medium">
                {selectedBatchNo ? `Batch #${selectedBatchNo}` : 'All Batches'}
              </span>
              <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              <span className="font-medium">Payment History</span>
            </div>
            <Button
              className="flex items-center border border-gray-300 bg-white hover:bg-gray-50"
              style={{
                width: '160px',
                height: '41px',
                borderRadius: '50px',
                opacity: 1,
                borderWidth: '1px',
                gap: '8px',
                padding: '12px',
                color: '#000000'
              }}
              onClick={() => setShowUpdatePaymentModal(true)}
            >
              <Plus className="h-4 w-4" />
              Update Payment
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4  ">
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
                  placeholder="Search payments..."
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

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-gray-900">S.No</TableHead>
                  <TableHead className="font-medium text-gray-900">Investor Name</TableHead>
                  <TableHead className="font-medium text-gray-900">Total Invest Amount</TableHead>
                  <TableHead className="font-medium text-gray-900">% Share</TableHead>
                  <TableHead className="font-medium text-gray-900">Amount Invested</TableHead>
                  <TableHead className="font-medium text-gray-900">Remaining Amount</TableHead>
                  <TableHead className="font-medium text-gray-900">Share (Expected)</TableHead>
                  <TableHead className="font-medium text-gray-900">Payment Status</TableHead>
                  <TableHead className="font-medium text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading payment history...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-red-600">
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-600">
                      No payment history found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment: PaymentHistory, index: number) => (
                    <TableRow key={payment._id} style={{ height: '49px' }}>
                    <TableCell className="text-gray-600">{index + 1}</TableCell>
                      <TableCell className="font-medium text-gray-900">{payment.name}</TableCell>
                      <TableCell className="text-gray-600">PKR {payment.investAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-600">{payment.percentageShare}%</TableCell>
                      <TableCell className="text-gray-600">PKR {payment.amountPaid.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-600">PKR {payment.remainingAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-600">PKR {(payment.investAmount * payment.percentageShare / 100).toLocaleString()}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.paymentMethod.type)}`}>
                          {payment.paymentMethod.type.charAt(0).toUpperCase() + payment.paymentMethod.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Update Payment Modal */}
      <UpdatePaymentModal
        isOpen={showUpdatePaymentModal}
        onClose={() => setShowUpdatePaymentModal(false)}
        onSubmit={handleUpdatePayment}
      />
    </MainLayout>
  );
}


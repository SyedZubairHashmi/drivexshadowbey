"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronRight, Eye, MoreVertical, Plus, Users, DollarSign, Car, TrendingUp, Calendar } from "lucide-react";
import { investorAPI, batchAPI } from "@/lib/api";
import { SecureStatCard } from "@/components/ui/secure-stat-card";
import { HeaderStatCard } from "@/components/ui/header-stat-card";
import { ExpenseEditModal } from "@/components/ui/expense-edit-modal";

interface Investor {
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

export default function AllInvestorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batchData, setBatchData] = useState<any>(null);
  const [selectedBatchNo, setSelectedBatchNo] = useState<string | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(0);

  // Fetch batch data
  const fetchBatchData = async (batchNo: string) => {
    try {
      const response = await batchAPI.getByBatchNo(batchNo);
      if (response.success && response.data.length > 0) {
        setBatchData(response.data[0]);
        console.log("Batch data fetched:", response.data[0]);
        console.log("Total sale price:", response.data[0].totalSalePrice);
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  // Fetch all batch data (for when no specific batch is selected)
  const fetchAllBatchData = async () => {
    try {
      const response = await batchAPI.getAll();
      if (response.success && response.data.length > 0) {
        // Calculate sale price and revenue for all batches
        for (const batch of response.data) {
          try {
            await batchAPI.calculateSalePrice(batch._id);
            await batchAPI.calculateRevenue(batch._id);
            console.log(`Updated sale price and revenue for batch ${batch.batchNo}`);
          } catch (error) {
            console.error(`Error updating batch ${batch.batchNo}:`, error);
          }
        }
        
        // Fetch updated batch data after calculations
        const updatedResponse = await batchAPI.getAll();
        if (updatedResponse.success && updatedResponse.data.length > 0) {
          // For now, let's use the first batch or aggregate data
          const firstBatch = updatedResponse.data[0];
          setBatchData(firstBatch);
          console.log("All batch data fetched, using first batch:", firstBatch);
        }
      }
    } catch (error) {
      console.error("Error fetching all batch data:", error);
    }
  };

  // Fetch investors data with batch filter
  const fetchInvestors = async (batchNo?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filters object
      const filters: any = {};
      if (batchNo) {
        filters.batchNo = batchNo;
        // Fetch batch data for car count
        await fetchBatchData(batchNo);
      }
      
      console.log('Fetching investors with filters:', filters);
      console.log('Batch number:', batchNo);
      
      const response = await investorAPI.getAll(filters);
      
      if (response.success) {
        console.log('Investors fetched:', response.data.length);
        if (response.data.length > 0) {
          console.log('First investor batch:', response.data[0]?.batchNo);
        }
        setInvestors(response.data);
        // Update batch total investment after fetching investors
        if (batchNo) {
          await updateBatchTotalInvestment(batchNo);
        } else {
          // If no specific batch, fetch all batch data
          await fetchAllBatchData();
        }
      } else {
        setError(response.error || "Failed to fetch investors");
      }
    } catch (error: any) {
      console.error("Error fetching investors:", error);
      setError(error.message || "An error occurred while fetching investors");
    } finally {
      setLoading(false);
    }
  };

  // Calculate and update batch total investment
  const updateBatchTotalInvestment = async (batchNo: string) => {
    try {
      // Get batch data to find the batch ID
      const batchResponse = await batchAPI.getByBatchNo(batchNo);
      if (batchResponse.success && batchResponse.data.length > 0) {
        const batchId = batchResponse.data[0]._id;
        
        // Use the new API to calculate and update total investment
        await batchAPI.calculateTotalInvestment(batchId);
        console.log("Batch total investment updated for batch:", batchNo);
      }
    } catch (error) {
      console.error("Error updating batch total investment:", error);
    }
  };

  // Handle expense edit
  const handleExpenseEdit = () => {
    setCurrentExpense(batchData?.totalExpense || 0);
    setShowExpenseModal(true);
  };

  // Save expense
  const handleSaveExpense = async (amount: number) => {
    try {
      if (batchData) {
        await batchAPI.updateExpense(batchData._id, amount);
        // Refresh batch data
        if (selectedBatchNo) {
          await fetchBatchData(selectedBatchNo);
        }
        console.log("Expense updated successfully:", amount);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  };

  // Load investors on component mount
  useEffect(() => {
    // Get batch number from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const batchNo = urlParams.get('batchNo');
    console.log('URL batch number:', batchNo);
    
    setSelectedBatchNo(batchNo);
    fetchInvestors(batchNo);
  }, []);


  const filteredInvestors = investors.filter((investor: Investor) => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || investor.paymentMethod.type === filterStatus;
    return matchesSearch && matchesFilter;
  });



  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col space-y-4 pt-6">
                     {/* Header */}
           <div className="flex items-center justify-between  mb-4">
             <div>
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
                   {selectedBatchNo ? `Batch #${selectedBatchNo}` : 'All Investors'}
                 </span>
               </div>
             </div>
                         <Button
              className="flex items-center gap-2.5 border border-gray-300 bg-white hover:bg-gray-50"
              style={{
                width: '95px',
                height: '41px',
                borderRadius: '12px',
                opacity: 1,
                borderWidth: '1px',
                gap: '8px',
                padding: '12px',
                color: '#00000099'
              }}
              onClick={() => window.location.href = '/investors/batch-investment'}
            >
              View Batch
            </Button>
           </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            {/* First Row - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <HeaderStatCard
                title="Investors"
                value={investors.length}
                icon={Users}
              />
              <SecureStatCard
                title="Investment Amount"
                value={`Rs ${(batchData?.totalInvestment || 0).toLocaleString()}`}
                icon={DollarSign}
              />
              <SecureStatCard
                title="Total Cost of Batch"
                value={`Rs ${(batchData?.totalCost || 0).toLocaleString()}`}
                icon={Car}
              />
              <SecureStatCard
                title="Total Sale Price of Batch"
                value={`Rs ${(batchData?.totalSalePrice || 0).toLocaleString()}`}
                icon={TrendingUp}
              />
            </div>

            {/* Second Row - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SecureStatCard
                title="Batch Revenue"
                value={`Rs ${(batchData?.totalRevenue || 0).toLocaleString()}`}
                icon={TrendingUp}
              />
              <SecureStatCard
                title="Batch Profit"
                value={`Rs ${(batchData?.profit || 0).toLocaleString()}`}
                icon={DollarSign}
              />
              <SecureStatCard
                title="Batch Expense"
                value={`Rs ${(batchData?.totalExpense || 0).toLocaleString()}`}
                icon={Calendar}
                showEditButton={true}
                onEdit={handleExpenseEdit}
              />
              <HeaderStatCard
                title="Cars Purchased"
                value={batchData?.cars?.length || 0}
                icon={Car}
              />
            </div>
          </div>

                     {/* Search and Filter */}
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
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{
                    color: "#374151"
                  }}
                />
              </div>
            </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead >Investor Name</TableHead>
                  <TableHead >Invested Amount</TableHead>
                  <TableHead >Profit %</TableHead>
                  <TableHead >Profit Share</TableHead>
                  <TableHead >Payment Status</TableHead>
                  <TableHead >Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading investors...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-600">
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredInvestors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-600">
                      No investors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvestors.map((investor: Investor, index: number) => (
                    <TableRow key={investor._id} style={{ height: '49px' }}>
                      <TableCell className="text-black-500">{index + 1}</TableCell>
                      <TableCell className="font-medium text-black-500">{investor.name}</TableCell>
                      <TableCell className="text-black-500">PKR {investor.investAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-black-500">{investor.percentageShare}%</TableCell>
                      <TableCell className="text-black-500">PKR {(investor.investAmount * investor.percentageShare / 100).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investor.paymentMethod.type)}`}>
                          {investor.paymentMethod.type.charAt(0).toUpperCase() + investor.paymentMethod.type.slice(1)}
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

      {/* Expense Edit Modal */}
      <ExpenseEditModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSave={handleSaveExpense}
        currentAmount={currentExpense}
      />
    </MainLayout>
  );
}

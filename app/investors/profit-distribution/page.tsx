"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronRight, Eye, MoreVertical, Users, DollarSign, Car, TrendingUp, Calendar, Flag, ChevronDown } from "lucide-react";
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

interface ProfitDistribution {
  investorId: string;
  investorName: string;
  totalInvestedAmount: number;
  profitPercentage: number;
  profitDistribution: number;
  remainingProfit: number;
  profileStatus: 'paid' | 'pending';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
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

export default function ProfitDistributionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [profitDistributions, setProfitDistributions] = useState<ProfitDistribution[]>([]);
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
          setSelectedBatchNo(firstBatch.batchNo);
          console.log("All batch data fetched, using first batch:", firstBatch);
        }
      }
    } catch (error) {
      console.error("Error fetching all batch data:", error);
    }
  };

  // Calculate profit distributions
  const calculateProfitDistributions = (investors: Investor[], batchData: any): ProfitDistribution[] => {
    if (!batchData || !batchData.profit) {
      return [];
    }

    return investors.map((investor, index) => {
      const profitDistribution = (investor.percentageShare / 100) * batchData.profit;
      const remainingProfit = profitDistribution; // Assuming no profit has been distributed yet
      
      return {
        investorId: investor.investorId,
        investorName: investor.name,
        totalInvestedAmount: investor.investAmount,
        profitPercentage: investor.percentageShare,
        profitDistribution: profitDistribution,
        remainingProfit: remainingProfit,
        profileStatus: 'pending' as const // Default to pending, you can modify this logic
      };
    });
  };

  // Fetch investors data
  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const response = await investorAPI.getAll();
      if (response.success) {
        setInvestors(response.data);
        
        // Calculate profit distributions if batch data is available
        if (batchData) {
          const distributions = calculateProfitDistributions(response.data, batchData);
          setProfitDistributions(distributions);
        }
      } else {
        setError(response.error || 'Failed to fetch investors');
      }
    } catch (error) {
      console.error('Error fetching investors:', error);
      setError('Failed to fetch investors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBatchData();
  }, []);

  useEffect(() => {
    if (batchData) {
      fetchInvestors();
    }
  }, [batchData]);

  // Handle expense edit
  const handleExpenseEdit = () => {
    setCurrentExpense(batchData?.totalExpense || 0);
    setShowExpenseModal(true);
  };

  // Filter investors based on search term and status
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.investorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || investor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter profit distributions based on search term and status
  const filteredProfitDistributions = profitDistributions.filter(distribution => {
    const matchesSearch = distribution.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distribution.investorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || distribution.profileStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profit distribution data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col space-y-4 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div 
                className="flex items-center"
                style={{
                  gap: '12px',
                  opacity: 1
                }}
              >
                <h1 style={{
                  color: 'var(--Black-black-500, #000)',
                  fontSize: '22px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: '30px',
                  margin: 0
                }}>
                  Profit Distribution
                </h1>
                {batchData && (
                  <>
                    <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">Batch {batchData.batchNo}</span>
                    </div>
                  </>
                )}
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
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.No</TableHead>
                <TableHead>Investor Name</TableHead>
                <TableHead>Total Invested Amount</TableHead>
                <TableHead>Profit (%)</TableHead>
                <TableHead>Profit Distribution</TableHead>
                <TableHead>Remaining Profit</TableHead>
                <TableHead>Profile Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfitDistributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No profit distribution data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfitDistributions.map((distribution, index) => (
                  <TableRow key={distribution.investorId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{distribution.investorName}</div>
                        <div className="text-sm text-gray-500">ID: {distribution.investorId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      Rs {distribution.totalInvestedAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {distribution.profitPercentage.toFixed(2)}%
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      Rs {distribution.profitDistribution.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      Rs {distribution.remainingProfit.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(distribution.profileStatus)}`}>
                        {distribution.profileStatus.charAt(0).toUpperCase() + distribution.profileStatus.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Expense Edit Modal */}
        {showExpenseModal && (
          <ExpenseEditModal
            isOpen={showExpenseModal}
            onClose={() => setShowExpenseModal(false)}
            currentExpense={currentExpense}
            onSave={(newExpense) => {
              // Handle expense update logic here
              console.log('New expense:', newExpense);
              setShowExpenseModal(false);
            }}
          />
        )}
        </div>
      </div>
    </MainLayout>
  );
}

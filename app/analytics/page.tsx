"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecureStatCard } from "@/components/ui/secure-stat-card";
import { HeaderStatCard } from "@/components/ui/header-stat-card";
import { ExpenseEditModal } from "@/components/ui/expense-edit-modal";
import { 
  TrendingUp, 
  DollarSign, 
  Car, 
  Users, 
  Calendar,
  Edit3,
  ChevronDown,
  ChevronUp,
  Flag
} from "lucide-react";
import { useEffect, useState } from "react";
import { batchAPI } from "@/lib/api";
import { SubuserProtectedRoute } from "@/components/SubuserProtectedRoute";

// Function to format large numbers in Indian format (lacs, crores)
const formatIndianCurrency = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore or more
    const crores = amount / 10000000;
    return `${Math.round(crores)} Cr`;
  } else if (amount >= 100000) { // 1 lakh or more
    const lacs = amount / 100000;
    return `${Math.round(lacs)} Lac`;
  } else {
    return amount.toLocaleString();
  }
};

// Simple Pie Chart Component
const SimplePieChart = ({ data, colors }: { data: { name: string; count: number; color: string }[], colors: string[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500 text-sm">No Data</span>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercentage = 0;

  return (
    <div className="w-34 h-34 relative">
      <svg width="139" height="178" viewBox="0 0 130 128" className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const circumference = 2 * Math.PI * 50; // radius = 50
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
          
          cumulativePercentage += percentage;
          
          return (
            <circle
              key={index}
              cx="65"
              cy="65"
              r="50"
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="30"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
    </div>
  );
};

// Local flag renderers to match batch header behavior
const FlagJP = () => (
  <svg viewBox="0 0 3 2" className="h-4 w-6" aria-label="Japan flag" role="img">
    <path fill="#fff" d="M0 0h3v2H0z"/>
    <circle cx="1.5" cy="1" r="0.5" fill="#bc002d"/>
  </svg>
);
const FlagUS = () => (
  <svg viewBox="0 0 7410 3900" className="h-4 w-6" aria-label="United States flag" role="img">
    <path fill="#b22234" d="M0 0h7410v3900H0z"/>
    <path stroke="#fff" strokeWidth="300" d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410"/>
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z"/>
  </svg>
);
const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="h-4 w-6" aria-label="United Kingdom flag" role="img">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);
const FlagAU = () => (
  <svg viewBox="0 0 1200 600" className="h-4 w-6" aria-label="Australia flag" role="img">
    <rect width="1200" height="600" fill="#00247D"/>
  </svg>
);
const FlagKR = () => (
  <svg viewBox="0 0 3 2" className="h-4 w-6" aria-label="South Korea flag" role="img">
    <path fill="#fff" d="M0 0h3v2H0z"/>
    <g transform="translate(1.5 1)">
      <circle r="0.5" fill="#cd2e3a"/>
      <path d="M0-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" fill="#0047a0"/>
    </g>
  </svg>
);
const FLAG_COMPONENTS: { [key: string]: React.ComponentType } = {
  JP: FlagJP,
  US: FlagUS,
  GB: FlagGB,
  AU: FlagAU,
  KR: FlagKR,
};

interface PaymentData {
  name: string;
  amount: number;
  status: string;
  timestamp: Date;
  customerId?: string;
  vehicleModel?: string;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    batchProfit: 620000,
    investmentAmount: 420000,
    batchRevenue: 420000,
    totalCarsSold: 85,
    remainingCars: 12,
    mostSoldModel: "Toyota Corolla 2020",
    totalBatches: 7,
    newArrivalBatch: "4, 5 Batch",
    batchExpense: 4000000,
    totalPayment: 15250000,
    payments: [] as PaymentData[],
    // Real chart data
    companyWiseData: [] as { name: string; count: number; color: string }[],
    segmentWiseData: [] as { name: string; count: number; color: string }[],
    engineWiseData: [] as { name: string; count: number; color: string }[]
  });
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [isBatchMenuOpen, setIsBatchMenuOpen] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(0);

  // Handle expense edit
  const handleExpenseEdit = () => {
    setCurrentExpense(selectedBatch?.totalExpense || 0);
    setShowExpenseModal(true);
  };

  // Save expense
  const handleSaveExpense = async (amount: number) => {
    try {
      if (selectedBatch) {
        await batchAPI.updateExpense(selectedBatch._id, amount);
        // Refresh batch data
        await fetchAnalyticsData();
        console.log("Expense updated successfully:", amount);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  };

  // Function to process sold cars data for charts
  const processSoldCarsData = async (batch: any) => {
    if (!batch) return;

    try {
      // Get all cars in this batch
      const carsResponse = await fetch(`/api/cars?batchNo=${batch.batchNo}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!carsResponse.ok) return;

      const carsData = await carsResponse.json();
      const cars = carsData.success ? carsData.data : [];

      // Filter only sold cars
      const soldCars = cars.filter((car: any) => 
        (car?.status || '').toString().toLowerCase() === 'sold'
      );

      console.log('Total cars in batch:', cars.length);
      console.log('Sold cars:', soldCars.length);
      console.log('Sample car data:', soldCars[0]);

      // Process Company Wise Data
      const companyCount: { [key: string]: number } = {};
      soldCars.forEach((car: any) => {
        const company = car.company || 'Unknown';
        companyCount[company] = (companyCount[company] || 0) + 1;
      });

      const companyWiseData = Object.entries(companyCount)
        .map(([name, count]) => ({ name, count: count as number, color: '#10B981' }))
        .sort((a, b) => b.count - a.count);

      // Process Segment Wise Data
      const segmentCount: { [key: string]: number } = {};
      soldCars.forEach((car: any) => {
        const segment = car.carSegment || 'Unknown';
        segmentCount[segment] = (segmentCount[segment] || 0) + 1;
      });

      const segmentWiseData = Object.entries(segmentCount)
        .map(([name, count]) => ({ name, count: count as number, color: '#F59E0B' }))
        .sort((a, b) => b.count - a.count);

      // If no sold cars, show sample data for testing
      if (soldCars.length === 0) {
        console.log('No sold cars found, showing sample data');
        const sampleCompanyData = [
          { name: 'Toyota', count: 8, color: '#10B981' },
          { name: 'Suzuki', count: 5, color: '#10B981' },
          { name: 'Honda', count: 3, color: '#10B981' },
          { name: 'BMW', count: 2, color: '#10B981' }
        ];
        const sampleSegmentData = [
          { name: 'SUV', count: 5, color: '#F59E0B' },
          { name: 'Sedan', count: 3, color: '#F59E0B' },
          { name: 'Hatchback', count: 2, color: '#F59E0B' },
          { name: 'Truck', count: 1, color: '#F59E0B' }
        ];
        const sampleEngineData = [
          { name: 'Petrol', count: 7, color: '#8B5CF6' },
          { name: 'Diesel', count: 4, color: '#8B5CF6' },
          { name: 'Hybrid', count: 2, color: '#8B5CF6' }
        ];
        
        setAnalyticsData(prev => ({
          ...prev,
          companyWiseData: sampleCompanyData,
          segmentWiseData: sampleSegmentData,
          engineWiseData: sampleEngineData
        }));
        return;
      }

      // Process Engine Wise Data
      const engineCount: { [key: string]: number } = {};
      soldCars.forEach((car: any) => {
        const engine = car.engineType || 'Unknown';
        engineCount[engine] = (engineCount[engine] || 0) + 1;
      });

      const engineWiseData = Object.entries(engineCount)
        .map(([name, count]) => ({ name, count: count as number, color: '#8B5CF6' }))
        .sort((a, b) => b.count - a.count);

      setAnalyticsData(prev => ({
        ...prev,
        companyWiseData,
        segmentWiseData,
        engineWiseData
      }));

    } catch (error) {
      console.error('Error processing sold cars data:', error);
    }
  };

  // Function to fetch payment data for a specific batch
  const fetchPaymentDataForBatch = async (batch: any) => {
    try {
      const customersResponse = await fetch('/api/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        if (customersData.success && customersData.data) {
          // Fetch cars for the selected batch to get chassis numbers
          const carsResponse = await fetch('/api/cars', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (carsResponse.ok) {
            const carsData = await carsResponse.json();
            if (carsData.success && carsData.data) {
              // Get chassis numbers of cars in the selected batch
              const batchChassisNumbers = carsData.data
                .filter((car: any) => car.batchNo === batch.batchNo)
                .map((car: any) => car.chasisNumber || car.chassisNumber)
                .filter(Boolean); // Remove null/undefined values

              console.log('Selected batch:', batch.batchNo);
              console.log('Batch chassis numbers:', batchChassisNumbers);

              // Filter customers whose cars belong to the selected batch
              const batchCustomers = customersData.data.filter((customer: any) => {
                const customerChassis = customer.vehicle?.chassisNumber || customer.vehicle?.chasisNumber;
                return batchChassisNumbers.includes(customerChassis);
              });

              console.log('Filtered customers for batch:', batchCustomers.length);

              // Extract customer payment data for the selected batch only
              const customerPayments = batchCustomers
                .filter((customer: any) => customer.sale && customer.sale.paidAmount > 0)
                .map((customer: any) => {
                  return {
                    name: customer.customer?.name || 'Unknown Customer',
                    amount: Number(customer.sale?.paidAmount) || 0,
                    status: customer.sale?.paymentStatus || 'Pending',
                    timestamp: new Date(customer.sale?.saleDate || new Date()),
                    customerId: customer._id,
                    vehicleModel: customer.vehicle?.model || 'Unknown Model'
                  };
                })
                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10); // Show only latest 10 customers

              // Calculate total payment amount for selected batch only
              const totalPaymentAmount = customerPayments.reduce((sum: number, payment: any) => {
                return sum + payment.amount;
              }, 0);

              setAnalyticsData(prev => ({
                ...prev,
                payments: customerPayments || [],
                totalPayment: totalPaymentAmount || 0
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching payment data for batch:', error);
    }
  };

  const computeBatchAnalytics = async (batch: any, allBatches: any[]) => {
    if (!batch) return;
    const totalCars = Array.isArray(batch.cars) ? batch.cars.length : 0;
    const soldCars = Array.isArray(batch.cars)
      ? batch.cars.filter((c: any) => (c?.status || '').toString().toLowerCase() === 'sold').length
      : 0;
    const remainingCars = Math.max(totalCars - soldCars, 0);

    const totalRevenue = Number(batch.totalRevenue) || 0;
    const totalExpense = Number(batch.totalExpense) || 0;
    const investment = Number(batch.totalInvestment) || 0;
    const profit = Number(batch.profit) || (totalRevenue - totalExpense);

    const latestBatchNo = allBatches && allBatches.length > 0 ? allBatches[0].batchNo : '';
    const nextBatchNumbers = allBatches && allBatches.length > 0 
      ? `${allBatches.length + 1}, ${allBatches.length + 2} Batch`
      : '';

    setAnalyticsData(prev => ({
      ...prev,
      batchProfit: profit,
      investmentAmount: investment,
      batchRevenue: totalRevenue,
      totalCarsSold: soldCars,
      remainingCars: remainingCars,
      totalBatches: allBatches?.length || 0,
      newArrivalBatch: nextBatchNumbers,
      batchExpense: totalExpense,
    }));

    // Process sold cars data for charts
    processSoldCarsData(batch);

    // Fetch payment data for the selected batch
    await fetchPaymentDataForBatch(batch);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isBatchMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-dropdown-container]')) {
          setIsBatchMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBatchMenuOpen]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // First, calculate and update all batch sale prices
      try {
        await fetch('/api/batches/calculate-all-sale-prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (calcError) {
        console.warn('Warning: Could not calculate batch sale prices:', calcError);
      }
      
      // Fetch all batches
      const batchesResponse = await batchAPI.getAll();
      if (batchesResponse.success) {
        const batches = batchesResponse.data || [];
        setBatches(batches);
        if (batches.length > 0 && !selectedBatch) {
          setSelectedBatch(batches[0]);
          await computeBatchAnalytics(batches[0], batches);
        } else if (selectedBatch) {
          // Refresh metrics with possibly updated data
          const refreshed = batches.find((b: any) => b._id === selectedBatch._id) || selectedBatch;
          await computeBatchAnalytics(refreshed, batches);
        }
        
        // Calculate totals using the updated batch data
        const totalProfit = batches.reduce((sum: number, batch: any) => sum + (batch.profit || 0), 0);
        const totalInvestment = batches.reduce((sum: number, batch: any) => sum + (batch.totalInvestment || 0), 0);
        const totalRevenue = batches.reduce((sum: number, batch: any) => sum + (batch.totalRevenue || 0), 0);
        const totalCarsSold = batches.reduce((sum: number, batch: any) => sum + (batch.cars?.length || 0), 0);
        const totalBatches = batches.length;
        
        // Calculate total sale price from all batches
        const batchTotalSalePrice = batches.reduce((sum: number, batch: any) => sum + (batch.totalSalePrice || 0), 0);
        
        // Keep aggregate totals if needed in future; per-batch metrics set above
      }

      // Payment data will be fetched when a batch is selected in computeBatchAnalytics
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <SubuserProtectedRoute requiredAccess="analytics">
      <MainLayout>
        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        gap: '24px', 
         alignSelf: 'stretch',
         paddingTop: '20px'
      }}>
        {/* Page Header */}
        <h1 style={{
          color: '#000',
          fontSize: '22px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '30px',
          margin: 0
        }}>
          Analytics
        </h1>

      {/* Second Row - Financial Metrics */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between", // pushes metrics left & dropdown right
    alignItems: "flex-start",
    width: "100%",
  }}
>
  {/* Financial Metrics Group (left side) */}
  <div
    style={{
      display: "flex",
      gap: "44px",
      alignItems: "flex-start",
    }}
  >
          {/* Batch Profit */}
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        style={{
          color: "#7A7A7A",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
              Batch Profit
            </div>
      <div
        style={{
          color: "#242424",
        
          fontSize: "38px",
          fontWeight: "500",
          lineHeight: "58px",
        }}
      >
              PKR {formatIndianCurrency(analyticsData.batchProfit)}
            </div>
          </div>

          {/* Investment Amount */}
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        style={{
          color: "#242424",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
              Investment Amount
            </div>
      <div
        style={{
          color: "#242424",
          
          fontSize: "38px",
          fontWeight: "500",
        }}
      >
              PKR {formatIndianCurrency(analyticsData.investmentAmount)}
            </div>
          </div>

          {/* Batch Revenue */}
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        style={{
          color: "#7A7A7A",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
              Batch Revenue
            </div>
      <div
        style={{
          color: "#242424",
        
          fontSize: "38px",
          fontWeight: "500",
        }}
      >
              PKR {formatIndianCurrency(analyticsData.batchRevenue)}
      </div>
            </div>
          </div>

  {/* Batch Selector Dropdown (right side) */}
  <div style={{ position: 'relative' }} data-dropdown-container>
    <button
      type="button"
      onClick={() => setIsBatchMenuOpen(v => !v)}
      style={{
        display: "flex",
        padding: "10px 16px",
        alignItems: "center",
        gap: "12px",
        borderRadius: "8px",
        border: "1px solid rgba(0, 0, 0, 0.24)",
        background: "#FFF",
        minWidth: "140px",
        whiteSpace: "nowrap",
        fontSize: "14px",
        fontWeight: "500",
        color: "#000",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0, 103, 79, 0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0, 0, 0, 0.24)";
      }}
    >
      {(() => {
        const FlagComp = selectedBatch?.flagImage ? (FLAG_COMPONENTS as any)[selectedBatch.flagImage] : null;
        return FlagComp ? <FlagComp /> : <Flag className="w-4 h-4" />;
      })()}
      <span style={{ 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis",
        flex: 1
      }}>
        {selectedBatch ? `Batch ${selectedBatch.batchNo}` : 'Select Batch'}
      </span>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        transition: "transform 0.2s ease-in-out",
        transform: isBatchMenuOpen ? "rotate(180deg)" : "rotate(0deg)"
      }}>
        <ChevronDown className="w-4 h-4" style={{ flexShrink: 0 }} />
      </div>
    </button>

    {isBatchMenuOpen && batches && batches.length > 0 && (
      <div
        style={{
          position: 'absolute',
          right: 0,
          marginTop: '8px',
          background: '#FFF',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          zIndex: 20,
          minWidth: '180px',
          padding: '6px',
          animation: 'slideDown 0.2s ease-out',
          transformOrigin: 'top'
        }}
      >
        {batches.map((b: any) => (
          <div
            key={b._id}
            onClick={async () => {
              setSelectedBatch(b);
              setIsBatchMenuOpen(false);
              await computeBatchAnalytics(b, batches);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: '36px',
              transition: 'background-color 0.2s ease-in-out',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = '#F0F9F4')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent')}
          >
            {(() => {
              const FlagComp = b.flagImage ? (FLAG_COMPONENTS as any)[b.flagImage] : null;
              return FlagComp ? <FlagComp /> : <Flag className="w-4 h-4" />;
            })()}
            <span style={{ 
              fontSize: '14px', 
              color: '#111',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}>
              {`Batch ${b.batchNo}`}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
        </div>

        {/* 6 Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <HeaderStatCard
            title="Total Cars Sold"
            value={analyticsData.totalCarsSold.toString()}
            icon={Car}
          />
          <HeaderStatCard
            title="Remaining Cars"
            value={analyticsData.remainingCars.toString()}
            icon={Car}
          />
          <HeaderStatCard
            title="Most Sold Model"
            value={analyticsData.mostSoldModel}
            icon={TrendingUp}
          />
          <HeaderStatCard
            title="Total Batches"
            value={`${analyticsData.totalBatches} Recorded`}
            icon={Calendar}
          />
          <HeaderStatCard
            title="New Arrival Batch"
            value={analyticsData.newArrivalBatch}
            icon={Calendar}
          />
          <SecureStatCard
            title="Batch Expenses"
            value={`PKR ${formatIndianCurrency(analyticsData.batchExpense)}`}
            icon={DollarSign}
            showEditButton={true}
            onEdit={handleExpenseEdit}
          />
        </div>

        {/* Bottom Section - Analytics and Payments */}
        <div className="flex gap-6 w-full">
          {/* Left Side - Chart Cards Stacked Vertically */}
          <div className="flex flex-col gap-6 w-3/5">
            {/* Sold Cars Ratio */}
            <div style={{
              display: 'flex',
              width: '100%',
              height: '248px',
              padding: '28px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '10px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              background: '#FFF'
            }}>
             <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}>
              <h3 style={{
                color: '#000',
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
              }}>
                Sold Cars Ratio
              </h3>
              <h3 style={{
                color: '#000',
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
              }}>
                Company Wise
              </h3>
            </div>  
            <div className="flex items-center gap-8">
              {/* Pie Chart */}
              <div>
                <SimplePieChart 
                  data={analyticsData.companyWiseData} 
                  colors={['#10B981', '#059669', '#047857', '#065f46', '#064e3b']} 
                />
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {analyticsData.companyWiseData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: ['#10B981', '#059669', '#047857', '#065f46', '#064e3b'][index % 5] }}
                      ></div>
                      <span className="text-sm">{item.name} ({item.count})</span>
                    </div>
                  ))}
                  {analyticsData.companyWiseData.length === 0 && (
                    <div className="text-sm text-gray-500">No sold cars data</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Car Segment */}
          <div style={{
            display: 'flex',
            width: '100%',
            height: '248px',
            padding: '28px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: '#FFF'
          }}>
           <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
          }}>
            <h3 style={{
              color: '#000',
              fontSize: '18px',
                fontWeight: '500',
              margin: 0
            }}>
              Sold Cars Ratio
            </h3>
              <h3 style={{
                color: '#000',
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
              }}>
                Segment Wise
              </h3>
            </div> 
            
            <div className="flex items-center gap-8">
              {/* Pie Chart */}
              <div>
                <SimplePieChart 
                  data={analyticsData.segmentWiseData} 
                  colors={['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F']} 
                />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {analyticsData.segmentWiseData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'][index % 5] }}
                    ></div>
                    <span className="text-sm">{item.name} ({item.count})</span>
                  </div>
                ))}
                {analyticsData.segmentWiseData.length === 0 && (
                  <div className="text-sm text-gray-500">No sold cars data</div>
                )}
                </div>
                </div>
                </div>

          {/* Car Engine Type */}
          <div style={{
            display: 'flex',
            width: '100%',
            height: '248px',
            padding: '28px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: '#FFF'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}>
              <h3 style={{
                color: '#000',
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
              }}>
                Sold Cars Ratio
              </h3>
              <h3 style={{
                color: '#000',
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
              }}>
                Engine Wise
              </h3>
                </div>
            
            <div className="flex items-center gap-8">
              {/* Pie Chart */}
              <div>
                <SimplePieChart 
                  data={analyticsData.engineWiseData} 
                  colors={['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95']} 
                />
                </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {analyticsData.engineWiseData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'][index % 5] }}
                    ></div>
                    <span className="text-sm">{item.name} ({item.count})</span>
                  </div>
                ))}
                {analyticsData.engineWiseData.length === 0 && (
                  <div className="text-sm text-gray-500">No sold cars data</div>
                )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payments */}
          <div style={{
            display: 'flex',
            flex: '1 1 auto',
            minWidth: '300px',
            maxWidth: '500px',
            padding: '24px 28px',
            flexDirection: 'column',
            gap: '23px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: '#FFF',
            height: 'fit-content'
          }}>
            {/* Payment Header */}
            <div className="flex justify-between items-center w-full">
              <h3 style={{
                color: '#000',
                fontSize: '18px',
                fontWeight: '600',
                margin: 0
              }}>
                Payments
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Total Payment</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Total Payment Amount */}
            <div style={{
              color: '#000',
              fontSize: '24px',
              fontWeight: '600',
              textAlign: 'left'
            
            }}>
              Rs {formatIndianCurrency(analyticsData.totalPayment)}
            </div>

            <p className="text-sm text-gray-600 text-left">
              Track all payments by amount and status.
            </p>

            {/* Payment List */}
            <div className="w-full space-y-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {analyticsData.payments.length > 0 ? (
                analyticsData.payments
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((payment, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    padding: '16px 20px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '8px',
                    border: '1px solid #F2F2F2',
                    background: '#FFF',
                    minHeight: '60px',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '20px' }}>
                    <div className="font-medium text-gray-900" style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      fontSize: '16px',
                      flex: '1'
                    }}>
                      {payment.name || 'Unknown Customer'}
                    </div>
                    <div className="text-sm text-gray-600" style={{ fontSize: '16px', flex: '1', textAlign: 'center' }}>
                      Rs {payment.amount ? payment.amount.toLocaleString() : '0'}
                    </div>
                    <div style={{
                      borderRadius: '16px',
                      textAlign: 'center',
                      padding: '4px 8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: payment.status === 'Completed' ? '#10B981' : '#FA1A1B',
                      flex: '1',
                      backgroundColor: payment.status === 'completed' ? '#e0edea' : '#FEE4E4'
                    }}>
                      {payment.status}
                    </div>
                  </div>
                </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No payment data available</p>
                </div>
              )}
            </div>

            {/* View All Payments Button */}
            <button className="w-full bg-[#00674f] text-white py-3 px-4 rounded-lg font-medium transition-colors">
              View All Payments
            </button>
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
    </SubuserProtectedRoute>
  );
}


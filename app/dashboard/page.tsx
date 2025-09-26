"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { HeaderStatCard } from "@/components/ui/header-stat-card";
import { SecureStatCard } from "@/components/ui/secure-stat-card";
import { BatchCarsSection } from "@/components/batch/BatchCarsSection";
import { Header } from "@/components/layout/header";
import { CompanyProtectedRoute } from "@/components/CompanyProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { carAPI, batchAPI } from "@/lib/api";
import type { Car } from "@/types";

// Function to format large numbers in Indian format (lacs, crores)
const formatIndianCurrency = (amount: number): string => {
  console.log('formatIndianCurrency input:', amount);
  
  if (amount >= 10000000) { // 1 crore or more
    const crores = amount / 10000000;
    const result = `${Math.round(crores)} Cr`;
    console.log('Crores result:', result);
    return result;
  } else if (amount >= 100000) { // 1 lakh or more
    const lacs = amount / 100000;
    const result = `${Math.round(lacs)} Lac`;
    console.log('Lacs result:', result);
    return result;
  } else {
    const result = amount.toLocaleString();
    console.log('Normal result:', result);
    return result;
  }
};


export default function DashboardPage() {
  const { user, hasAccess } = useAuth();
  const [expandedBatch, setExpandedBatch] = useState<string>("");
  const [collapsedStates, setCollapsedStates] = useState<{ [key: string]: boolean }>({});
  const [batches, setBatches] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCarsSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
    carsInStock: 0,
    carsInTransit: 0,
    pendingPayments: 0,
    pendingPaymentsCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch batches, cars, and customers in parallel
      const [batchesResponse, carsResponse, customersResponse] = await Promise.all([
        batchAPI.getAll(),
        carAPI.getAll(),
        fetch('/api/customers', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }).then(res => res.json())
      ]);

      if (batchesResponse.success && carsResponse.success) {
        const batchesData = batchesResponse.data;
        const carsData = carsResponse.data;

        // Sort batches by batch number (latest first)
        const sortedBatches = batchesData.sort((a: any, b: any) => {
          const numA = parseInt(a.batchNo.replace(/\D/g, ''));
          const numB = parseInt(b.batchNo.replace(/\D/g, ''));
          return numB - numA;
        });

        setBatches(sortedBatches);
        setCars(carsData);

        // Calculate dashboard stats from all batches
        const totalRevenue = batchesData.reduce((sum: number, batch: any) => {
          return sum + (batch.totalRevenue || 0);
        }, 0);

        const totalProfit = batchesData.reduce((sum: number, batch: any) => {
          const profit = batch.profit || ((batch.totalRevenue || 0) - (batch.totalExpense || 0));
          return sum + profit;
        }, 0);

        // Calculate pending payments from customers
        let pendingPayments = 0;
        let pendingPaymentsCustomers = 0;
        
        if (customersResponse.success && customersResponse.data) {
          const customers = customersResponse.data;
          pendingPayments = customers
            .filter((customer: any) => 
              customer.sale && 
              customer.sale.paymentStatus && 
              customer.sale.paymentStatus.toLowerCase() === 'pending'
            )
            .reduce((sum: number, customer: any) => {
              const pendingAmount = (customer.sale.salePrice || 0) - (customer.sale.paidAmount || 0);
              return sum + Math.max(0, pendingAmount);
            }, 0);

          pendingPaymentsCustomers = customers.filter((customer: any) => 
            customer.sale && 
            customer.sale.paymentStatus && 
            customer.sale.paymentStatus.toLowerCase() === 'pending'
          ).length;
        }

        // Calculate car stats
        const totalCarsSold = carsData.filter((car: any) => 
          car.status === 'sold' || car.status === 'Sold'
        ).length;

        const carsInStock = carsData.filter((car: any) => 
          car.status === 'available' || car.status === 'warehouse' || 
          car.status === 'Available' || car.status === 'Warehouse'
        ).length;

        const carsInTransit = carsData.filter((car: any) => 
          car.status === 'in_transit' || car.status === 'In Transit' || 
          car.status === 'transit' || car.status === 'Transit' ||
          car.status === 'in-transit' || car.status === 'In-Transit'
        ).length;

        // Debug logging
        console.log('Dashboard Stats:', {
          totalRevenue,
          totalProfit,
          pendingPayments,
          totalRevenueFormatted: formatIndianCurrency(totalRevenue),
          totalProfitFormatted: formatIndianCurrency(totalProfit),
          pendingPaymentsFormatted: formatIndianCurrency(pendingPayments)
        });

        // Test the function with known values
        console.log('Test formatting:', {
          test1M: formatIndianCurrency(1000000), // Should show "10 Lac"
          test15M: formatIndianCurrency(1500000), // Should show "15 Lac" 
          test100M: formatIndianCurrency(10000000), // Should show "1 Cr"
          test50L: formatIndianCurrency(500000), // Should show "5 Lac"
        });

        setStats({
          totalCarsSold,
          totalRevenue,
          totalProfit,
          carsInStock,
          carsInTransit,
          pendingPayments,
          pendingPaymentsCustomers,
        });

        // Set the latest batch as expanded by default
        if (sortedBatches.length > 0) {
          setExpandedBatch(sortedBatches[0].batchNo);
        }
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message || "An error occurred while fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Filter cars by batch number and show exactly 6 cars
  const getCarsForBatch = (batchNumber: string) => {
    return cars
      .filter((car: any) => {
        // Check if car belongs to this batch
        if (typeof car.batchNo === 'string') {
          return car.batchNo === batchNumber;
        } else if (car.batchNo && car.batchNo.batchNo) {
          return car.batchNo.batchNo === batchNumber;
        }
        return false;
      })
      .slice(0, 6) as Car[]; // Show exactly 6 cars
  };

  // Handle batch toggle
  const handleBatchToggle = (batchNumber: string) => {
    if (expandedBatch === batchNumber) {
      // If clicking the currently expanded batch, collapse it
      setExpandedBatch("");
      setCollapsedStates(prev => ({
        ...prev,
        [batchNumber]: true
      }));
    } else {
      // If clicking a different batch, expand it and collapse others
      setExpandedBatch(batchNumber);
      setCollapsedStates(prev => {
        const newState = { ...prev };
        // Collapse all batches
        batches.forEach(batch => {
          newState[batch.batchNo] = true;
        });
        // Expand the clicked batch
        newState[batchNumber] = false;
        return newState;
        
      });
    }
  };

  // Subusers now see the same dashboard as company users

  return (
    <CompanyProtectedRoute>
      <MainLayout>
      <div className="space-y-8 h-screen overflow-hidden  ">
        <div className="spacey-2">

        <Header/>
        
        {/* Header Stats Cards - Hide only when dashboardUnits is explicitly false */}
        {!(user?.role === 'subuser' && user?.access?.dashboardUnits === false) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
            <HeaderStatCard
              title="Total Cars Sold"
              value={stats.totalCarsSold}
              subtitle="sold in 2023 | Jan-Aug"
            />
            <SecureStatCard
              title="Total Revenue"
              value={`PKR ${formatIndianCurrency(stats.totalRevenue)}`}
            />
            <SecureStatCard
              title="Total Profit"
              value={`PKR ${formatIndianCurrency(stats.totalProfit)}`}
            />
            <HeaderStatCard
              title="Cars in Stock"
              value={stats.carsInStock}
            />
            <HeaderStatCard
              title="Cars in transit"
              value={stats.carsInTransit}
              subtitle="ETA within 2-6 weeks"
            />
            <SecureStatCard
              title="Pending Payments"
              value={`PKR ${formatIndianCurrency(stats.pendingPayments)}`}
            />
          </div>
        )}
        </div>

        {/* Latest Batch Section - Fixed height, no scrolling */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : batches.length > 0 ? (
          <div className="flex-1 overflow-hidden mt-4 ">
            <BatchCarsSection
              key={batches[0]._id}
              batchTitle={`Batch ${batches[0].batchNo}`}
              batchNumber={batches[0].batchNo}
              cars={getCarsForBatch(batches[0].batchNo)}
              isExpanded={expandedBatch === batches[0].batchNo}
              onToggle={() => handleBatchToggle(batches[0].batchNo)}
              isLatestBatch={true}
              batchData={batches[0]}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Batches Found</h3>
              <p className="text-gray-600">Create your first batch to get started.</p>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </CompanyProtectedRoute>
  );
}

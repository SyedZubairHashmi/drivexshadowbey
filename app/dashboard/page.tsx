"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { HeaderStatCard } from "@/components/ui/header-stat-card";
import { SecureStatCard } from "@/components/ui/secure-stat-card";
import { BatchCarsSection } from "@/components/batch/BatchCarsSection";
import { Header } from "@/components/layout/header";
import { CompanyProtectedRoute } from "@/components/CompanyProtectedRoute";
import { carAPI, batchAPI } from "@/lib/api";
import type { Car } from "@/types";


export default function DashboardPage() {
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

      // Fetch batches and cars in parallel
      const [batchesResponse, carsResponse] = await Promise.all([
        batchAPI.getAll(),
        carAPI.getAll()
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

        // Calculate dashboard stats
        const totalCarsSold = carsData.filter((car: any) => 
          car.status === 'sold' || car.status === 'Sold'
        ).length;

        const totalRevenue = carsData
          .filter((car: any) => car.status === 'sold' || car.status === 'Sold')
          .reduce((sum: number, car: any) => {
            const salePrice = car.saleInfo?.salePrice || car.financing?.totalCost || 0;
            return sum + salePrice;
          }, 0);

        const totalProfit = carsData
          .filter((car: any) => car.status === 'sold' || car.status === 'Sold')
          .reduce((sum: number, car: any) => {
            const salePrice = car.saleInfo?.salePrice || car.financing?.totalCost || 0;
            const totalCost = car.financing?.totalCost || 0;
            return sum + (salePrice - totalCost);
          }, 0);

        const carsInStock = carsData.filter((car: any) => 
          car.status === 'available' || car.status === 'warehouse' || 
          car.status === 'Available' || car.status === 'Warehouse'
        ).length;

        const carsInTransit = carsData.filter((car: any) => 
          car.status === 'in_transit' || car.status === 'In Transit' || 
          car.status === 'transit' || car.status === 'Transit' ||
          car.status === 'in-transit' || car.status === 'In-Transit'
        ).length;

        setStats({
          totalCarsSold,
          totalRevenue,
          totalProfit,
          carsInStock,
          carsInTransit,
          pendingPayments: 0, // Will be calculated based on business logic
          pendingPaymentsCustomers: 0, // Will be calculated based on business logic
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

  return (
    <CompanyProtectedRoute>
      <MainLayout>
      <div className="space-y-8 h-screen overflow-hidden  ">
        <div className="spacey-2">

        <Header/>
        
        {/* Header Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
          <HeaderStatCard
            title="Total Cars Sold"
            value={stats.totalCarsSold}
            subtitle="sold in 2023 | Jan-Aug"
          />
          <SecureStatCard
            title="Total Revenue"
            value={`Rs ${stats.totalRevenue.toLocaleString()}`}
          />
          <SecureStatCard
            title="Total Profit"
            value={`Rs ${stats.totalProfit.toLocaleString()}`}
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
            value={`Rs ${stats.pendingPayments.toLocaleString()}`}
          />
        </div>
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

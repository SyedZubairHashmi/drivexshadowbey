"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecureStatCard } from "@/components/ui/secure-stat-card";
import { HeaderStatCard } from "@/components/ui/header-stat-card";
import { 
  TrendingUp, 
  DollarSign, 
  Car, 
  Users, 
  Calendar,
  Edit3,
  ChevronDown,
  Flag
} from "lucide-react";
import { useEffect, useState } from "react";
import { batchAPI } from "@/lib/api";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    batchProfit: 620000,
    investmentAmount: 420000,
    batchRevenue: 420000,
    totalCarsSold: 85,
    remainingCars: 12,
    mostSoldModel: "Toyota Corolla 2020",
    totalBatches: 7,
    newArrivalBatch: "06, 02 Batch",
    batchExpense: 4000000,
    totalPayment: 15250000,
    payments: [
      { name: "Svetlana", amount: 28500000, status: "Completed" },
      { name: "Isabella", amount: 29000000, status: "Pending" },
      { name: "Ahmed", amount: 15000000, status: "Completed" },
      { name: "Maria", amount: 22000000, status: "Completed" },
      { name: "John", amount: 18000000, status: "Pending" }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

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
        const batches = batchesResponse.data;
        
        // Calculate totals using the updated batch data
        const totalProfit = batches.reduce((sum: number, batch: any) => sum + (batch.profit || 0), 0);
        const totalInvestment = batches.reduce((sum: number, batch: any) => sum + (batch.totalInvestment || 0), 0);
        const totalRevenue = batches.reduce((sum: number, batch: any) => sum + (batch.totalRevenue || 0), 0);
        const totalCarsSold = batches.reduce((sum: number, batch: any) => sum + (batch.cars?.length || 0), 0);
        const totalBatches = batches.length;
        
        // Calculate total sale price from all batches
        const batchTotalSalePrice = batches.reduce((sum: number, batch: any) => sum + (batch.totalSalePrice || 0), 0);
        
        setAnalyticsData(prev => ({
          ...prev,
          batchProfit: totalProfit,
          investmentAmount: totalInvestment,
          batchRevenue: totalRevenue, // Use calculated total revenue (sale price - cost price)
          totalCarsSold,
          totalBatches
        }));
      }
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
    <MainLayout>
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
              PKR {analyticsData.batchProfit.toLocaleString()}
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
              PKR {analyticsData.investmentAmount.toLocaleString()}
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
              PKR {analyticsData.batchRevenue.toLocaleString()}
      </div>
            </div>
          </div>

  {/* Batch Selector Dropdown (right side) */}
  <div
    style={{
      display: "flex",
      padding: "10px",
      alignItems: "center",
      gap: "12px",
      borderRadius: "8px",
      border: "1px solid rgba(0, 0, 0, 0.24)",
      background: "#FFF",
    }}
  >
            <Flag className="w-4 h-4" />
            <span>Batch 05</span>
            <ChevronDown className="w-4 h-4" />
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
            value={`PKR ${analyticsData.batchExpense.toLocaleString()}`}
            icon={DollarSign}
            showEditButton={true}
            onEdit={() => console.log('Edit batch expense')}
          />
        </div>

        {/* Bottom Section - Analytics and Payments */}
        <div className="flex gap-6 w-full">
          {/* Left Side - Analytics */}
          <div style={{
            display: 'flex',
            width: '650px',
            padding: '28px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '29px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: '#FFF'
          }}>
            <h3 style={{
              color: '#000',
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}>
              Sold Cars Ratio
            </h3>
            
            <div className="flex items-center gap-8">
              {/* Pie Chart */}
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="139" height="140" viewBox="0 0 139 140" fill="none">
                  <path d="M93.3796 135.297C110.188 129.137 123.968 116.723 131.843 100.647C139.717 84.5702 141.079 66.0735 135.643 49.0172C130.207 31.9609 118.393 17.6632 102.668 9.10832C86.9431 0.553456 68.5214 -1.59744 51.2484 3.10459L60.1811 35.9193C68.994 33.5203 78.3929 34.6177 86.416 38.9825C94.4392 43.3473 100.467 50.6421 103.24 59.3444C106.014 68.0466 105.319 77.4839 101.301 85.6862C97.2832 93.8886 90.2527 100.222 81.6769 103.365L93.3796 135.297Z" fill="#00674F" fillOpacity="0.2"/>
                  <path d="M138.871 70.1021C138.871 83.8352 134.799 97.2598 127.169 108.678C119.539 120.097 108.695 128.997 96.0073 134.252C83.3196 139.508 69.3584 140.883 55.8893 138.203C42.4201 135.524 30.0479 128.911 20.3372 119.2L44.3851 95.1525C49.3396 100.107 55.652 103.481 62.5241 104.848C69.3962 106.215 76.5193 105.513 82.9927 102.832C89.466 100.151 94.9989 95.61 98.8916 89.7841C102.784 83.9582 104.862 77.1089 104.862 70.1021H138.871Z" fill="#00674F" fillOpacity="0.5"/>
                  <path d="M69.4355 0.666656C53.0697 0.666656 37.2299 6.4474 24.7112 16.9888C12.1925 27.5302 3.79962 42.1547 1.01355 58.2816C-1.77252 74.4085 1.22731 91.0012 9.48368 105.132C17.7401 119.262 30.7223 130.022 46.1395 135.513L57.5496 103.475C49.6836 100.674 43.06 95.184 38.8475 87.9745C34.635 80.765 33.1045 72.2993 34.526 64.0712C35.9474 55.8431 40.2296 48.3815 46.6167 43.0032C53.0039 37.6249 61.0855 34.6755 69.4355 34.6755V0.666656Z" fill="#00674F"/>
                  <path d="M138.922 70.1021C138.922 52.2005 132.008 34.9906 119.623 22.0646C107.238 9.13851 90.3394 1.49524 72.4541 0.730068C54.5689 -0.0351004 37.0792 6.13697 23.6356 17.958C10.192 29.7791 1.83343 46.3356 0.304494 64.1717L34.1891 67.0764C34.9691 57.9762 39.2338 49.5289 46.0928 43.4977C52.9519 37.4665 61.8753 34.3174 71.0005 34.7078C80.1257 35.0982 88.7476 38.9979 95.0664 45.5929C101.385 52.1879 104.913 60.9685 104.913 70.1021H138.922Z" fill="#00674F" fillOpacity="0.6"/>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00674F' }}></div>
                  <span className="text-sm">TOYOTA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00674F', opacity: 0.6 }}></div>
                  <span className="text-sm">BMW</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00674F', opacity: 0.5 }}></div>
                  <span className="text-sm">TESLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00674F', opacity: 0.2 }}></div>
                  <span className="text-sm">MERCEDES</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00674F', opacity: 0.8 }}></div>
                  <span className="text-sm">AUDI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00674F', opacity: 0.4 }}></div>
                  <span className="text-sm">VOLKSWAGEN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payments */}
          <div style={{
            display: 'flex',
            width: '430px',
            padding: '24px 28px',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '23px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            background: '#FFF'
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
              textAlign: 'center'
            }}>
              Rs {analyticsData.totalPayment.toLocaleString()}
            </div>

            <p className="text-sm text-gray-600 text-center">
              Track all payments by amount, and status.
            </p>

            {/* Payment List */}
            <div className="w-full space-y-3">
              {analyticsData.payments.map((payment, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    padding: '16px 24px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    border: '1px solid #F2F2F2',
                    background: '#FFF'
                  }}
                >
                  <div>
                    <div className="font-medium text-gray-900">{payment.name}</div>
                    <div className="text-sm text-gray-600">Rs {payment.amount.toLocaleString()}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Payments Button */}
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              View All Payments
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}


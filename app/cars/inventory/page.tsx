"use client"; // <-- add this at the very top

import { MainLayout } from "@/components/layout/main-layout";
import { BatchCarsSection } from "@/components/batch/BatchCarsSection";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BatchModal } from "@/components/ui/batch-modal";
import { useState, useEffect } from "react";
import { batchAPI, carAPI } from "@/lib/api";
import type { Car } from "@/types";

interface Batch {
  _id: string;
  batchNo: string;
  investor: {
    name: string;
    contactNumber: string;
    emailAddress: string;
    investorId: string;
    cnic: string;
    investmentAmount: number;
    percentageShare: number;
    paymentDate: string;
    paymentMethod: string;
  };
  status: string;
  totalCars: number;
  soldCars: number;
  revenue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch batches and cars in parallel
      const [batchesResponse, carsResponse] = await Promise.all([
        batchAPI.getAll(),
        carAPI.getAll()
      ]);

      if (batchesResponse.success && carsResponse.success) {
        setBatches(batchesResponse.data);
        setCars(carsResponse.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Filter cars by batch number
  const getCarsForBatch = (batchNumber: string) => {
    return cars.filter(car => {
      return car.batchNo === batchNumber;
    }) as Car[];
  };

  // Get unique batch numbers from batches data
  const getUniqueBatches = () => {
    return batches
      .map(batch => batch.batchNo)
      .sort((a, b) => {
        // Extract numbers from batch numbers for proper sorting
        const numA = parseInt(a.replace(/\D/g, ''));
        const numB = parseInt(b.replace(/\D/g, ''));
        return numB - numA; // Sort descending (latest first)
      });
  };

  const uniqueBatches = getUniqueBatches();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory...</p>
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
              onClick={fetchData}
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
        {/* Main Content fills all remaining space */}
        <div className="flex-1 flex flex-col space-y-2 pt-4">
          {/* Header Section with Page Name and Add Button */}
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
             All Inventory
            </h1>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '158px',
                height: '50px',
                borderRadius: '50px',
                paddingTop: '10px',
                paddingRight: '18px',
                paddingBottom: '10px',
                paddingLeft: '18px',
                gap: '10px',
                borderWidth: '1px',
                opacity: 1
              }}
            >
              <Plus className="h-4 w-4" />
              Create Batch
            </Button>
          </div>

          {/* Batch Sections */}
          {uniqueBatches.length > 0 ? (
            uniqueBatches.map((batchNumber, index) => {
              const batchCars = getCarsForBatch(batchNumber);
              console.log(`Rendering batch ${batchNumber} with ${batchCars.length} cars`);
              
              return (
                <BatchCarsSection 
                  key={batchNumber}
                  batchTitle={`Batch ${batchNumber}`} 
                  batchNumber={batchNumber} 
                  cars={batchCars}
                  isLatestBatch={index === 0}
                />
              );
            })
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Batches Found</h3>
              <p className="text-gray-600">Create your first batch to get started.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Batch Modal */}
      <BatchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </MainLayout>
  );
}

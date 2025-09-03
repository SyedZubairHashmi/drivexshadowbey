"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { BatchCarsSection } from "@/components/batch/BatchCarsSection";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { carAPI, batchAPI } from "@/lib/api";
import type { Car } from "@/types";

export default function TransitPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const batchesPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch cars with transit status
      const carsResponse = await carAPI.getAll({ status: 'transit' });
      
      if (carsResponse.success) {
        setCars(carsResponse.data);
      } else {
        setError(carsResponse.error || "Failed to fetch cars");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Filter cars by transit status for a specific batch
  const getTransitCarsForBatch = (batchNumber: string) => {
    return cars.filter((car: any) => {
      return car.batchNo === batchNumber && car.status === 'transit';
    }) as Car[];
  };

  // Get unique batch numbers that have transit cars
  const getUniqueBatchesWithTransitCars = () => {
    // Only include batches that actually have cars with transit status
    const batchesWithTransitCars = cars
      .filter((car: any) => car.status === 'transit' && car.batchNo)
      .map((car: any) => car.batchNo);
    
    const uniqueBatchNumbers = [...new Set(batchesWithTransitCars)];
    return uniqueBatchNumbers.sort((a, b) => {
      // Extract numbers from batch numbers for proper sorting
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numB - numA; // Sort descending (latest first)
    });
  };

  const uniqueBatches = getUniqueBatchesWithTransitCars();

  // Calculate pagination
  const totalPages = Math.ceil(uniqueBatches.length / batchesPerPage);
  const startIndex = (currentPage - 1) * batchesPerPage;
  const endIndex = startIndex + batchesPerPage;
  const currentBatches = uniqueBatches.slice(startIndex, endIndex);

  const handleAddNewCar = () => {
    // Navigate to add car page with a default batch number
    // You can change this to any default batch number you prefer
    router.push('/cars/inventory/01/add-car');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transit cars...</p>
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

  // Function to get page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen">
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
              Vehicles In Transit 
            </h1>
            <Button 
              onClick={handleAddNewCar}
              className="flex items-center gap-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '148px',
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
              <Plus className="h-4 w-4" />
              Add New Car
            </Button>
          </div>

          {/* Batch Sections */}
          {currentBatches.map((batchNumber) => {
            const batchCars = getTransitCarsForBatch(batchNumber);
            
            // Since we're only showing batches with transit cars, always include "Transit" in title
            const batchTitle = `Batch ${batchNumber} Transit`;
            
            return (
              <BatchCarsSection 
                key={batchNumber}
                batchTitle={batchTitle} 
                batchNumber={batchNumber} 
                cars={batchCars}
              />
            );
          })}

                    {/* Pagination */}
          {totalPages > 1 && (
            <div 
              className="flex items-center justify-center mt-8"
              style={{
                width: "294px",
                height: "25px",
                opacity: 1,
                gap: "20px"
              }}
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon 
                  icon={faChevronLeft} 
                  className="text-gray-600 hover:text-gray-800"
                  style={{ fontSize: "16px" }}
                />
              </button>
              
              <div className="flex items-center justify-center gap-2 flex-1">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="flex items-center justify-center text-gray-500" style={{ width: "26px", height: "25px" }}>
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className="flex items-center justify-center transition-all duration-200"
                        style={{
                          width: "26px",
                          height: "25px",
                          opacity: 1,
                          gap: "10px",
                          padding: "8px",
                          backgroundColor: currentPage === page ? "#00674F" : "transparent",
                          color: currentPage === page ? "white" : "#00674F"
                        }}
                      >
                        {page}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon 
                  icon={faChevronRight} 
                  className="text-gray-600 hover:text-gray-800"
                  style={{ fontSize: "16px" }}
                />
              </button>
            </div>
          )}

          {/* No transit cars message */}
          {uniqueBatches.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transit Cars</h3>
              <p className="text-gray-600">There are currently no cars in transit status.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

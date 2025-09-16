"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { CarTable } from "@/components/ui/car-table";
import { BatchHeader } from "@/components/ui/batch-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { carAPI, batchAPI } from "@/lib/api";
import type { Car } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface BatchDetailPageProps {
  params: {
    batchNumber: string;
  };
}

export default function BatchDetailPage({ params }: BatchDetailPageProps) {
  const router = useRouter();
  const { batchNumber } = params;
  console.log("BatchDetailPage received batchNumber:", batchNumber);
  const [cars, setCars] = useState<any[]>([]);
  const [allBatches, setAllBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [importYearFilter, setImportYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCars();
  }, [batchNumber]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching cars for batch number:", batchNumber);
      
      // Fetch cars for this specific batch and all batches in parallel
      const [carsResponse, batchesResponse] = await Promise.all([
        carAPI.getAll({ batchNo: batchNumber }),
        batchAPI.getAll()
      ]);
      
      console.log("API response:", carsResponse);
      
      if (carsResponse.success && batchesResponse.success) {
        setCars(carsResponse.data);
        setAllBatches(batchesResponse.data);
        console.log("Cars loaded:", carsResponse.data.length);
        // Update batch total cost after fetching cars
        await updateBatchTotalCost(batchNumber);
      } else {
        console.error("API error:", carsResponse.error);
        setError(carsResponse.error || "Failed to fetch cars");
      }
    } catch (error: any) {
      console.error("Error fetching cars:", error);
      setError(error.message || "An error occurred while fetching cars");
    } finally {
      setLoading(false);
    }
  };

  // Calculate and update batch total cost
  const updateBatchTotalCost = async (batchNo: string) => {
    try {
      // Get batch data to find the batch ID
      const batchResponse = await batchAPI.getByBatchNo(batchNo);
      if (batchResponse.success && batchResponse.data.length > 0) {
        const batchId = batchResponse.data[0]._id;
        
        // Use the new API to calculate and update total cost
        await batchAPI.calculateTotalCost(batchId);
        // Also calculate revenue after cost update
        await batchAPI.calculateRevenue(batchId);
        console.log("Batch total cost and revenue updated for batch:", batchNo);
      }
    } catch (error) {
      console.error("Error updating batch total cost:", error);
    }
  };

  const handleDeleteCar = (car: Car) => {
    console.log("Delete car:", car);
  };

  const handleAddNewCar = () => {
    router.push(`/cars/inventory/${batchNumber}/add-car`);
  };

  // Filter cars based on search and filter criteria
  const filteredCars = cars.filter(car => {
    const matchesSearch = searchTerm === '' || 
      car.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.chasisNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = companyFilter === '' || companyFilter === 'all' || car.company === companyFilter;
    const matchesGrade = gradeFilter === '' || gradeFilter === 'all' || car.auctionGrade.toString() === gradeFilter;
    const matchesImportYear = importYearFilter === '' || importYearFilter === 'all' || car.importYear.toString() === importYearFilter;
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || car.status === statusFilter;
    
    return matchesSearch && matchesCompany && matchesGrade && matchesImportYear && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleGenerateInvoice = (car: any) => {
    console.log("Generate invoice for car:", car);
    // Navigate to invoice generation page
    router.push(`/sales-and-payments/invoice?carId=${car.id}&batchNumber=${batchNumber}`);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, companyFilter, gradeFilter, importYearFilter, statusFilter]);

  // Check if this batch is the latest one
  const isLatestBatch = () => {
    if (allBatches.length === 0) return false;
    
    // Sort batches by batch number (latest first)
    const sortedBatches = allBatches.sort((a: any, b: any) => {
      const numA = parseInt(a.batchNo.replace(/\D/g, ''));
      const numB = parseInt(b.batchNo.replace(/\D/g, ''));
      return numB - numA;
    });
    
    return sortedBatches[0]?.batchNo === batchNumber;
  };



  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
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
              onClick={fetchCars}
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
        <div className="flex-1 flex flex-col space-y-4 p-2">
          {/* Navigation Breadcrumb with Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">All Inventory</span>
              <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
              <span className="font-medium">Batch {batchNumber}</span>
            </div>
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

          {/* Batch Header with Filters */}
          <BatchHeader
            title={`Batch ${batchNumber}`}
            onAddNew={handleAddNewCar}
            showFilters={true}
            isExpanded={true}
            batchNumber={batchNumber}
            isLatestBatch={isLatestBatch()}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            companyFilter={companyFilter}
            onCompanyFilterChange={setCompanyFilter}
            gradeFilter={gradeFilter}
            onGradeFilterChange={setGradeFilter}
            importYearFilter={importYearFilter}
            onImportYearFilterChange={setImportYearFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Car Table */}
          <div className="mt-6">
            <div style={{ height: '710px', overflow: 'hidden' }}>
              <CarTable
                cars={currentCars}
                batchNumber={batchNumber}
                onGenerateInvoice={handleGenerateInvoice}
              />
            </div>
          </div>

          {/* Total Batch Cost */}
          <div className="flex justify-end mt-4">
            <span className="text-[18px] font-semibold text-black-900">Total Cost = </span>
            <span className="text-[16px] text-black-600">
              PKR {cars.reduce((total, car) => {
                // Calculate total cost for each car using the same logic as the virtual field
                const f = car.financing;
                if (!f) return total;
                
                const carTotalCost = (
                  (f.auctionPrice?.totalAmount || 0) +
                  (f.auctionExpenses?.totalAmount || 0) +
                  (f.inlandCharges?.totalAmount || 0) +
                  (f.loadingCharges?.totalAmount || 0) +
                  (f.containerCharges?.totalAmount || 0) +
                  (f.freightSea?.totalAmount || 0) +
                  (f.variantDuty || 0) +
                  (f.passportCharges || 0) +
                  (f.servicesCharges || 0) +
                  (f.transportCharges || 0) +
                  (f.repairCharges || 0) +
                  (f.miscellaneousCharges || 0) +
                  (f.vehicleValueCif || 0) +
                  (f.landingCharges || 0) +
                  (f.customsDuty || 0) +
                  (f.salesTax || 0) +
                  (f.federalExciseDuty || 0) +
                  (f.incomeTax || 0) +
                  (f.freightAndStorageCharges || 0) +
                  (f.demurrage || 0) +
                  (f.ageOfVehicle || 0)
                );
                
                return total + carTotalCost;
              }, 0).toLocaleString()}
            </span>
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`text-sm ${
                    currentPage === page
                      ? 'bg-[#00674F] text-white'
                      : 'text-black  bg-transparent'
                  }`}
                  style={{
                    width: '26px',
                    height: '25px',
                    borderRadius: '1000px',
                    opacity: 1,
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              
              <button
                className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

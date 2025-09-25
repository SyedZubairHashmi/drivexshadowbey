"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BatchHeader } from "@/components/ui/batch-header";
import { CarTable } from "@/components/ui/car-table";
import { AddCarModal } from "@/components/ui/add-car-modal";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import type { Car as CarType } from "@/types";

interface BatchCarsSectionProps {
  batchTitle: string; // e.g. "Batch 05"
  batchNumber: string; // e.g. "05"
  cars: CarType[];
  isExpanded?: boolean;
  onToggle?: () => void;
  isLatestBatch?: boolean;
  batchData?: {
    _id: string;
    batchNo: string;
    countryOfOrigin: string;
    flagImage: string;
  };
}

export function BatchCarsSection({ 
  batchTitle, 
  batchNumber, 
  cars, 
  isExpanded: externalIsExpanded,
  onToggle: externalOnToggle,
  isLatestBatch,
  batchData
}: BatchCarsSectionProps) {
  const router = useRouter();

  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [internalIsExpanded, setInternalIsExpanded] = useState(true);

  // Filters state for batch sections
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [importYearFilter, setImportYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Use external state if provided, otherwise use internal state
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const handleToggle = externalOnToggle || (() => setInternalIsExpanded(!internalIsExpanded));

  // Apply dropdown filters
  const filteredCars = cars.filter((car: any) => {
    const q = (searchTerm || '').toLowerCase();
    const carName = (car.carName || '').toLowerCase();
    const company = (car.company || '').toLowerCase();
    const chassis = (car.chasisNumber || '').toLowerCase();
    const auctionGrade = car.auctionGrade != null ? String(car.auctionGrade) : '';
    const importYear = car.importYear != null ? String(car.importYear) : '';
    const status = (car.status || '').toLowerCase();

    const matchesSearch = q === '' || carName.includes(q) || company.includes(q) || chassis.includes(q);
    const matchesCompany = companyFilter === '' || companyFilter === 'all' || company === companyFilter.toLowerCase();
    const matchesGrade = gradeFilter === '' || gradeFilter === 'all' || auctionGrade === gradeFilter;
    const matchesImportYear = importYearFilter === '' || importYearFilter === 'all' || importYear === importYearFilter;
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || status === statusFilter.toLowerCase();

    return matchesSearch && matchesCompany && matchesGrade && matchesImportYear && matchesStatus;
  });

  const handleAddNewCar = (carData: any) => {
    console.log("Add new car:", carData);
    setShowAddCarModal(false);
  };

  const handleEditCar = (car: CarType) => {
    console.log("Edit car:", car);
  };

  const handleGenerateInvoice = (car: CarType) => {
    console.log("Generate invoice for car:", car);
    // Navigate to invoice generation page
    router.push(`/sales-and-payments/invoice?carId=${car.id}&batchNumber=${batchNumber}`);
  };

  return (
    <div>
      {/* Header */}
      <BatchHeader
        title={batchTitle}
        onAddNew={() => setShowAddCarModal(true)}
        showFilters={true}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        batchNumber={batchNumber}
        isLatestBatch={isLatestBatch}
        batchData={batchData}
        // Filters wiring
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

      {/* Table with smooth transition */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-3">
          <CarTable
            cars={filteredCars}
            batchNumber={batchNumber}
            onGenerateInvoice={handleGenerateInvoice}
          />
        </div>
      </div>

      {/* Add Button with smooth transition */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex w-full justify-center mt-2 border-gray-200">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            style={{
              borderRadius: "12px"
            }}
            onClick={() => router.push(`/cars/inventory/${batchNumber}/add-car`)}
          >
            <Plus className="h-4 w-4" />
            Add New Car
          </Button>
        </div>
      </div>

      {/* Modals */}
      {/* <AddCar Modal
        open={showAddCarModal}
        onOpenChange={setShowAddCarModal}
        onSubmit={handleAddNewCar}
      /> */}
    </div>
  );
}

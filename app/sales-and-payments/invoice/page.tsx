"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus,MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { customerAPI, batchAPI } from "@/lib/api";

interface Customer {
  _id: string;
  vehicle: {
    companyName: string;
    model: string;
    chassisNumber: string;
  };
  customer: {
  name: string;
    phoneNumber: string;
    email?: string;
    address?: string;
  };
  sale: {
    saleDate: string;
    salePrice: number;
    paidAmount: number;
    remainingAmount: number;
    paymentStatus: string;
    note?: string;
    document?: string;
  };
  payments?: Array<{
    _id?: string;
    paymentDate: string;
    amountPaid: number;
    remainingAfterPayment: number;
    totalPaidUpToDate: number;
    paymentMethod: {
      type: string;
      details?: {
        bankName?: string;
        ibanNo?: string;
        accountNo?: string;
        chequeNo?: string;
        chequeClearanceDate?: string;
        slipNo?: string;
      };
    };
    status: string;
    installmentNumber?: number;
    note?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function InvoicePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [importYearFilter, setImportYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dropdown option sources
  const gradeOptions = ["6", "5", "4.5", "4", "3.5", "3", "2.5", "2"];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => String(currentYear - i));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await customerAPI.getAll();
      
      if (response.success) {
        setCustomers(response.data);
        console.log("Customers fetched successfully:", response.data);
        // Update batch total sale prices after fetching customers
        await updateBatchSalePrices(response.data);
      } else {
        setError(response.error || "Failed to fetch customers");
      }
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      setError(error.message || "An error occurred while fetching customers");
    } finally {
      setLoading(false);
    }
  };

  // Update batch total sale prices
  const updateBatchSalePrices = async (customersData: Customer[]) => {
    try {
      // Get unique batch numbers from customers (we need to find cars first)
      // For now, we'll get all batches and update their sale prices
      const batchesResponse = await batchAPI.getAll();
      if (batchesResponse.success) {
        for (const batch of batchesResponse.data) {
          try {
            await batchAPI.calculateSalePrice(batch._id);
            // Also calculate revenue after sale price update
            await batchAPI.calculateRevenue(batch._id);
            console.log(`Updated sale price and revenue for batch ${batch.batchNo}`);
          } catch (error) {
            console.error(`Error updating sale price for batch ${batch.batchNo}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error updating batch sale prices:", error);
    }
  };

  const handleAddNewInvoice = () => {
    console.log("Add new invoice clicked");
    // TODO: Implement add new invoice functionality
  };

  // Filter customers based on search and filter criteria (case-insensitive & safe)
  const filteredCustomers = customers.filter((customer) => {
    const customerName = customer.customer?.name || '';
    const phoneNumber = customer.customer?.phoneNumber || '';
    const chassis = customer.vehicle?.chassisNumber || '';
    const companyName = customer.vehicle?.companyName || '';
    const model = customer.vehicle?.model || '';
    const paymentStatus = customer.sale?.paymentStatus || '';
    const derivedImportYear = (customer as any).vehicle?.importYear
      ? String((customer as any).vehicle.importYear)
      : (customer.sale?.saleDate ? String(new Date(customer.sale.saleDate).getFullYear()) : '');

    const q = (searchTerm || '').toLowerCase();
    const matchesSearch =
      q === '' ||
      customerName.toLowerCase().includes(q) ||
      phoneNumber.toLowerCase().includes(q) ||
      chassis.toLowerCase().includes(q) ||
      companyName.toLowerCase().includes(q) ||
      model.toLowerCase().includes(q);

    const matchesCompany =
      companyFilter === '' ||
      companyFilter === 'all' ||
      companyName.toLowerCase() === companyFilter.toLowerCase();

    const matchesGrade =
      gradeFilter === '' ||
      gradeFilter === 'all' ||
      model.toLowerCase().includes(gradeFilter.toLowerCase());

    const matchesImportYear =
      importYearFilter === '' ||
      importYearFilter === 'all' ||
      derivedImportYear === importYearFilter;

    const matchesStatus =
      statusFilter === '' ||
      statusFilter === 'all' ||
      paymentStatus.toLowerCase() === statusFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesCompany &&
      matchesGrade &&
      matchesImportYear &&
      matchesStatus
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCustomers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, companyFilter, gradeFilter, importYearFilter, statusFilter]);

  const handleViewInvoice = (customer: Customer) => {
    console.log("View invoice:", customer);
    // TODO: Implement view invoice functionality
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoice data...</p>
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
              onClick={fetchCustomers}
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
      <div className="space-y-5 pt-6">
        {/* Header with Invoice heading and Add button - aligned with table */}
        <div className="bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-gray-900 font-semibold" style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '22px',
              lineHeight: '30px',
              letterSpacing: '0%'
            }}>
              Invoices & Receipts
            </h1>
            <Button 
              onClick={handleAddNewInvoice}
              className="flex items-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '180px',
                height: '50px',
                borderRadius: '50px',
                paddingTop: '10px',
                paddingRight: '15px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                gap: '10px',
                borderWidth: '1px',
                opacity: 1
              }}
            >
              <Plus className="h-4 w-4" />
              Generate Invoices
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
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
                  placeholder="Search invoices..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm search-input"
                  style={{
                    color: "#374151"
                  }}
                />
              </div>

            </div>

            <div className="flex gap-2">
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger 
                  className="w-32"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Company" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {/* Japanese Brands */}
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Suzuki">Suzuki</SelectItem>
                  <SelectItem value="Daihatsu">Daihatsu</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                  <SelectItem value="Mazda">Mazda</SelectItem>
                  <SelectItem value="Isuzu">Isuzu</SelectItem>
                  <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                  
                  {/* German Luxury Brands */}
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                  
                  {/* Japanese Luxury Brands */}
                  <SelectItem value="Lexus">Lexus</SelectItem>
                  <SelectItem value="Acura">Acura</SelectItem>
                  
                  {/* Korean Brands */}
                  <SelectItem value="Kia">Kia</SelectItem>
                  <SelectItem value="Hyundai">Hyundai</SelectItem>
                  
                  {/* Chinese Brands */}
                  <SelectItem value="GWM">GWM</SelectItem>
                  <SelectItem value="BYD">BYD</SelectItem>
                  <SelectItem value="Changan">Changan</SelectItem>
                  <SelectItem value="Chery">Chery</SelectItem>
                  <SelectItem value="FAW">FAW</SelectItem>
                  
                  {/* American Brands */}
                  <SelectItem value="Tesla">Tesla</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="Cadillac">Cadillac</SelectItem>
                  <SelectItem value="Chrysler">Chrysler</SelectItem>
                  <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                  <SelectItem value="GMC">GMC</SelectItem>
                  <SelectItem value="Jeep">Jeep</SelectItem>
                  
                  {/* British Brands */}
                  <SelectItem value="Land Rover">Land Rover</SelectItem>
                  <SelectItem value="MG">MG</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger 
                  className="w-24"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Grade" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {gradeOptions.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
              </Select>

              <Select value={importYearFilter} onValueChange={setImportYearFilter}>
                <SelectTrigger 
                  className="w-32"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Import Year" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger 
                  className="w-28"
                  style={{
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    background: "#FFF",
                    color: "#00000099",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  <SelectValue placeholder="Status" style={{ whiteSpace: "nowrap" }} />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Invoice Table with fixed height and pagination */}
            <div className="bg-white rounded-lg border  border-gray-200">
          <div style={{ overflow: 'hidden' }}>
            <div className="[&_.relative]:overflow-hidden ">
              <Table>
                <TableHeader>
                  <TableRow style={{ height: '45px' }}>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>S.No</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Invoice ID</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Name</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Car Detail</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Invoice Date</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Payment Date</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Payment Method</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Amount (PKR)</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099' }}>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((customer, index) => (
                    <TableRow key={customer._id} style={{ height: '40px' }}>
                      <TableCell style={{ padding: '8px 16px' }}>
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        INV-{customer._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        {customer.customer.name || 'N/A'}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        {customer.vehicle.companyName && customer.vehicle.model 
                          ? `${customer.vehicle.companyName} ${customer.vehicle.model} ${new Date(customer.sale.saleDate).getFullYear()}`
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        {customer.sale.saleDate ? new Date(customer.sale.saleDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        {customer.sale.saleDate ? new Date(customer.sale.saleDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        {customer.payments && customer.payments.length > 0 
                          ? customer.payments[customer.payments.length - 1].paymentMethod?.type || 'N/A'
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        Rs {(customer.sale.salePrice || 0).toLocaleString()}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px' }}>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewInvoice(customer)}
                            style={{
                              display: 'flex',
                              padding: '0px 10px',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: '11px',
                              height: '20px',
                              borderRadius: '25px',
                              background: 'rgba(0, 0, 0, 0.12)',
                              color: '#000000',
                              border: 'none'
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{
                              display: 'flex',
                              padding: '4px',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '1000px',
                              color: '#000000',
                              border: 'none'
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-center ">
            <div className="flex items-center gap-4 justify-center">
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
                      : 'text-black bg-transparent'
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
    </MainLayout>
  );
}

"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
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
import { customerAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

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
    paymentStatus: string;
    note?: string;
    document?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function RemainingBalancePage() {
  const router = useRouter();
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

  const handleAddNewCustomer = () => {
    console.log("Add new customer clicked - navigating to sold cars page with modal open");
    // Navigate to sold cars page with modal open and track source
    router.push('/cars/sold?modal=open&from=remaining-balance');
  };

  // Filter customers based on search and filter criteria
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchTerm === '' || 
      customer.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.vehicle.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.vehicle.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = companyFilter === '' || companyFilter === 'all' || customer.vehicle.companyName === companyFilter;
    const matchesGrade = gradeFilter === '' || gradeFilter === 'all' || customer.vehicle.model.includes(gradeFilter);
    const matchesImportYear = importYearFilter === '' || importYearFilter === 'all' || customer.vehicle.importYear?.toString() === importYearFilter;
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || customer.sale.paymentStatus === statusFilter;
    
    return matchesSearch && matchesCompany && matchesGrade && matchesImportYear && matchesStatus;
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading remaining balance data...</p>
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
        {/* Header with Remaining Balance heading and Add button - aligned with table */}
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
              Remaining Balance
            </h1>
            <Button 
              onClick={handleAddNewCustomer}
              className="flex items-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '200px',
                height: '50px',
                borderRadius: '50px',
                paddingTop: '10px',
                paddingRight: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                gap: '10px',
                borderWidth: '1px',
                opacity: 1
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Customer
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
                  placeholder="Search customers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm search-input"
                  style={{
                    color: "#374151"
                  }}
                />
              </div>

              <Button 
                variant="outline" 
                size="sm"
                style={{
                  height: "41px",
                  borderRadius: "12px",
                  gap: "10px",
                  padding: "12px",
                  borderWidth: "1px",
                  color: "#00000099"
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
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
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="3">3</SelectItem>
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
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Remaining Balance Table with fixed height and pagination */}
            <div className="bg-white rounded-lg border border-gray-200">
          <div style={{ overflow: 'hidden' }}>
            <div className="[&_.relative]:overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow style={{ height: '45px' }}>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Sr.No</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Name</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Chassis Number</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Cars Purchased</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Last Purchased Date</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Total Spend</TableHead>
                    <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Remaining Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((customer, index) => (
                    <TableRow key={customer._id} style={{ height: '40px' }}>
                      <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                        {customer.customer.name || 'N/A'}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                        {customer.vehicle.chassisNumber || 'N/A'}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                        {customer.vehicle.companyName && customer.vehicle.model 
                          ? `${customer.vehicle.companyName} ${customer.vehicle.model}`
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                        {customer.sale.saleDate ? new Date(customer.sale.saleDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                        Rs {(customer.sale.salePrice || 0).toLocaleString()}
                      </TableCell>
                      <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                        <div className="flex items-center justify-between">
                          <span style={{ color: '#FF0000' }}>
                            Rs {(customer.sale.remainingAmount || 0).toLocaleString()}
                          </span>
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
                            <MoreVertical className="h-4 w-4" />
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
      </div>
          {/* Pagination */}
          <div className="flex flex-col items-center justify-center py-4">
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
    </MainLayout>
  );
}

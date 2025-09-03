"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { CustomerTable } from "@/components/ui/customer-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { customerAPI } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
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

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  useEffect(() => {
    console.log("CustomersPage: Component mounted");
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log("CustomersPage: Fetching customers from API...");
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
    router.push('/cars/sold?modal=open&from=customer');
  };

  // Calculate pagination
  const totalPages = Math.ceil(customers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const currentCustomers = customers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditCustomer = (customer: Customer) => {
    console.log("Edit customer:", customer);
    // TODO: Implement edit customer functionality
  };

  const handleDeleteCustomer = (customer: Customer) => {
    console.log("Delete customer:", customer);
    // TODO: Implement delete customer functionality
  };

  const handleViewCustomer = (customer: Customer) => {
    console.log("View customer:", customer);
    // TODO: Implement view customer functionality
  };

  const handleStatusChange = async (customer: Customer): Promise<boolean> => {
    console.log("CustomerPage: Status change requested for customer:", customer);
    try {
      // Refresh the customers list to show updated data
      console.log("CustomerPage: Refreshing customers list...");
      await fetchCustomers();
      console.log("CustomerPage: Customers refreshed successfully after status change");
      return true; // Return true if refresh was successful
    } catch (error) {
      console.error("CustomerPage: Error refreshing customers:", error);
      return false; // Return false if refresh failed
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading customers...</p>
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
        {/* Header with Customer heading and Add button - aligned with table */}
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
              Customers
            </h1>
            <Button 
              onClick={handleAddNewCustomer}
              className="flex items-center  border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '160px',
                height: '50px',
                borderRadius: '50px',
                paddingTop: '10px',
                paddingRight: '12px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                gap: '10px',
                borderWidth: '1px',
                opacity: 1
              }}
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Customers Table with fixed height and pagination */}
        <div className="bg-white">
          <div style={{ overflow: 'hidden' }}>
            <div className="[&_.relative]:overflow-hidden">
              <CustomerTable 
                customers={currentCustomers} 
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                onView={handleViewCustomer}
                onChangeStatus={handleStatusChange}
              />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-center  ">
           
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

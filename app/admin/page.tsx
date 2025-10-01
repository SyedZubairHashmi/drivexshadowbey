"use client";


import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { CompanyTable } from "@/components/admin/company-table";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, X, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companyAPI } from "@/lib/api";

interface Company {
  _id: string;
  ownerName: string;
  companyName: string;
  companyEmail: string;
  role: 'company' | 'admin';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    companyName: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    status: 'active'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Debounce search input to avoid unnecessary re-renders while typing
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching companies (initial load or admin actions)");
      // Fetch all companies once; filter and paginate on the client
      const response = await companyAPI.getAll();
      
      console.log("API Response:", response);
      
      if (response.success) {
        const companiesData = response.data || [];
        setCompanies(companiesData);
        console.log("Companies fetched successfully:", companiesData);
        console.log("Number of companies:", companiesData.length);
        
        // Log each company for debugging
        companiesData.forEach((company: any, index: number) => {
          console.log(`Company ${index + 1}:`, {
            id: company._id,
            ownerName: company.ownerName,
            companyName: company.companyName,
            companyEmail: company.companyEmail,
            status: company.status,
            role: company.role
          });
        });
      } else {
        console.error("API returned error:", response.error);
        setError(response.error || "Failed to fetch companies");
      }
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      setError(error.message || "An error occurred while fetching companies");
      // Set empty array as fallback
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCompany = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({
      ownerName: '',
      companyName: '',
      companyEmail: '',
      password: '',
      confirmPassword: '',
      status: 'active'
    });
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    // Reset form data after showing details
    setFormData({
      ownerName: '',
      companyName: '',
      companyEmail: '',
      password: '',
      confirmPassword: '',
      status: 'active'
    });
  };

  const handleViewCompany = (company: Company) => {
    // Populate form data with the selected company's details
    setFormData({
      ownerName: company.ownerName,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      password: '', // Don't show password for security
      confirmPassword: '',
      status: company.status
    });
    setIsDetailsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCompany = async () => {
    try {
      // Validate required fields
      if (!formData.ownerName || !formData.companyName || !formData.companyEmail || !formData.password) {
        alert('Please fill in all required fields: Owner Name, Company Name, Company Email, and Password');
        return;
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      // Create company data for multi-tenant platform
      const companyData = {
        ownerName: formData.ownerName,
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        password: formData.password,
        role: 'company', // Automatically set role to 'company'
        status: formData.status,
        pin: '123456', // Default PIN
        recoveryEmail: formData.companyEmail // Use company email as recovery email
      };

      // Call API to create company
      const response = await companyAPI.create(companyData);
      
      if (response.success) {
        // Refresh the companies list
        await fetchCompanies();
        setIsModalOpen(false);
        setIsDetailsModalOpen(true);
        console.log('Company created successfully:', response.data);
      } else {
        alert(response.error || 'Failed to create company');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error creating company');
    }
  };

  // Filter companies based on search and filter criteria
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      company.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.companyEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || company.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCompanies.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle company status change
  const handleStatusChange = async (company: Company, newStatus: 'active' | 'inactive') => {
    try {
      const response = await companyAPI.updateStatus(company._id, newStatus);
      
      if (response.success) {
        // Update the company in the local state
        setCompanies(prevCompanies => 
          prevCompanies.map(c => 
            c._id === company._id ? { ...c, status: newStatus } : c
          )
        );
        
        // Show success message
        alert(`Company status updated to ${newStatus} successfully!`);
      } else {
        alert(response.error || 'Failed to update company status');
      }
    } catch (error: any) {
      console.error('Error updating company status:', error);
      alert('Error updating company status: ' + error.message);
    }
  };

  // Reset to page 1 when filters change (client-side filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={fetchCompanies}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
              {/* Header with List of Companies heading and Add button */}
              <div className="bg-white pb-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-gray-900 font-semibold" style={{
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '22px',
                    lineHeight: '30px',
                    letterSpacing: '0%'
                  }}>
                    List of Companies
                  </h1>
                                     <Button 
                     onClick={handleAddNewCompany}
                     className="flex items-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                     style={{
                       width: '120px',
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
                     Add New
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
                        placeholder="Search companies..." 
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Companies Table */}
              <div className="bg-white rounded-lg border border-gray-200">
                {currentItems.length > 0 ? (
                  <CompanyTable 
                    companies={currentItems}
                    startIndex={startIndex}
                    onView={handleViewCompany}
                    onEdit={(company) => console.log("Edit company:", company)}
                    onDelete={(company) => console.log("Delete company:", company)}
                    onStatusChange={handleStatusChange}
                  />
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 text-lg">No companies found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Click "Add New" to create your first company'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="flex items-center gap-4 justify-center">
                    <button
                      className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Company Modal */}
        {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            style={{
              display: 'flex',
              width: '520px',
              padding: '20px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.24)',
              background: '#FFF'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ 
                  color: '#111827',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '8px'
                }}>
                  Add New Company
                </h2>
                <p style={{ 
                  color: '#6B7280',
                  fontSize: '14px',
                  margin: 0
                }}>
                  Please fill in the details of the company
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  display: 'flex',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X className="h-4 w-4" color="#374151" />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              {/* Owner Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Owner Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Owner Name"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  style={{
                    display: 'flex',
                    height: '42px',
                    padding: '10px 12px',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.24)',
                    background: '#FFF',
                    boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Company Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  style={{
                    display: 'flex',
                    height: '42px',
                    padding: '10px 12px',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.24)',
                    background: '#FFF',
                    boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Company Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Email
                </label>
                <input
                  type="email"
                  placeholder="Enter-company-email"
                  value={formData.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  style={{
                    display: 'flex',
                    height: '42px',
                    padding: '10px 12px',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.24)',
                    background: '#FFF',
                    boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Company Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Password
                </label>
                <div style={{ position: 'relative' }}>
                <input
                    type={showPassword ? "text" : "password"}
                  placeholder="Enter-company-password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={{
                    display: 'flex',
                    height: '42px',
                      padding: '10px 40px 10px 12px',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.24)',
                    background: '#FFF',
                    boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                    outline: 'none',
                      fontSize: '14px',
                      width: '100%'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter-Confirm-password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  style={{
                    display: 'flex',
                    height: '42px',
                      padding: '10px 40px 10px 12px',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.24)',
                    background: '#FFF',
                    boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                    outline: 'none',
                      fontSize: '14px',
                      width: '100%'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>


              {/* Company Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Status
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleInputChange('status', 'active')}
                    style={{
                      display: 'flex',
                      width: '100px',
                      height: '42px',
                      padding: '10px 12px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: formData.status === 'active' ? '#00674F' : '#F3F4F6',
                      color: formData.status === 'active' ? '#FFF' : '#374151',
                      boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleInputChange('status', 'inactive')}
                    style={{
                      display: 'flex',
                      width: '100px',
                      height: '42px',
                      padding: '10px 12px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '8px',
                      border: '1px solid #B300003D',
                      background: formData.status === 'inactive' ? 'rgba(179, 0, 0, 0.10)' : '#F3F4F6',
                      color: '#B30000',
                      boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveCompany}
              style={{
                display: 'flex',
                height: '45px',
                maxHeight: '45px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                border: 'none',
                background: '#00674F',
                color: '#FFF',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

        {/* Company Details Modal */}
        {isDetailsModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            style={{
              display: 'flex',
              width: '520px',
              padding: '20px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
              borderRadius: '12px',
              border: '1px solid #0000003D',
              background: '#FFF'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 style={{ 
                color: '#111827',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0
              }}>
                Company Details
              </h2>
              <button
                onClick={handleCloseDetailsModal}
                style={{
                  display: 'flex',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X className="h-4 w-4" color="#374151" />
              </button>
            </div>

            {/* Details Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {/* Owner Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Owner Name
                </label>
                <div style={{
                  display: 'flex',
                  height: '42px',
                  padding: '10px 12px',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  color: '#6B7280',
                  fontSize: '14px'
                }}>
                  {formData.ownerName || 'Not provided'}
                </div>
              </div>

              {/* Company Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Name
                </label>
                <div style={{
                  display: 'flex',
                  height: '42px',
                  padding: '10px 12px',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  color: '#6B7280',
                  fontSize: '14px'
                }}>
                  {formData.companyName || 'Not provided'}
                </div>
              </div>

              {/* Company Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Status
                </label>
                <div style={{
                  display: 'flex',
                  height: '42px',
                  padding: '10px 12px',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  color: '#6B7280',
                  fontSize: '14px'
                }}>
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Company Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Email
                </label>
                <div style={{
                  display: 'flex',
                  height: '42px',
                  padding: '10px 12px',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  color: '#6B7280',
                  fontSize: '14px'
                }}>
                  {formData.companyEmail || 'Not provided'}
                </div>
              </div>

              {/* Company Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>
                  Company Password
                </label>
                <div style={{
                  display: 'flex',
                  height: '42px',
                  padding: '10px 12px',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  color: '#6B7280',
                  fontSize: '14px'
                }}>
                  {formData.password || 'Not provided'}
                </div>
              </div>

              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminProtectedRoute>
  );
}

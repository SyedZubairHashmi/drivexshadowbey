// API utility functions for frontend use

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
  };
  
  // Only set Content-Type for JSON requests
  if (!(options.body instanceof FormData)) {
    config.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  } else {
    // For FormData, don't set Content-Type (browser will set it automatically)
    config.headers = {
      ...options.headers,
    };
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Check if the response has a success field and it's false
    if (data.success === false) {
      const errorMessage = data.error || 'API request failed';
      const errorDetails = data.details ? `\nDetails: ${JSON.stringify(data.details, null, 2)}` : '';
      throw new Error(`${errorMessage}${errorDetails}`);
    }

    // Also check for HTTP errors
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Car API functions
export const carAPI = {
  // Get all cars with optional filters
  getAll: async (filters?: {
    batchNo?: string;
    status?: 'sold' | 'transit' | 'warehouse' | 'showroom';
    company?: string;
    auctionGrade?: number;
    isFeatured?: boolean;
    limit?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/cars${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get a specific car by ID
  getById: async (id: string) => {
    return apiRequest(`/cars/${id}`);
  },

  // Create a new car
  create: async (carData: any, files?: {
    coverPhoto?: File;
    invoiceReceipt?: File;
    auctionSheet?: File;
    carPictures?: File[];
  }) => {
    if (files) {
      // Handle file uploads with FormData
      const formData = new FormData();
      
      // Add JSON data
      formData.append('carData', JSON.stringify(carData));
      
      // Add files
      if (files.coverPhoto) {
        formData.append('coverPhoto', files.coverPhoto);
      }
      if (files.invoiceReceipt) {
        formData.append('invoiceReceipt', files.invoiceReceipt);
      }
      if (files.auctionSheet) {
        formData.append('auctionSheet', files.auctionSheet);
      }
      if (files.carPictures) {
        files.carPictures.forEach(file => {
          formData.append('carPictures', file);
        });
      }
      
      return apiRequest('/cars', {
        method: 'POST',
        body: formData,
      });
    } else {
      // Fallback to JSON for backward compatibility
      return apiRequest('/cars', {
        method: 'POST',
        body: JSON.stringify(carData),
      });
    }
  },

  // Update a car
  update: async (id: string, carData: any) => {
    return apiRequest(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },

  // Delete a car
  delete: async (id: string) => {
    return apiRequest(`/cars/${id}`, {
      method: 'DELETE',
    });
  },
};

// Batch API functions
export const batchAPI = {
  // Get all batches with optional filters
  getAll: async (filters?: {
    batchNo?: string;
    countryOfOrigin?: string;
    limit?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/batches${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get a specific batch by ID
  getById: async (id: string) => {
    return apiRequest(`/batches/${id}`);
  },

  // Get a specific batch by batch number
  getByBatchNo: async (batchNo: string) => {
    return apiRequest(`/batches?batchNo=${batchNo}&limit=1`);
  },

  // Create a new batch
  create: async (batchData: any) => {
    return apiRequest('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  },

  // Update a batch
  update: async (id: string, batchData: any) => {
    return apiRequest(`/batches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(batchData),
    });
  },

  // Delete a batch
  delete: async (id: string) => {
    return apiRequest(`/batches/${id}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions for data formatting
export const formatCarData = (car: any) => {
  return {
    id: car._id,
    carName: car.carName,
    company: car.company,
    engineNumber: car.engineNumber,
    chasisNumber: car.chasisNumber,
    auctionGrade: car.auctionGrade,
    importYear: car.importYear,
    assembly: car.assembly,
    engineCapacity: car.engineCapacity,
    interiorColor: car.interiorColor,
    mileage: car.mileage,
    keywords: car.keywords || [],
    status: car.status,
    color: car.color,
    deliveryTimeframe: car.deliveryTimeframe,
    batchNo: car.batchNo, // Simple string like "01", "02", "03"
    description: car.description,
    financing: car.financing,
    saleInfo: car.saleInfo,
    images: car.images,
    notes: car.notes,
    isFeatured: car.isFeatured,
    totalCost: car.totalCost,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
  };
};

export const formatBatchData = (batch: any) => {
  return {
    id: batch._id,
    batchNo: batch.batchNo,
    countryOfOrigin: batch.countryOfOrigin,
    flagImage: batch.flagImage,
    investors: batch.investors || [],
    cars: batch.cars || [],
    notes: batch.notes,
    createdAt: batch.createdAt,
    updatedAt: batch.updatedAt,
  };
};

// Investor API functions
export const investorAPI = {
  // Get all investors with optional filters
  getAll: async (filters?: {
    batchNo?: string;
    email?: string;
    search?: string;
    name?: string; // Add name-specific search parameter
    limit?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/investors${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get a specific investor by ID
  getById: async (id: string) => {
    return apiRequest(`/investors/${id}`);
  },

  // Create a new investor
  create: async (investorData: any) => {
    return apiRequest('/investors', {
      method: 'POST',
      body: JSON.stringify(investorData),
    });
  },

  // Update an investor
  update: async (id: string, investorData: any) => {
    return apiRequest(`/investors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(investorData),
    });
  },

  // Delete an investor
  delete: async (id: string) => {
    return apiRequest(`/investors/${id}`, {
      method: 'DELETE',
    });
  },

  // Get next investor number
  getNextInvestorNumber: async () => {
    return apiRequest('/investors?nextNumber=true');
  },
};

// Customer API functions
export const customerAPI = {
  // Get all customers with optional filters
  getAll: async (filters?: {
    search?: string;
    paymentStatus?: string;
    limit?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/customers${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get a specific customer by ID
  getById: async (id: string) => {
    return apiRequest(`/customers/${id}`);
  },

  // Create a new customer
  create: async (customerData: any) => {
    return apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  // Update a customer
  update: async (id: string, customerData: any) => {
    return apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  // Delete a customer
  delete: async (id: string) => {
    return apiRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
  },

  // Format customer data for display
  formatCustomerData: (customer: any) => {
    return {
      id: customer._id,
      vehicle: customer.vehicle,
      customer: customer.customer,
      sale: customer.sale,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  },
};

// Company API functions (replacing userAPI)
export const companyAPI = {
  // Get all companies with optional filters
  getAll: async (filters?: {
    search?: string;
    status?: 'active' | 'inactive';
    limit?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/companies${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get a specific company by ID
  getById: async (id: string) => {
    return apiRequest(`/companies/${id}`);
  },

  // Create a new company
  create: async (companyData: any) => {
    return apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  // Update a company
  update: async (id: string, companyData: any) => {
    return apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  // Delete a company
  delete: async (id: string) => {
    return apiRequest(`/companies/${id}`, {
      method: 'DELETE',
    });
  },

  // Update company status
  updateStatus: async (id: string, status: 'active' | 'inactive') => {
    return apiRequest(`/companies/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Format company data for display
  formatCompanyData: (company: any) => {
    return {
      id: company._id,
      ownerName: company.ownerName,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      status: company.status,
      recoveryEmail: company.recoveryEmail,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  },
};

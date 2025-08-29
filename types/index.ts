export interface Car {
  id: number
  name: string
  company: string
  engineNumber: string
  mileage: string
  grade: number
  importYear: number
  batch: string
  status: "Sold" | "In Transit" | "Warehouse" | "Available"
  price?: number
  soldPrice?: number
  soldDate?: string
  buyerInfo?: string
}

export interface Batch {
  id: number
  name: string
  totalCars: number
  soldCars: number
  revenue: number
  createdDate: string
  status: "Active" | "Completed" | "Pending"
}

export interface Investor {
  id: number
  name: string
  email: string
  phone: string
  totalInvestment: number
  returns: number
  joinDate: string
  status: "Active" | "Inactive"
}

export interface Customer {
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

export interface Payment {
  id: number
  carId: number
  carName: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "Pending" | "Completed" | "Overdue"
  buyerName: string
}

export interface DashboardStats {
  totalCarsSold: number
  totalRevenue: number
  totalProfit: number
  carsInStock: number
  carsInTransit: number
  pendingPayments: number
}

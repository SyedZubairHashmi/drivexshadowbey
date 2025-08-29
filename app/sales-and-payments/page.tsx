"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  FileText, 
  Receipt, 
  TrendingUp, 
  Clock,
  ArrowRight,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Customer interface based on MongoDB schema
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
    paymentStatus: 'Completed' | 'Pending' | 'inprogress';
    paymentMethod: {
      type: 'Cash' | 'Bank' | 'Cheque' | 'BankDeposit';
      details: any;
    };
    note?: string;
    document?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  pendingPayments: number;
  averageRevenue: number;
  completedPayments: number;
  inProgressPayments: number;
  totalOutstanding: number;
  pendingCustomers: number;
  completedCustomers: number;
}

export default function SalesAndPaymentPage() {
  const router = useRouter();
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    averageRevenue: 0,
    completedPayments: 0,
    inProgressPayments: 0,
    totalOutstanding: 0,
    pendingCustomers: 0,
    completedCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch customers from API
  const fetchCustomers = async (limit: number = 50, page: number = 1): Promise<Customer[]> => {
    try {
      const response = await fetch(`/api/customers?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  };

  // Function to calculate customer statistics
  const calculateCustomerStats = (customers: Customer[]): CustomerStats => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.sale.salePrice, 0);
    const pendingPayments = customers.reduce((sum, customer) => {
      return sum + (customer.sale.remainingAmount || 0);
    }, 0);

    // Count by payment status
    const completedPayments = customers.filter(c => c.sale.paymentStatus === 'Completed').length;
    const inProgressPayments = customers.filter(c => c.sale.paymentStatus === 'inprogress').length;
    const activeCustomers = customers.filter(c => c.sale.paymentStatus !== 'Completed').length;
    const pendingCustomers = customers.filter(c => c.sale.paymentStatus === 'Pending').length;
    const completedCustomers = customers.filter(c => c.sale.paymentStatus === 'Completed').length;

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      pendingPayments,
      averageRevenue: totalCustomers > 0 ? totalRevenue / totalCustomers : 0,
      completedPayments,
      inProgressPayments,
      totalOutstanding: pendingPayments,
      pendingCustomers,
      completedCustomers
    };
  };

  // Function to get recent customers
  const getRecentCustomers = async (): Promise<Customer[]> => {
    try {
      const customers = await fetchCustomers(5, 1);
      return customers.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting recent customers:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const customers = await fetchCustomers(1000); // Get all customers for stats
        const statsData = calculateCustomerStats(customers);
        const recentCustomersData = await getRecentCustomers();
        
        setStats(statsData);
        setRecentCustomers(recentCustomersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading sales data...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleNavigateToCustomers = () => {
    router.push('/sales-and-payments/customers');
  };

  const handleNavigateToRemainingBalance = () => {
    router.push('/sales & payement/remaining-balance');
  };

  const handleNavigateToInvoice = () => {
    router.push('/sales & payement/invoice');
  };

  const handleNavigateToReceipts = () => {
    router.push('/sales & payement/receipts');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales & Payments</h1>
            <p className="text-gray-600 mt-2">Manage customers, invoices, and payment tracking</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.totalCustomers - 10} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs {stats.totalOutstanding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingCustomers} pending payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.completedCustomers / stats.totalCustomers) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNavigateToCustomers}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-blue-600" />
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Customers</CardTitle>
              <CardDescription>Manage customer information and transactions</CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNavigateToRemainingBalance}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Clock className="h-8 w-8 text-yellow-600" />
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Remaining Balance</CardTitle>
              <CardDescription>Track outstanding payments and balances</CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNavigateToInvoice}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-green-600" />
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Invoices</CardTitle>
              <CardDescription>Generate and manage customer invoices</CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNavigateToReceipts}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Receipt className="h-8 w-8 text-purple-600" />
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Receipts</CardTitle>
              <CardDescription>View and manage payment receipts</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Customers
              </CardTitle>
              <CardDescription>Latest customer registrations and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {customer.customer.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.vehicle.companyName} {customer.vehicle.model}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Rs {customer.sale.salePrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{formatDate(customer.sale.saleDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleNavigateToCustomers}
              >
                View All Customers
              </Button>
            </CardContent>
          </Card>

          {/* Payment Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Payment Status
              </CardTitle>
              <CardDescription>Overview of payment completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{stats.completedCustomers}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((stats.completedCustomers / stats.totalCustomers) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <UserX className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-600">{stats.pendingCustomers}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((stats.pendingCustomers / stats.totalCustomers) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Outstanding</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">Rs {stats.totalOutstanding.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total pending amount</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Revenue</span>
                  <span className="font-bold">Rs {stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Average per Customer</span>
                  <span className="font-bold">
                    Rs {Math.round(stats.totalRevenue / stats.totalCustomers).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">This Month</span>
              </div>
              <p className="text-2xl font-bold mt-2">Rs {(stats.totalRevenue * 0.15).toLocaleString()}</p>
              <p className="text-xs text-gray-500">15% of total revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Active Customers</span>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.pendingCustomers}</p>
              <p className="text-xs text-gray-500">With pending payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">New This Week</span>
              </div>
              <p className="text-2xl font-bold mt-2">3</p>
              <p className="text-xs text-gray-500">Customer registrations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

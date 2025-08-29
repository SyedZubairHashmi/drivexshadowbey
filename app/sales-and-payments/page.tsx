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
import { customersData, getCustomerStats, type Customer } from "@/data/customers";

export default function SalesAndPaymentPage() {
  const router = useRouter();
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState(getCustomerStats());

  useEffect(() => {
    // Get the 5 most recent customers (based on join date)
    const sortedCustomers = [...customersData]
      .sort((a, b) => new Date(b.joinDate || '').getTime() - new Date(a.joinDate || '').getTime())
      .slice(0, 5);
    
    setRecentCustomers(sortedCustomers);
  }, []);

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
                  <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.carsPurchased}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Rs {customer.totalSpend.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{formatDate(customer.joinDate || '')}</p>
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

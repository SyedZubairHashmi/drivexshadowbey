"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import { CustomerActionMenu } from "./customer-action-menu"
import { Search, Filter } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { useState, useMemo } from "react"

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

interface CustomerTableProps {
  customers: Customer[]
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
  onView?: (customer: Customer) => void
  onChangeStatus?: (customer: Customer) => void
}

export function CustomerTable({ customers, onEdit, onDelete, onView, onChangeStatus }: CustomerTableProps) {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter customers based on search and filter criteria
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = searchTerm === '' || 
        customer.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.vehicle.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.vehicle.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompany = companyFilter === '' || companyFilter === 'all' || customer.vehicle.companyName === companyFilter;
      const matchesGrade = gradeFilter === '' || gradeFilter === 'all' || customer.vehicle.model.includes(gradeFilter);
      const matchesStatus = statusFilter === '' || statusFilter === 'all' || customer.sale.paymentStatus === statusFilter;
      
      return matchesSearch && matchesCompany && matchesGrade && matchesStatus;
    });
  }, [customers, searchTerm, companyFilter, gradeFilter, statusFilter]);

  return (
    <div className="space-y-3">
      {/* Search and Filter Section */}
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
              className="flex-1 bg-transparent border-none outline-none text-sm"
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
                color: "#00000099"
              }}
            >
              <SelectValue placeholder="Company" />
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
                color: "#00000099"
              }}
            >
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>

          <Select>
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
                color: "#00000099"
              }}
            >
              <SelectValue placeholder="Import Year" />
            </SelectTrigger>
            <SelectContent>
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
                color: "#00000099"
              }}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow style={{ height: '45px' }}>
              <TableHead className="w-16" style={{ height: '45px', padding: '8px 16px' }}>S.No</TableHead>
              <TableHead style={{ height: '45px', padding: '8px 16px' }}>Name</TableHead>
              <TableHead style={{ height: '45px', padding: '8px 16px' }}>Number</TableHead>
              <TableHead style={{ height: '45px', padding: '8px 16px' }}>Car Purchased</TableHead>
              <TableHead style={{ height: '45px', padding: '8px 16px' }}>Last Date Purchased</TableHead>
              <TableHead style={{ height: '45px', padding: '8px 16px' }}>Total Spend</TableHead>
              <TableHead style={{ height: '45px', padding: '8px 16px' }}>Remaining Balance</TableHead>
              <TableHead style={{ height: '45px', padding: '8px 16px' }}>Status</TableHead>
              <TableHead className="w-20" style={{ height: '45px', padding: '8px 16px' }}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer._id} style={{ height: '40px' }}>
                <TableCell className="font-medium" style={{ height: '40px', padding: '8px 16px' }}>
                  {String(index + 1).padStart(2, '0')}
                </TableCell>
                <TableCell className="font-medium" style={{ height: '40px', padding: '8px 16px' }}>
                  {customer.customer.name || 'N/A'}
                </TableCell>
                <TableCell style={{ height: '40px', padding: '8px 16px' }}>
                  {customer.customer.phoneNumber || 'N/A'}
                </TableCell>
                <TableCell style={{ height: '40px', padding: '8px 16px' }}>
                  {customer.vehicle.companyName && customer.vehicle.model 
                    ? `${customer.vehicle.companyName} ${customer.vehicle.model}`
                    : 'N/A'
                  }
                </TableCell>
                <TableCell style={{ height: '40px', padding: '8px 16px' }}>
                  {customer.sale.saleDate ? new Date(customer.sale.saleDate).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="font-semibold" style={{ height: '40px', padding: '8px 16px' }}>
                   Rs {(customer.sale.salePrice || 0).toLocaleString()}
                </TableCell>
                <TableCell className="font-semibold" style={{ height: '40px', padding: '8px 16px' }}>
                  Rs {(customer.sale.remainingAmount || 0).toLocaleString()}
                </TableCell>
                <TableCell style={{ height: '40px', padding: '8px 16px' }}>
                  <StatusBadge status={customer.sale.paymentStatus || 'Pending'} />
                </TableCell>
                <TableCell style={{ height: '40px', padding: '8px 16px' }}>
                  <CustomerActionMenu
                    customer={customer}
                    onEdit={() => onEdit?.(customer)}
                    onDelete={() => onDelete?.(customer)}
                    onView={() => onView?.(customer)}
                    onChangeStatus={async (newStatus) => {
                      console.log("Status changed to:", newStatus, "for customer:", customer._id);
                      const success = await onChangeStatus?.(customer);
                      return success || false;
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface CompanyTableProps {
  companies: Company[];
  startIndex: number;
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onStatusChange: (company: Company, newStatus: 'active' | 'inactive') => void;
}

export function CompanyTable({ 
  companies, 
  startIndex, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: CompanyTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (companyId: string) => {
    setOpenDropdown(openDropdown === companyId ? null : companyId);
  };

  const handleStatusChange = (company: Company, newStatus: 'active' | 'inactive') => {
    // Call the parent component's status change handler
    onStatusChange(company, newStatus);
    setOpenDropdown(null);
  };

  const handleDelete = (company: Company) => {
    onDelete(company);
    setOpenDropdown(null);
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <div className="[&_.relative]:overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow style={{ height: '45px' }}>
              <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>S.No</TableHead>
              <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Owner Name</TableHead>
              <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Company Name</TableHead>
              <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Company Email</TableHead>
              <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Status</TableHead>
              <TableHead style={{ padding: '8px 16px', color: '#00000099', textAlign: 'left' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow key={company._id} style={{ height: '40px' }}>
                <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                  {startIndex + index + 1}
                </TableCell>
                <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                  {company.ownerName || 'N/A'}
                </TableCell>
                <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                  {company.companyName || 'N/A'}
                </TableCell>
                <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                  {company.companyEmail || 'N/A'}
                </TableCell>
                <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: company.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                      color: company.status === 'active' ? '#065F46' : '#991B1B',
                    }}
                  >
                    {company.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell style={{ padding: '8px 16px', textAlign: 'left' }}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(company)}
                      style={{
                        display: 'flex',
                        padding: '4px 10px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        borderRadius: '1000px',
                        background: 'rgba(0, 0, 0, 0.12)',
                        color: '#000000',
                        fontSize: '12px',
                        height: '28px',
                        border: 'none'
                      }}
                    >
                        View
                    </Button>
                    
                    <DropdownMenu open={openDropdown === company._id} onOpenChange={() => handleDropdownToggle(company._id)}>
                      <DropdownMenuTrigger asChild>
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
                            border: 'none',
                            backgroundColor: 'transparent'
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(company, 'active')}
                          className={`cursor-pointer ${company.status === 'active' ? 'bg-green-50 text-green-700 font-medium' : 'hover:bg-green-50'}`}
                        >
                          {company.status === 'active' ? '✓ Active' : 'Active'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(company, 'inactive')}
                          className={`cursor-pointer ${company.status === 'inactive' ? 'bg-red-50 text-red-700 font-medium' : 'hover:bg-red-50'}`}
                        >
                          {company.status === 'inactive' ? '✓ Inactive' : 'Inactive'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

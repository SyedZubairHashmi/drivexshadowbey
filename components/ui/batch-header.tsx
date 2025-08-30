"use client";

import { Search, Filter, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BatchHeaderProps {
  title: string;
  onAddNew?: () => void;
  showFilters?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  batchNumber?: string;
  isLatestBatch?: boolean;
  deliveryTimeframe?: string;
  // Filter props
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  companyFilter?: string;
  onCompanyFilterChange?: (value: string) => void;
  gradeFilter?: string;
  onGradeFilterChange?: (value: string) => void;
  importYearFilter?: string;
  onImportYearFilterChange?: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
}

export function BatchHeader({
  title,
  onAddNew,
  showFilters = true,
  isExpanded = true,
  onToggle,
  batchNumber,
  isLatestBatch,
  deliveryTimeframe,
  // Filter props
  searchTerm = '',
  onSearchChange,
  companyFilter = '',
  onCompanyFilterChange,
  gradeFilter = '',
  onGradeFilterChange,
  importYearFilter = '',
  onImportYearFilterChange,
  statusFilter = '',
  onStatusFilterChange,
}: BatchHeaderProps) {
  const router = useRouter();

  const handleSeeDetail = () => {
    if (batchNumber) {
      router.push(`/cars/inventory/${batchNumber}`);
    }
  };

  return (
    <div className="space-y-3">
      <div 
        className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
          !isExpanded ? "border border-gray-300 rounded-xl p-3 gap-6" : ""
        }`}
        style={{
          width: !isExpanded ? "100%" : "auto",
          height: !isExpanded ? "54px" : "auto",
          borderRadius: !isExpanded ? "12px" : "0px",
          borderWidth: !isExpanded ? "1px" : "0px",
          padding: !isExpanded ? "12px" : "0px",
          gap: !isExpanded ? "24px" : "0px",
          border: !isExpanded ? "1px solid #0000001F" : "none",
        }}
      >
                <div className="flex gap-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

          {deliveryTimeframe && (
            <div
              style={{
                width: '85px',
                height: '25px',
                borderRadius: '1000px',
                opacity: 1,
                gap: '10px',
                paddingTop: '4px',
                paddingRight: '10px',
                paddingBottom: '4px',
                paddingLeft: '10px',
                background: '#FA1A1B1F',
                color: '#FA1A1B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {deliveryTimeframe} 
            </div>
          )}

            {isLatestBatch && (
            <div
              style={{
                width: '102px',
                height: '25px',
                borderRadius: '1000px',
                opacity: 1,
                gap: '10px',
                paddingTop: '4px',
                paddingRight: '10px',
                paddingBottom: '4px',
                paddingLeft: '10px',
                background: '#00674F1F',
                color: '#00674F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Latest Batch
            </div>
          )}

          <Button
            onClick={handleSeeDetail}
            style={{
              width: '83px',
              height: '33px',
              border: '1px solid #D1D5DB',
              borderRadius: '12px',
              gap: '8px',
              opacity: 1,
              paddingTop: '8px',
              paddingRight: '10px',
              paddingBottom: '8px',
              paddingLeft: '10px',
              color: '#00000099',
              textDecoration: 'none',
              backgroundColor: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}
            className="hover:bg-gray-100"
          >
            See Detail
          </Button>
        </div>

        <Button
          className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
          variant="ghost"
          onClick={onToggle}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "100%",
            // border: "1px solid #d1d5db",
            opacity: 0.4
          }}
        >
          {isExpanded ? (
            <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
          ) : (
            <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
          )}
          
        </Button>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showFilters && isExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div 
              className="flex items-center"
              style={{
                width: "300px",
                height: "41px",
                borderRadius: "12px",
                border: "1px solid rgba(0, 0, 0, 0.24)",
                backgroundColor: "white",
                padding: "0 12px",
                gap: "10px"
              }}
            >
              <Search className="text-gray-400 h-4 w-4 flex-shrink-0" />
              <input 
                placeholder="Search cars..." 
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{
                  color: "#00000099",
                  fontWeight: "500"
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
                border: "1px solid rgba(0, 0, 0, 0.24)",
                color: "#00000099",
                fontWeight: "500"
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex gap-2">
            <Select value={companyFilter} onValueChange={onCompanyFilterChange}>
              <SelectTrigger 
                style={{
                  display: "flex",
                  padding: "12px",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  background: "#FFF",
                  width: "128px",
                  height: "41px",
                  color: "#00000099",
                  
                }}
              >
                <SelectValue placeholder="Company" style={{ color: "#00000099", fontWeight: "500" }} />
              </SelectTrigger>

              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Nissan" >Nissan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
              <SelectTrigger 
                style={{
                  display: "flex",
                  padding: "12px",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  background: "#FFF",
                  width: "96px",
                  height: "41px",
                  color: "#00000099",
                  fontWeight: "500"
                }}
              >
                <SelectValue placeholder="Grade" style={{ color: "#00000099", fontWeight: "500" }} />
              </SelectTrigger>
              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="all" >All Grades</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="4" >4</SelectItem>
                <SelectItem value="3" >3</SelectItem>
              </SelectContent>
            </Select>

            <Select value={importYearFilter} onValueChange={onImportYearFilterChange}>
              <SelectTrigger 
                style={{
                  display: "flex",
                  padding: "12px",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  background: "#FFF",
                  width: "128px",
                  height: "41px",
                  color: "#00000099",
                  fontWeight: "500"
                }}
              >
                <SelectValue placeholder="Import Year" style={{ color: "#00000099", fontWeight: "500" }} />
              </SelectTrigger>
              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="all" >All Years</SelectItem>
                <SelectItem value="2024" >2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022" >2022</SelectItem>
                <SelectItem value="2021" >2021</SelectItem>
                <SelectItem value="2020" >2020</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger 
                style={{
                  display: "flex",
                  padding: "12px",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  background: "#FFF",
                  width: "112px",
                  height: "41px",
                  color: "#00000099",
                  fontWeight: "500"
                }}
              >
                <SelectValue placeholder="Status" style={{ color: "#00000099", fontWeight: "500" }} />
              </SelectTrigger>
              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(0, 0, 0, 0.24)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="all" >All Status</SelectItem>
                <SelectItem value="sold" >Sold</SelectItem>
                <SelectItem value="transit" >In Transit</SelectItem>
                <SelectItem value="warehouse" >Warehouse</SelectItem>
                <SelectItem value="showroom" >Showroom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

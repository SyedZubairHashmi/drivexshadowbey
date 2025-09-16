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

// Flag SVG Components
const FlagJP = () => (
  <svg viewBox="0 0 3 2" className="h-4 w-6" aria-label="Japan flag" role="img">
    <path fill="#fff" d="M0 0h3v2H0z" />
    <circle cx="1.5" cy="1" r="0.5" fill="#bc002d" />
  </svg>
);

const FlagUS = () => (
  <svg viewBox="0 0 7410 3900" className="h-4 w-6" aria-label="United States flag" role="img">
    <path fill="#b22234" d="M0 0h7410v3900H0z" />
    <path stroke="#fff" strokeWidth="300" d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410" />
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="h-4 w-6" aria-label="United Kingdom flag" role="img">
    <clipPath id="s"><path d="M0 0v30h60V0z"/></clipPath>
    <clipPath id="t"><path d="M30 15h30v15zM0 0h30V0zM0 15H0v15zM30 0h30v15z"/></clipPath>
    <g clipPath="url(#s)">
      <path fill="#012169" d="M0 0h60v30H0z"/>
      <path stroke="#fff" strokeWidth="6" d="M0 0l60 30m0-30L0 30"/>
      <path stroke="#C8102E" strokeWidth="4" clipPath="url(#t)" d="M0 0l60 30m0-30L0 30"/>
      <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60"/>
      <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60"/>
    </g>
  </svg>
);

const FlagAU = () => (
  <svg viewBox="0 0 60 30" className="h-4 w-6" aria-label="Australia flag" role="img">
    <path fill="#00247d" d="M0 0h60v30H0z"/>
    <g transform="scale(0.5)">
      <clipPath id="a"><path d="M0 0h30v15H0z"/></clipPath>
      <g clipPath="url(#a)">
        <path fill="#012169" d="M0 0h30v15H0z"/>
        <path stroke="#fff" strokeWidth="3" d="M0 0l30 15m0-15L0 15"/>
        <path stroke="#C8102E" strokeWidth="2" d="M0 0l30 15m0-15L0 15"/>
        <path stroke="#fff" strokeWidth="5" d="M15 0v15M0 7.5h30"/>
        <path stroke="#C8102E" strokeWidth="3" d="M15 0v15M0 7.5h30"/>
      </g>
    </g>
    <g fill="#fff">
      <circle cx="40" cy="5" r="1.2"/>
      <circle cx="50" cy="10" r="1.2"/>
      <circle cx="45" cy="15" r="1.2"/>
      <circle cx="52" cy="18" r="1.2"/>
      <circle cx="38" cy="20" r="1.2"/>
      <circle cx="12" cy="20" r="2" />
    </g>
  </svg>
);

const FlagKR = () => (
  <svg viewBox="0 0 3 2" className="h-4 w-6" aria-label="South Korea flag" role="img">
    <path fill="#fff" d="M0 0h3v2H0z"/>
    <g transform="translate(1.5 1)">
      <circle r="0.5" fill="#cd2e3a"/>
      <path d="M0-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" fill="#0047a0"/>
    </g>
    <g stroke="#000" strokeWidth="0.06">
      <g transform="translate(.5 .45)"><path d="M-.3-.2h.6M-.3 0h.6M-.3.2h.6"/></g>
      <g transform="translate(2.5 1.55)"><path d="M-.3-.2h.6M-.3 0h.6M-.3.2h.6"/></g>
      <g transform="translate(.5 1.55)"><path d="M-.3-.2h.6M-.3.2h.6"/></g>
      <g transform="translate(2.5 .45)"><path d="M-.3-.2h.6M-.3.2h.6"/></g>
    </g>
  </svg>
);

const FLAG_COMPONENTS: { [key: string]: React.ComponentType } = {
  JP: FlagJP,
  US: FlagUS,
  GB: FlagGB,
  AU: FlagAU,
  KR: FlagKR,
};

interface BatchHeaderProps {
  title: string;
  onAddNew?: () => void;
  showFilters?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  batchNumber?: string;
  isLatestBatch?: boolean;
  batchData?: {
    _id: string;
    batchNo: string;
    countryOfOrigin: string;
    flagImage: string;
  };
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
  batchData,
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

  // Get flag component and country name
  const FlagComponent = batchData?.flagImage ? FLAG_COMPONENTS[batchData.flagImage] || FlagJP : null;
  const countryName = batchData?.countryOfOrigin || "Unknown";

  return (
    <div className="space-y-2">
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
        <div className="flex items-center gap-2">
          {FlagComponent && (
            <div 
              style={{
                width: "35px",
                height: "20px",
                borderRadius: "4px",
                opacity: 1,
              }}
            >
              <FlagComponent />
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

          {/* Transit Status Badge - Show if title contains "Transit" */}
          {title.includes('Transit') && (
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
              Transit
            </div>
          )}

          {isLatestBatch && (
            <div
              style={{
                // width: '102px',
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
                border: "1px solid #0000001F",
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
                  border: "1px solid #0000001F",
                  background: "#FFF",
                  width: "128px",
                  height: "41px",
                  color: "#00000099",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <SelectValue placeholder="Company" style={{ color: "#00000099", fontWeight: "500", whiteSpace: "nowrap" }} />
              </SelectTrigger>

              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #0000001F",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="all">All Companies</SelectItem>
                {/* Japanese Brands */}
                <SelectItem value="TOYOTA">TOYOTA</SelectItem>
                <SelectItem value="HONDA">HONDA</SelectItem>
                <SelectItem value="SUZUKI">SUZUKI</SelectItem>
                <SelectItem value="DAIHATSU">DAIHATSU</SelectItem>
                <SelectItem value="NISSAN">NISSAN</SelectItem>
                <SelectItem value="MAZDA">MAZDA</SelectItem>
                <SelectItem value="ISUZU">ISUZU</SelectItem>
                <SelectItem value="MITSUBISHI">MITSUBISHI</SelectItem>
                
                {/* German Luxury Brands */}
                <SelectItem value="MERCEDES-BENZ">MERCEDES-BENZ</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="AUDI">AUDI</SelectItem>
                
                {/* Japanese Luxury Brands */}
                <SelectItem value="LEXUS">LEXUS</SelectItem>
                <SelectItem value="ACURA">ACURA</SelectItem>
                
                {/* Korean Brands */}
                <SelectItem value="KIA">KIA</SelectItem>
                <SelectItem value="HYUNDAI">HYUNDAI</SelectItem>
                
                {/* Chinese Brands */}
                <SelectItem value="GWM">GWM</SelectItem>
                <SelectItem value="BYD">BYD</SelectItem>
                <SelectItem value="CHANGAN">CHANGAN</SelectItem>
                <SelectItem value="CHERY">CHERY</SelectItem>
                <SelectItem value="FAW">FAW</SelectItem>
                
                {/* American Brands */}
                <SelectItem value="TESLA">TESLA</SelectItem>
                <SelectItem value="FORD">FORD</SelectItem>
                <SelectItem value="CADILLAC">CADILLAC</SelectItem>
                <SelectItem value="CHRYSLER">CHRYSLER</SelectItem>
                <SelectItem value="CHEVROLET">CHEVROLET</SelectItem>
                <SelectItem value="GMC">GMC</SelectItem>
                <SelectItem value="JEEP">JEEP</SelectItem>
                
                {/* British Brands */}
                <SelectItem value="LAND ROVER">LAND ROVER</SelectItem>
                <SelectItem value="MG">MG</SelectItem>
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
                  border: "1px solid #0000001F",
                  background: "#FFF",
                  width: "96px",
                  height: "41px",
                  color: "#00000099",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <SelectValue placeholder="Grade" style={{ color: "#00000099", fontWeight: "500", whiteSpace: "nowrap" }} />
              </SelectTrigger>
              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #0000001F",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  opacity: 1
                }}
              >
                <SelectItem value="all" >All Grades</SelectItem>
                <SelectItem value="5.5">5.5</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="4.5">4.5</SelectItem>
                <SelectItem value="4" >4</SelectItem>
                <SelectItem value="3.5">3.5</SelectItem>
                <SelectItem value="3" >3</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="1">1</SelectItem>
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
                  border: "1px solid #0000001F",
                  background: "#FFF",
                  width: "128px",
                  height: "41px",
                  color: "#00000099",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <SelectValue placeholder="Import Year" style={{ color: "#00000099", fontWeight: "500", whiteSpace: "nowrap" }} />
              </SelectTrigger>
              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #0000001F",
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
                  border: "1px solid #0000001F",
                  background: "#FFF",
                  width: "112px",
                  height: "41px",
                  color: "#00000099",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <SelectValue placeholder="Status" style={{ color: "#00000099", fontWeight: "500", whiteSpace: "nowrap" }} />
              </SelectTrigger>
              <SelectContent 
                style={{
                  backgroundColor: "white",
                  border: "1px solid #0000001F",
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

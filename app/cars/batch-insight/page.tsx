"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { batchAPI, carAPI } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
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

interface Batch {
  _id: string;
  batchNo: string;
  countryOfOrigin: string;
  flagImage: string;
  status: string;
  totalCars: number;
  soldCars: number;
  revenue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface BatchInsightHeaderProps {
  batch: Batch;
  isExpanded: boolean;
  onToggle: () => void;
}

function BatchInsightHeader({ batch, isExpanded, onToggle }: BatchInsightHeaderProps) {
  const FlagComponent = FLAG_COMPONENTS[batch.flagImage] || FlagJP;
  const countryName = batch.countryOfOrigin || "Unknown";
  
  return (
    <div className="space-y-2">
      <div 
        className={`flex items-center justify-between ${
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
          <h2 className="text-xl font-semibold text-gray-900">
            Batch {batch.batchNo}
          </h2>
          <div 
            style={{
              width: "121px",
              height: "25px",
              borderRadius: "1000px",
              opacity: 1,
              gap: "10px",
              paddingTop: "4px",
              paddingRight: "10px",
              paddingBottom: "4px",
              paddingLeft: "10px",
              backgroundColor: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#374151",
            }}
          >
            {countryName}
          </div>
        </div>

        <Button
          className="flex items-center justify-center text-gray-500 bg-white"
          variant="ghost"
          onClick={onToggle}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "100%",
            opacity: 0.4
          }}
        >
          {isExpanded ? (
            <i className="fa-solid fa-circle-minus" style={{ fontSize: "20px" }}></i>
          ) : (
            <i className="fa-solid fa-circle-plus" style={{ fontSize: "20px" }}></i>
          )}
        </Button>
      </div>

      {isExpanded && (
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
                placeholder="Search cars..." 
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
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
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

            <Select>
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
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

interface HorizontalCarTableProps {
  cars: any[];
  batchNumber: string;
}

function HorizontalCarTable({ cars, batchNumber }: HorizontalCarTableProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cars found in this batch
      </div>
    );
  }

  const tableHeaders = [
    "S.No",
    "Company",
    "Car Name",
    "Manufacturing Year",
    "Exterior Color",
    "Mileage",
    "Chassis",
    "Auction Price",
    "Origin City",
    "Destination City",
    "Inland Transport",
    "Loading Charges",
    "Container",
    "Freight Sea",
    "Variant Duty",
    "Landing Charges",
    "Vehicle Value CIF",
    "Customs Duty",
    "Federal Excise Duty",
    "Sales Tax",
    "Freight & Storage Charges",
    "Age of Vehicle",
    "Passport Charges",
    "Demurage Charges",
    "Services Charges",
    "Transport Charges",
    "Repair Charges",
    "Miscellaneous Charges"
  ];

  // Calculate dynamic table width and column widths
  const baseTableWidth = 1213; // Width for 7 cars
  const minColumnWidth = 120; // Minimum column width
  const maxCarsForFullWidth = 7;
  
  const tableWidth = cars.length <= maxCarsForFullWidth 
    ? baseTableWidth 
    : Math.max(baseTableWidth, cars.length * minColumnWidth + 200); // 200px for S.No column
  
  const columnWidth = cars.length <= maxCarsForFullWidth 
    ? Math.floor((baseTableWidth - 200) / cars.length) // 200px for S.No column
    : minColumnWidth;
  
  // For 7 or fewer cars, use percentage-based widths for better responsiveness
  const columnStyle = cars.length <= 7 
    ? { width: `${100 / cars.length}%`, minWidth: `${100 / cars.length}%` }
    : { width: `${columnWidth}px`, minWidth: `${columnWidth}px` };

  return (
    <div 
      className={cars.length > 7 ? "overflow-x-auto" : ""}
      style={{
        width: cars.length <= 7 ? "100%" : `${tableWidth}px`,
        minHeight: "611px",
        borderRadius: "12px",
        borderWidth: "1px",
        borderColor: "#E5E7EB",
        gap: "12px",
        opacity: 1,
      }}
    >
      <table className="w-full border-collapse" style={{
        width: cars.length <= 7 ? "100%" : `${tableWidth}px`,
        minWidth: cars.length <= 7 ? "auto" : `${tableWidth}px`,
      }}>
        <thead>
          <tr 
            style={{
            //   width: "1113px",
              height: "43px",
              justifyContent: "space-between",
              paddingTop: "12px",
              paddingRight: "24px",
              paddingBottom: "12px",
              paddingLeft: "24px",
              backgroundColor: "#F5F7F9",
            }}
          >
            <th 
              style={{
                backgroundColor: "#F5F7F9",
                color: "#00000099",
                textAlign: "left",
                fontWeight: "500",
                fontSize: "14px",
                paddingLeft: "10px",
                width: "200px",
                minWidth: "200px",
              }}
            >
              S.No
            </th>
            {cars.map((car, index) => (
              <th 
                key={car._id || index} 
                style={{
                  backgroundColor: "#F5F7F9",
                  color: "#00000099",
                  textAlign: "left",
                  fontWeight: "500",
                  fontSize: "14px",
                  ...columnStyle,
                }}
              >
                Car {(index + 1).toString().padStart(2, '0')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableHeaders.slice(1).map((header, headerIndex) => (
            <tr 
              key={header}
              style={{
                width: "1213px",
                height: "43px",
                justifyContent: "space-between",
                paddingTop: "12px",
                paddingRight: "24px",
                paddingBottom: "12px",
                paddingLeft: "24px",
              }}
            >
              <td 
                style={{
                  backgroundColor: "#F5F7F9",
                  color: "#00000099",
                  textAlign: "left",
                  fontWeight: "500",
                  fontSize: "14px",
                  paddingLeft: "10px",
                  width: "200px",
                  minWidth: "200px",
                }}
              >
                {header}
              </td>
              {cars.map((car, carIndex) => (
                <td 
                  key={`${car._id || carIndex}-${header}`} 
                  style={{
                    color: "#000000",
                    textAlign: "left",
                    fontSize: "14px",
                    paddingLeft: "10px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    lineHeight: "1.2",
                    whiteSpace: "pre-line",
                    verticalAlign: "top",
                    ...columnStyle,
                  }}
                >
                  {(() => {
                    switch (header) {
                      case "Company":
                        return car.company || "N/A";
                      case "Car Name":
                        return car.carName || "N/A";
                      case "Manufacturing Year":
                        return car.manufacturingYear || "N/A";
                      case "Exterior Color":
                        return car.exteriorColor || "N/A";
                      case "Mileage":
                        return car.mileage ? `${car.mileage} Km` : "N/A";
                      case "Chassis":
                        return car.chasisNumber || "N/A";
                      case "Auction Price":
                        const auction = car.financing?.auctionPrice;
                        return auction?.amount && auction?.rate && auction?.totalAmount && typeof auction.totalAmount === 'number'
                          ? `${auction.amount} x ${auction.rate} =\n${auction.totalAmount.toLocaleString()} PKR`
                          : "N/A";
                      case "Origin City":
                        return car.financing?.originCity || "N/A";
                      case "Destination City":
                        return car.financing?.destinationCity || "N/A";
                      case "Inland Transport":
                        const inland = car.financing?.inlandCharges;
                        return inland?.amount && inland?.rate && inland?.totalAmount && typeof inland.totalAmount === 'number'
                          ? `${inland.amount} x ${inland.rate} =\n${inland.totalAmount.toLocaleString()} PKR`
                          : "N/A";
                      case "Loading Charges":
                        const loading = car.financing?.loadingCharges;
                        return loading?.amount && loading?.rate && loading?.totalAmount && typeof loading.totalAmount === 'number'
                          ? `${loading.amount} x ${loading.rate} =\n${loading.totalAmount.toLocaleString()} PKR`
                          : "N/A";
                      case "Container":
                        const container = car.financing?.containerCharges;
                        return container?.amount && container?.rate && container?.totalAmount && typeof container.totalAmount === 'number'
                          ? `${container.amount} x ${container.rate} =\n${container.totalAmount.toLocaleString()} PKR`
                          : "N/A";
                      case "Freight Sea":
                        const freight = car.financing?.freightSea;
                        return freight?.amount && freight?.rate && freight?.totalAmount && typeof freight.totalAmount === 'number'
                          ? `${freight.amount} x ${freight.rate} =\n${freight.totalAmount.toLocaleString()} PKR`
                          : "N/A";
                      case "Variant Duty":
                        return car.financing?.variantDuty ? `${car.financing.variantDuty.toLocaleString()} PKR` : "N/A";
                      case "Landing Charges":
                        return car.financing?.landingCharges ? `${car.financing.landingCharges.toLocaleString()} PKR` : "N/A";
                      case "Vehicle Value CIF":
                        return car.financing?.vehicleValueCif ? `${car.financing.vehicleValueCif.toLocaleString()} PKR` : "N/A";
                      case "Customs Duty":
                        return car.financing?.customsDuty ? `${car.financing.customsDuty.toLocaleString()} PKR` : "N/A";
                      case "Federal Excise Duty":
                        return car.financing?.federalExciseDuty ? `${car.financing.federalExciseDuty.toLocaleString()} PKR` : "N/A";
                      case "Sales Tax":
                        return car.financing?.salesTax ? `${car.financing.salesTax.toLocaleString()} PKR` : "N/A";
                      case "Freight & Storage Charges":
                        return car.financing?.freightAndStorageCharges ? `${car.financing.freightAndStorageCharges.toLocaleString()} PKR` : "N/A";
                      case "Age of Vehicle":
                        return car.financing?.ageOfVehicle ? `${car.financing.ageOfVehicle} years` : "N/A";
                      case "Passport Charges":
                        return car.financing?.passportCharges ? `${car.financing.passportCharges.toLocaleString()} PKR` : "N/A";
                      case "Demurage Charges":
                        return car.financing?.demurage ? `${car.financing.demurage.toLocaleString()} PKR` : "N/A";
                      case "Services Charges":
                        return car.financing?.servicesCharges ? `${car.financing.servicesCharges.toLocaleString()} PKR` : "N/A";
                      case "Transport Charges":
                        return car.financing?.transportCharges ? `${car.financing.transportCharges.toLocaleString()} PKR` : "N/A";
                      case "Repair Charges":
                        return car.financing?.repairCharges ? `${car.financing.repairCharges.toLocaleString()} PKR` : "N/A";
                      case "Miscellaneous Charges":
                        return car.financing?.miscellaneousCharges ? `${car.financing.miscellaneousCharges.toLocaleString()} PKR` : "N/A";
                      default:
                        return "N/A";
                    }
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BatchInsightPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBatches, setExpandedBatches] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const batchesPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [batchesResponse, carsResponse] = await Promise.all([
        batchAPI.getAll(),
        carAPI.getAll()
      ]);

      if (batchesResponse.success && carsResponse.success) {
        // Sort batches by batch number (latest first)
        const sortedBatches = batchesResponse.data.sort((a: Batch, b: Batch) => {
          const numA = parseInt(a.batchNo.replace(/\D/g, ''));
          const numB = parseInt(b.batchNo.replace(/\D/g, ''));
          return numB - numA;
        });
        
        setBatches(sortedBatches);
        setCars(carsResponse.data);
        
        // Set all batches as expanded by default
        const expandedState: { [key: string]: boolean } = {};
        sortedBatches.forEach(batch => {
          expandedState[batch.batchNo] = true;
        });
        setExpandedBatches(expandedState);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getCarsForBatch = (batchNumber: string) => {
    return cars.filter(car => car.batchNo === batchNumber);
  };

  const toggleBatch = (batchNumber: string) => {
    setExpandedBatches(prev => ({
      ...prev,
      [batchNumber]: !prev[batchNumber]
    }));
  };

  // Calculate pagination
  const totalPages = Math.ceil(batches.length / batchesPerPage);
  const startIndex = (currentPage - 1) * batchesPerPage;
  const endIndex = startIndex + batchesPerPage;
  const currentBatches = batches.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading batch insights...</p>
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
              onClick={fetchData}
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
      <div className="flex min-h-screen w-full">
        <div className="flex-1 flex flex-col space-y-6 pt-6 w-full">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 
              className="text-gray-900 font-semibold"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: '22px',
                lineHeight: '30px',
                letterSpacing: '0%'
              }}
            >
              Batch Insights
            </h1>
            <Button 
              
              className="flex items-center gap-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              style={{
                width: '148px',
                height: '50px',
                borderRadius: '50px',
                paddingTop: '10px',
                paddingRight: '18px',
                paddingBottom: '10px',
                paddingLeft: '18px',
                gap: '10px',
                borderWidth: '1px',
                opacity: 1
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Car
            </Button>
          </div>

          {/* Batch Sections */}
          {currentBatches.length > 0 ? (
            currentBatches.map((batch) => {
              const batchCars = getCarsForBatch(batch.batchNo);
              const isExpanded = expandedBatches[batch.batchNo] || false;
              
              return (
                <div key={batch._id} className="space-y-2">
                  <BatchInsightHeader
                    batch={batch}
                    isExpanded={isExpanded}
                    onToggle={() => toggleBatch(batch.batchNo)}
                  />
                  
                  {isExpanded && (
                    <div className="mt-3">
                      <HorizontalCarTable
                        cars={batchCars}
                        batchNumber={batch.batchNo}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Batches Found</h3>
              <p className="text-gray-600">No batch data available.</p>
            </div>
          )}

          {/* Pagination */}
          {batches.length > batchesPerPage && (
            <div className="flex flex-col items-center justify-center mt-6">
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
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

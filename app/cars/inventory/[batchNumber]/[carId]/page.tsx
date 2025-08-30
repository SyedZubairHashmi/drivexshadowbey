"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown, ChevronUp, Download, Gauge, Zap, Settings, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { carAPI } from "@/lib/api";
import type { ICar as Car } from "@/lib/models/types";

interface CarDetailPageProps {
  params: {
    batchNumber: string;
    carId: string;
  };
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const router = useRouter();
  const { batchNumber, carId } = params;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carInfoExpanded, setCarInfoExpanded] = useState(true);
  const [financeInfoExpanded, setFinanceInfoExpanded] = useState(true);
      const [descriptionExpanded, setDescriptionExpanded] = useState(true);
    const [picturesExpanded, setPicturesExpanded] = useState(true);
    const [invoiceReceiptExpanded, setInvoiceReceiptExpanded] = useState(true);
    const [auctionSheetExpanded, setAuctionSheetExpanded] = useState(true);

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await carAPI.getById(carId);
      
      if (response.success) {
        setCar(response.data);
      } else {
        setError(response.error || "Failed to fetch car details");
      }
    } catch (error: any) {
      console.error("Error fetching car details:", error);
      setError(error.message || "An error occurred while fetching car details");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/cars/inventory/${batchNumber}`);
  };

  const handleEdit = () => {
    const carData = encodeURIComponent(JSON.stringify(car));
    router.push(`/cars/inventory/${batchNumber}/add-car?edit=true&carData=${carData}`);
  };

      const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading car details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !car) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error || "Car not found"}</p>
            <button 
              onClick={fetchCarDetails}
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
      <div className="flex min-h-screen mt-5 mr-4"> 
        <div className="flex-1 flex flex-col space-y-5">
          {/* Header with Breadcrumb and Edit Button */}
          <div 
            className="flex flex-col items-start gap-6"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '24px',
              alignSelf: 'stretch'
            }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">All Inventory</span>
                <ChevronLeft className="h-4 w-4 text-gray-400 rotate-180" />
                <span className="font-medium">Batch {batchNumber}</span>
                <ChevronLeft className="h-4 w-4 text-gray-400 rotate-180" />
                <span className="font-medium">Car Detail</span>
              </div>
              <Button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-white text-black hover:bg-gray-100"
                style={{
                  display: 'flex',
                  height: '50px',
                  width:'100px',
                  padding: '10px 10px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: '50px',
                  border: '1px solid #0000003D',
                }}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>

          {/* Car Name and Price Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 
                className="text-5xl font-semibold"
                style={{
                  color: '#000',
                  fontSize: '44px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal'  
                }}
              >
                {car.carName}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{car.engineType}</p>
            </div>
            <div>
             <p>price</p>
              <p 
                className="text-4xl font-bold"
                style={{
                  color: '#00674F',
                  fontSize: '34px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '30px'
                }}
              >
                {car.saleInfo?.soldPrice ? formatPrice(car.saleInfo.soldPrice) : formatPrice(car.financing.auctionPrice.totalAmount)}
              </p>
            </div>
          </div>

          {/* Car Icons and Details */}
          <div className="flex justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Gauge className="h-6 w-6 text-[#00674F]" />
                <span className="text-gray-700">{car.mileage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-[#00674F]" />
                <span className="text-gray-700">{car.engineCapacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-[#00674F]" />
                <span className="text-gray-700">{car.engineType}</span>
              </div>
            </div>
            
            {/* Batch and Transit Tags */}
            <div className="flex items-center gap-4">
              {/* Batch Tag */}
              <div style={{
                width: '73px',
                height: '25px',
                borderRadius: '1000px',
                padding: '4px 10px',
                gap: '10px',
                opacity: 1,
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Batch {car.batchNo}
                </span>
              </div>
              
              {/* Transit Tag */}
              <div style={{
                width: '148px',
                height: '25px',
                borderRadius: '1000px',
                padding: '4px 10px',
                gap: '10px',
                opacity: 1,
                backgroundColor: '#FA1A1B1F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  color: '#FA1A1B',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {car.status === 'transit' ? `In Transit - ${car.deliveryTimeframe || '24 Weeks'}` : 
                   car.status === 'warehouse' ? 'In Warehouse' :
                   car.status === 'showroom' ? 'In Showroom' :
                   car.status === 'sold' ? 'Sold' : 'Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Car Information Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Car Information</h2>
              <Button
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                variant="ghost"
                onClick={() => setCarInfoExpanded(!carInfoExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {carInfoExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                )}
              </Button>
            </div>

            {carInfoExpanded && (
              <div style={{
                width: '100%',
                height: '0px',
                marginTop: '24px',
                marginBottom: '24px',
                border: '1px solid #0000003D',
                opacity: 1
              }}></div>
            )}

            {carInfoExpanded && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Left Column */}
                <div style={{width: '410px'}}>
                                    <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Engine</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.engineNumber}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Manufacturer Year</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.manufacturingYear}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Chassis</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.chasisNumber}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Mileage</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.mileage}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Interior Color</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.interiorColor}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Engine Capacity</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.engineCapacity}</span>
                </div>
                </div>

                                {/* Right Column */}
                <div style={{ width: '410px' }}>
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Engine Type</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.engineType}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Auction Grade</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.auctionGrade}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Imported Year</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.importYear}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Color</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.color}</span>
                </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Assembly</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.assembly}</span>
                </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Features</h2>
            </div>

            {car.features && car.features.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {car.features.map((feature: string, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: '#00674F',
                      color: 'white',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#666', fontSize: '14px' }}>No features available</div>
            )}
          </div>

          {/* Financial Information Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Financial Information</h2>
              <Button
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                variant="ghost"
                onClick={() => setFinanceInfoExpanded(!financeInfoExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {financeInfoExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                )}
              </Button>
            </div>

            {financeInfoExpanded && (
              <div style={{
                width: '100%',
                height: '0px',
                marginTop: '24px',
                marginBottom: '24px',
                border: '1px solid #0000003D',
                opacity: 1
              }}></div>
            )}

            {financeInfoExpanded && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Left Column */}
                <div style={{ width: '410px' }}>
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Auction Price</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.auctionPrice?.totalAmount || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Auction Expenses</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.auctionExpenses?.totalAmount || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Inland Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.inlandCharges?.totalAmount || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Loading Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.loadingCharges?.totalAmount || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Container Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.containerCharges?.totalAmount || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Freight Sea</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.freightSea?.totalAmount || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Variant Duty</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.variantDuty || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Passport Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.passportCharges || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Services Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.servicesCharges || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Transport Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.transportCharges || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Repair Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.repairCharges || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Miscellaneous</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.miscellaneousCharges || 0)}</span>
                  </div>
                </div>

                                {/* Right Column */}
                <div style={{ width: '410px' }}>
                                    <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Vehicle Value CIF</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.vehicleValueCif || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Landing Charges</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.landingCharges || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Customs Duty</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.customsDuty || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Sales Tax</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.salesTax || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Federal Excise Duty</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.federalExciseDuty || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Income Tax</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.incomeTax || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Freight & Storage</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.freightAndStorageCharges || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Demurage</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{formatPrice(car.financing?.demurage || 0)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Age of Vehicle</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.financing?.ageOfVehicle || 0} years</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Origin City</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.financing?.originCity || 'N/A'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '20px', gap: '35%' }}>
                    <span style={{ width: '200px', fontWeight: '600', fontSize: '18px' }}>Destination City</span>
                    <span style={{ fontWeight: '400', fontSize: '18px' }}>{car.financing?.destinationCity || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Batch and Delivery Info Row */}
            {financeInfoExpanded && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '20px',
                padding: '16px 0'
              }}>
                {/* Left side - Batch Number */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>B</span>
                  </div>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    backgroundColor: '#000000',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px'
                  }}>
                    Batch {car.batchNo}
                  </span>
                </div>

                {/* Right side - Delivery Timeframe */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FF6B6B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>T</span>
                  </div>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#FF6B6B',
                    backgroundColor: '#FFE5E5',
                    padding: '8px 16px',
                    borderRadius: '20px'
                  }}>
                    {car.status === 'transit' ? `In Transit - ${car.deliveryTimeframe || '24 Weeks'}` : 
                     car.status === 'warehouse' ? 'In Warehouse' :
                     car.status === 'showroom' ? 'In Showroom' :
                     car.status === 'sold' ? 'Sold' : 'Available'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            {descriptionExpanded && (
              <div style={{
                width: '100%',
                height: '0px',
                marginTop: '24px',
                marginBottom: '24px',
                border: '1px solid #0000003D',
                opacity: 1
              }}></div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Description</h2>
              <Button
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                variant="ghost"
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {descriptionExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                )}
              </Button>
            </div>

            {descriptionExpanded && (
              <div>
                <p className="text-gray-700 leading-relaxed">{car.description}</p>
              </div>
            )}

            {descriptionExpanded && (
              <div style={{
                width: '100%',
                height: '0px',
                marginTop: '24px',
                marginBottom: '24px',
                border: '1px solid #0000003D',
                opacity: 1
              }}></div>
            )}
          </div>

          {/* Invoice & Receipt Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Invoice & Receipt</h2>
              <Button
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                variant="ghost"
                onClick={() => setInvoiceReceiptExpanded(!invoiceReceiptExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {invoiceReceiptExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                )}
              </Button>
            </div>

            {invoiceReceiptExpanded && (
              <div 
                style={{
                  width: '388px',
                  height: '84px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  opacity: 1,
                  borderRadius: '12px',
                  border: '1px solid #0000001F',
                  padding: '16px 12px',
                  backgroundColor: 'white'
                }}
              >
                {/* Document SVG */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    gap: '8px',
                    opacity: 1,
                    borderRadius: '19.2px',
                    padding: '6.4px',
                    backgroundColor: '#F0F0FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* File Name and Size Details */}
                <div
                  style={{
                    width: '264px',
                    height: '52px',
                    gap: '8px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#333333' }}>
                    {car.images?.invoiceReceipt ? 'Invoice Receipt.pdf' : 'No invoice available'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666666' }}>
                    {car.images?.invoiceReceipt ? '525KB • 100% uploaded' : 'File not uploaded'}
                  </div>
                </div>

                {/* Download SVG */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    gap: '8px',
                    opacity: car.images?.invoiceReceipt ? 1 : 0.5,
                    borderRadius: '19.2px',
                    padding: '6.4px',
                    backgroundColor: car.images?.invoiceReceipt ? '#00AC0B1F' : '#CCCCCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: car.images?.invoiceReceipt ? 'pointer' : 'not-allowed'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke={car.images?.invoiceReceipt ? "#29A403" : "#999999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke={car.images?.invoiceReceipt ? "#29A403" : "#999999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke={car.images?.invoiceReceipt ? "#29A403" : "#999999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Auction Sheet Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Auction Sheet</h2>
              <Button
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                variant="ghost"
                onClick={() => setAuctionSheetExpanded(!auctionSheetExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {auctionSheetExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                )}
              </Button>
            </div>

            {auctionSheetExpanded && (
              <div 
                style={{
                  width: '388px',
                  height: '84px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  opacity: 1,
                  borderRadius: '12px',
                  border: '1px solid #0000001F',
                  padding: '16px 12px',
                  backgroundColor: 'white'
                }}
              >
                {/* Document SVG */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    gap: '8px',
                    opacity: 1,
                    borderRadius: '19.2px',
                    padding: '6.4px',
                    backgroundColor: '#F0F0FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* File Name and Size Details */}
                <div
                  style={{
                    width: '264px',
                    height: '52px',
                    gap: '8px',
                    opacity: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#333333' }}>
                    {car.images?.auctionSheet ? 'Auction Sheet.pdf' : 'No auction sheet available'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666666' }}>
                    {car.images?.auctionSheet ? '234KB • 100% uploaded' : 'File not uploaded'}
                  </div>
                </div>

                {/* Download SVG */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    gap: '8px',
                    opacity: car.images?.auctionSheet ? 1 : 0.5,
                    borderRadius: '19.2px',
                    padding: '6.4px',
                    backgroundColor: car.images?.auctionSheet ? '#00AC0B1F' : '#CCCCCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: car.images?.auctionSheet ? 'pointer' : 'not-allowed'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke={car.images?.auctionSheet ? "#29A403" : "#999999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke={car.images?.auctionSheet ? "#29A403" : "#999999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke={car.images?.auctionSheet ? "#29A403" : "#999999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

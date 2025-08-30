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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
                  padding: '10px 24px',
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <p className="text-lg">{car.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <p className="text-lg">{car.carName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number</label>
                  <p className="text-lg">{car.chassisNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engine Number</label>
                  <p className="text-lg">{car.engineNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Segment</label>
                  <p className="text-lg">{car.carSegment}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auction Grade</label>
                  <p className="text-lg">{car.auctionGrade}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Import Year</label>
                  <p className="text-lg">{car.importYear}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturing Year</label>
                  <p className="text-lg">{car.manufacturingYear}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type</label>
                  <p className="text-lg">{car.engineType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assembly</label>
                  <p className="text-lg">{car.assembly}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engine Capacity</label>
                  <p className="text-lg">{car.engineCapacity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                  <p className="text-lg">{car.mileage}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interior Color</label>
                  <p className="text-lg">{car.interiorColor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exterior Color</label>
                  <p className="text-lg">{car.color}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <p className="text-lg capitalize">{car.status}</p>
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auction Price</label>
                  <p className="text-lg">{formatPrice(car.financing.auctionPrice.totalAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inland Charges</label>
                  <p className="text-lg">{formatPrice(car.financing.inlandCharges.totalAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Container Charges</label>
                  <p className="text-lg">{formatPrice(car.financing.containerCharges.totalAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auction Expenses</label>
                  <p className="text-lg">{formatPrice(car.financing.auctionExpenses.totalAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loading Charges</label>
                  <p className="text-lg">{formatPrice(car.financing.loadingCharges.totalAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Freight Sea</label>
                  <p className="text-lg">{formatPrice(car.financing.freightSea.totalAmount)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-6">
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
          </div>

          {/* Documents Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Documents</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Invoice Receipt */}
              {car.images.invoiceReceipt && (
                <div 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  style={{
                    display: 'flex',
                    padding: '16px 12px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Invoice</span>
                  </div>
                  {car.images.invoiceReceipt && (
                    <img 
                      src={car.images.invoiceReceipt} 
                      alt="Invoice" 
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
              )}

              {/* Auction Sheet */}
              {car.images.auctionSheet && (
                <div 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  style={{
                    display: 'flex',
                    padding: '16px 12px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Receipt</span>
                  </div>
                  {car.images.auctionSheet && (
                    <img 
                      src={car.images.auctionSheet} 
                      alt="Receipt" 
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Car Pictures Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Car Pictures</h2>
              <Button
                className="flex items-center justify-center text-gray-500 bg-white transition-all duration-200 ease-in-out hover:scale-110"
                variant="ghost"
                onClick={() => setPicturesExpanded(!picturesExpanded)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "100%",
                  opacity: 0.4
                }}
              >
                {picturesExpanded ? (
                  <i className="fa-solid fa-circle-minus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                ) : (
                  <i className="fa-solid fa-circle-plus transition-transform duration-200 ease-in-out" style={{ fontSize: "20px" }}></i>
                )}
              </Button>
            </div>

            {picturesExpanded && (
              <div className="space-y-4">
                {/* Main Car Picture */}
                {car.images.coverPhoto && (
                  <div className="relative">
                    <img 
                      src={car.images.coverPhoto} 
                      alt="Car Cover" 
                      className="w-full rounded-2xl border"
                      style={{
                        width: '520px',
                        height: '282.553px',
                        borderRadius: '15.319px',
                        border: '0.851px solid rgba(0, 0, 0, 0.18)',
                        background: 'lightgray 50% / cover no-repeat'
                      }}
                    />
                  </div>
                )}

                {/* Additional Car Pictures */}
                {car.images.carPictures && car.images.carPictures.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto">
                    {car.images.carPictures.map((picture, index) => (
                      <img 
                        key={index}
                        src={picture} 
                        alt={`Car ${index + 1}`} 
                        className="flex-shrink-0 rounded-lg border"
                        style={{
                          width: '95.319px',
                          height: '57.872px',
                          flexShrink: 0
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

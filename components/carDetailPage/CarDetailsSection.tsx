// components/carDetail/CarDetailsSection.tsx
"use client";

import { useState } from "react";
import { FaUser, FaGasPump, FaTachometerAlt, FaPlus, FaMinus } from "react-icons/fa";
import Seater from "../icons/seater";
import CcLayer from "../icons/cc-layer1";
import { CheckIcon } from "lucide-react";

interface CarDetailsSectionProps {
  car: any;
}

const CarDetailsSection = ({ car }: CarDetailsSectionProps) => {
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);

  return (
    <div className="flex flex-col justify-start min-h-[798px] w-full lg:max-w-[649px] px-4 sm:px-6 lg:px-0">
      {/* Title and Price */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{car.title}</h1>
          <p className="text-gray-700 mt-1">{car.sub_title}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-black font-medium text-sm">Price</span>
          <span className="text-green-800 font-semibold text-xl">{car.amount_price}</span>
          <span className="text-gray-400 line-through">{car.sub_price}</span>
        </div>
      </div>

      {/* Icons */}
      <div className="flex flex-col sm:flex-row justify-between mt-6 text-gray-600 gap-4 items-start sm:items-center">
        <div className="flex flex-wrap gap-3 sm:gap-6">
          <span className="flex items-center gap-2"><Seater/> {car.num} Seats</span>
          <span className="flex items-center gap-2"><CcLayer/> {car.num2}</span>
          <span className="flex items-center gap-2"><CheckIcon/> {car.num3}</span>
        </div>
        <button className="bg-green-600 text-white px-3 py-1 rounded-full font-medium shadow-sm hover:bg-blue-700 transition">
          Warehouse
        </button>
      </div>

      {/* Overview Accordion */}
      <div className="mt-8 border-b pb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOverviewOpen(!isOverviewOpen)}>
          <h2 className="font-semibold text-lg">Overview</h2>
          {isOverviewOpen ? <FaMinus /> : <FaPlus />}
        </div>
        {isOverviewOpen && (
          <div className="text-gray-700 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><span className="font-medium">Engine: </span>{car.engine}</p>
            <p><span className="font-medium">Auction Grade: </span>{car.auction_grade}</p>
            <p><span className="font-medium">Assembly: </span>{car.assembly}</p>
            <p><span className="font-medium">Imported Year: </span>{car.imported_year}</p>
            <p><span className="font-medium">Mileage: </span>{car.mileage}</p>
            <p><span className="font-medium">Color: </span>{car.color}</p>
            <p><span className="font-medium">Interior Color: </span>{car.interior_color}</p>
          </div>
        )}
        {isOverviewOpen && Array.isArray(car.features) && car.features.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-md mb-2">Features:</h3>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature: string, index: number) => (
                <span key={index} className="bg-green-700 text-white text-sm px-3 py-1 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description Accordion */}
      <div className="mt-6 border-b pb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}>
          <h2 className="font-semibold text-lg">Description</h2>
          {isDescriptionOpen ? <FaMinus /> : <FaPlus />}
        </div>
        {isDescriptionOpen && (
          <div className="text-gray-700 mt-3">
            <p>This is a dummy description. Car is in excellent condition with no major accidents. Imported recently with verified auction sheet. Spacious interior and fuel-efficient engine.</p>
          </div>
        )}
      </div>

      {/* Auction Accordion */}
      <div className="mt-6 border-b pb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsAuctionOpen(!isAuctionOpen)}>
          <h2 className="font-semibold text-lg">Auction Sheet</h2>
          {isAuctionOpen ? <FaMinus /> : <FaPlus />}
        </div>
        {isAuctionOpen && (
          <div className="text-gray-700 mt-3">
            <p><span className="font-medium">Auction Grade: </span>4.5</p>
            <p><span className="font-medium">Verified: </span>Yes</p>
            <p><span className="font-medium">Condition Notes: </span>Minor scratches on left door, otherwise clean.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetailsSection;

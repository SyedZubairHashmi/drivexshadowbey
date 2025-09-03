// components/accessories/AccessoryDetailsSection.tsx
"use client";

import { useState } from "react";
import { FaUser, FaGasPump, FaTachometerAlt, FaPlus, FaMinus } from "react-icons/fa";
import CheckIcon from "@/components/shared/icons/checkIcons";
import CcLayer from "@/components/shared/icons/cc-layer1";
import Seater from "@/components/shared/icons/seater";

interface AccessoryDetailsSectionProps {
  accessory: any;
}

const AccessoryDetailsSection = ({ accessory }: AccessoryDetailsSectionProps) => {
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  return (
    <div className="flex flex-col justify-start min-h-[798px] w-full lg:max-w-[649px] px-4 sm:px-6 lg:px-0">
      {/* Title and Price */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{accessory.title}</h1>
          <p className="text-gray-700 mt-1">{accessory.sub_title}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-black font-medium text-sm">Price</span>
          <span className="text-green-800 font-semibold text-xl">{accessory.amount_price}</span>
          <span className="text-gray-400 line-through">{accessory.sub_price}</span>
        </div>
      </div>

      {/* Icons */}
      <div className="flex flex-col sm:flex-row justify-between mt-6 text-gray-600 gap-4 items-start sm:items-center">
        <div className="flex flex-wrap gap-3 sm:gap-6">
          <span className="flex items-center gap-2"><Seater/> {accessory.num}</span>
          <span className="flex items-center gap-2"><CcLayer/> {accessory.num2}</span>
          <span className="flex items-center gap-2"><CheckIcon/> {accessory.num3}</span>
        </div>
        <button className="bg-green-600 text-white px-3 py-1 rounded-full font-medium shadow-sm hover:bg-blue-700 transition">
          In Stock
        </button>
      </div>

      {/* Overview Accordion */}
      <div className="mt-8 border-b pb-4">
        <button 
          className="w-full flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2 rounded" 
          onClick={(e) => {
            e.preventDefault();
            setIsOverviewOpen(!isOverviewOpen);
          }}
          aria-expanded={isOverviewOpen}
          aria-controls="overview-content"
        >
          <h2 className="font-semibold text-lg">Overview</h2>
          {isOverviewOpen ? <FaMinus /> : <FaPlus />}
        </button>
        {isOverviewOpen && (
          <div className="text-gray-700 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><span className="font-medium">Material: </span>{accessory.material}</p>
            <p><span className="font-medium">Durability: </span>{accessory.durability}</p>
            <p><span className="font-medium">Compatibility: </span>{accessory.compatibility}</p>
            <p><span className="font-medium">Assembly: </span>{accessory.assembly}</p>
            <p><span className="font-medium">Color: </span>{accessory.color}</p>
            <p><span className="font-medium">Rating: </span>{accessory.rating}/5</p>
          </div>
        )}
        {isOverviewOpen && Array.isArray(accessory.features) && accessory.features.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-md mb-2">Features:</h3>
            <div className="flex flex-wrap gap-2">
              {accessory.features.map((feature: string, index: number) => (
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
            <p>This premium {accessory.title.toLowerCase()} offers excellent quality and durability. Perfect for enhancing your vehicle's functionality and appearance with professional-grade materials and easy installation.</p>
            <div className="mt-4">
              <h3 className="font-semibold text-md mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Premium quality materials</li>
                <li>Easy DIY installation</li>
                <li>Universal compatibility</li>
                <li>Long-lasting durability</li>
                <li>Professional finish</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Specifications Accordion */}
      <div className="mt-6 border-b pb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsSpecsOpen(!isSpecsOpen)}>
          <h2 className="font-semibold text-lg">Specifications</h2>
          {isSpecsOpen ? <FaMinus /> : <FaPlus />}
        </div>
        {isSpecsOpen && (
          <div className="text-gray-700 mt-3">
            <p><span className="font-medium">Product Type: </span>{accessory.title}</p>
            <p><span className="font-medium">Brand: </span>Premium Quality</p>
            <p><span className="font-medium">Warranty: </span>1 Year</p>
            <p><span className="font-medium">Installation: </span>{accessory.assembly}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoryDetailsSection;

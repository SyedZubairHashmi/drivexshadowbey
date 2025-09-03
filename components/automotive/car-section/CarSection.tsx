"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { carSectionData, CarSectionItem } from "@/components/automotive/car-section/data";

interface CarSectionProps {
  limit?: number;
}

const CarSection = ({ limit }: CarSectionProps) => {
  const displayData = limit ? carSectionData.slice(0, limit) : carSectionData;

  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col">
            <h2 className="text-black font-normal text-[44px] mb-1 text-left font-raleway">
              Car Collection
            </h2>
            <div className="text-gray-600 text-[20px] font-normal font-raleway">
              These are the luxury collection we have
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <Link href="/features/automotive/collection" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border border-gray-700 rounded-full text-black font-normal px-4 py-2 text-[20px] text-center font-raleway">
                View More
              </button>
            </Link>
          </div>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayData.map((car: CarSectionItem) => (
            <Link key={car.id} href={`/features/automotive/car/${car.id}`} className="border border-gray-300 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-shadow duration-300 text-left font-raleway cursor-pointer group block">
              {/* Image with Zoom on Hover */}
              <div className="rounded-[20px] border border-gray-300 overflow-hidden">
                <Image
                  src={car.images[0]}
                  alt={car.title}
                  width={280}
                  height={200}
                  className="w-full h-[200px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-[24px] font-bold mt-2">{car.title}</h2>
              <p className="text-[20px] text-gray-500">{car.sub_title}</p>

              {/* Features */}
              <div className="flex text-[20px] text-gray-600 font-medium flex-wrap gap-2 mt-2">
                <span className="flex items-center gap-1">
                  {car.num} Seats
                </span>
                <span className="flex items-center gap-1">
                  {car.num2}
                </span>
                <span className="flex items-center gap-1">
                  {car.num3}
                </span>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col">
                  <span className="text-black font-medium text-[14px]">{car.price}</span>
                  <span className="text-green-800 font-semibold text-[20px]">
                    {car.amount_price}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-500 font-medium text-[14px] line-through">
                    {car.sub_price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarSection;

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import accessoriesData from "@/app/features/automotive/accessories/data";
import CarIcons1 from "@/components/shared/icons/carIcons";
import RatingIcons from "@/components/shared/icons/ratingIcons";

interface AccessoriesSectionProps {
  limit?: number;
}

const AccessoriesSection = ({ limit = 4 }: AccessoriesSectionProps) => {
  const displayData = accessoriesData.slice(0, limit);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] pt-[30px] pb-8 font-raleway">
      <div className="pt-6 pb-6 bg-white">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col">
            <button className="text-black font-normal text-[44px] mb-1 text-left font-raleway">
              Other Products
            </button>
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

        {/* Accessories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayData.map((accessory, index) => (
            <Link key={accessory.id} href={`/features/automotive/accessories/${accessory.id}`} passHref>
              <div className="border border-gray-300 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-shadow duration-300 text-left font-raleway cursor-pointer group">
                {/* Image with Zoom on Hover */}
                <div className="rounded-[20px] border border-gray-300 overflow-hidden">
                  <Image
                    src={accessory.images[0]}
                    alt={accessory.title}
                    width={280}
                    height={200}
                    className="w-full h-[200px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-[24px] font-bold mt-2">{accessory.title}</h2>
                <p className="text-[20px] text-gray-500">{accessory.sub_title}</p>

                {/* Features */}
                <div className="flex text-[20px] text-gray-600 font-medium flex-wrap gap-2 mt-2">
                  <span className="flex items-center gap-1">
                    <CarIcons1 />
                    {accessory.feature1}
                  </span>
                  <span className="flex items-center gap-1">
                    <RatingIcons />
                    {accessory.rating}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 flex flex-col">
                  <div className="text-gray-500 font-medium text-[14px]">
                    Price
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-[24px] text-green-700">
                      {accessory.amount_price}
                    </span>
                    <span className="text-gray-500 font-medium text-[14px] line-through">
                      {accessory.sub_price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessoriesSection;

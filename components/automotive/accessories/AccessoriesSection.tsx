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
        {/* Top Bar: Heading + Button */}
<div className="flex flex-row justify-between items-center mb-6 sm:mb-10">
          {/* Heading */}
          <h2 className="text-black text-2xl sm:text-4xl font-normal mb-0">
            Other Products
          </h2>

          {/* View More Button right side */}
          <Link href="/features/automotive/collection">
            <button className="border border-gray-700 rounded-full text-black font-medium px-3 py-1 text-[13px] sm:text-lg hover:bg-gray-100 transition whitespace-nowrap">
              View More
            </button>
          </Link>
        </div>

        {/* Subtitle hidden on mobile */}
        <p className="text-gray-600 text-base sm:text-lg font-normal hidden sm:block mb-4">
          These are the luxury collection we have
        </p>

        {/* Accessories Grid / Horizontal Scroll for Mobile */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible">
          {displayData.map((accessory) => (
            <Link
              key={accessory.id}
              href={`/features/automotive/accessories/${accessory.id}`}
              passHref
              className="cursor-pointer flex-shrink-0 w-[264px] sm:w-[250px] lg:w-auto"
            >
<div className="group border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 text-left font-raleway w-full h-auto">
                {/* Image */}
                <div className="rounded-[20px] border border-gray-300 overflow-hidden">
                  <Image
                    src={accessory.images[0]}
                    alt={accessory.title}
                    width={280}
                    height={160}
                    className="w-full h-[160px] sm:h-[200px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h2 className="text-base sm:text-2xl font-bold mt-2 sm:mt-3">
                    {accessory.title}
                  </h2>
                  <p className="text-[11px] sm:text-xl text-gray-500 font-normal">
                    {accessory.sub_title}
                  </p>
                </div>

                {/* Features */}
                <div className="flex justify-between items-center mt-2 font-medium text-gray-600 gap-2">
                  <span className="flex items-center gap-1">
                    <CarIcons1/>
                    <span className="text-[11px] sm:text-base">
                      {accessory.feature1}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <RatingIcons className="w-3 h-3 sm:w-5 sm:h-5" />
                    <span className="text-[11px] sm:text-base">
                      {accessory.rating}
                    </span>
                  </span>
                </div>

                {/* Price */}
                <div className="mt-2">
                  <div className="text-gray-500 text-xs sm:text-base font-medium">
                    Price
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-sm sm:text-xl text-green-700">
                      {accessory.amount_price}
                    </span>
                    <span className="text-gray-400 text-[10px] sm:text-sm font-medium line-through">
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

"use client";

import React from "react";
import productData from "@/components/productSection/productData";
import Image from "next/image";
import Link from "next/link";
import CarIcon from "../icons/carIcons";
import RatingIcon from "../icons/ratingIcons";

interface ProductSectionProps {
  className?: string;
  limit?: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({ className = "", limit }) => {
  const displayData = limit ? productData.slice(0, limit) : productData;

  return (
    <div className={`max-w-[1440px] mx-auto px-4 sm:px-[60px] pt-[30px] pb-8 font-raleway ${className}`}>
      <div className="pt-6 pb-6 bg-white">
        {/* Top Bar: Heading + Button */}
        <div className="flex flex-row justify-between items-center mb-4 sm:mb-6 flex-nowrap">
          {/* Heading */}
          <h2 className="text-black text-[28px] sm:text-4xl font-normal mb-0">
            Other Products
          </h2>

          {/* View More Button right side */}
          <Link href="/features/automotive/car-section">
            <button className="border border-gray-700 rounded-full text-black font-medium px-3 py-1 text-base sm:text-lg hover:bg-gray-100 transition whitespace-nowrap">
              View More
            </button>
          </Link>
        </div>

        {/* Subtitle hidden on mobile */}
        <p className="text-gray-600 text-base sm:text-lg font-normal hidden sm:block mb-4">
          These are the luxury collection we have
        </p>

        {/* Product Grid / Horizontal Scroll for Mobile */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible">
          {displayData.map((car) => (
            <Link
              key={car.id}
              href={`/car/${car.id}`}
              passHref
              className="cursor-pointer flex-shrink-0 w-[220px] sm:w-[250px] lg:w-auto"
            >
              <div className="group border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 text-left font-raleway">
                {/* Image with Zoom */}
                <div className="rounded-[20px] border border-gray-300 overflow-hidden">
                  <Image
                    src={car.images[0]}
                    alt={car.title}
                    width={280}
                    height={200}
                    className="w-full h-[180px] sm:h-[200px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-[28px] sm:text-2xl font-bold mt-2 sm:mt-3">
                  {car.title}
                </h2>
                <p className="text-sm sm:text-xl text-gray-500 font-normal hidden sm:block">
                  {car.sub_title}
                </p>

                {/* Icons */}
                <div className="flex text-sm sm:text-lg text-gray-600 font-medium flex-wrap gap-1 mt-2">
                  <span className="flex items-center gap-1">
                    <CarIcon size={16} />
                    {car.num2}
                  </span>
                  <span className="flex items-center gap-1">
                    <RatingIcon size={16} />
                    {car.num3}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-2">
                  <div className="text-gray-500 text-sm sm:text-base font-medium">
                    Price
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-lg sm:text-xl text-green-700">
                      {car.amount_price}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm font-medium line-through">
                      {car.sub_price}
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

export default ProductSection;

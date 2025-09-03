"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import accessoriesData from "./data";
import CheckIcon from "@/components/shared/icons/checkIcons";
import RatingIcons from "@/components/shared/icons/ratingIcons";
import Navbar from "@/components/layout/navbar/navbar";
import SearchBar from "@/components/layout/search/searchbar";
import Pagination from "@/components/shared/pagination/pagination";
import FooterSection from "@/components/layout/footer/footer";

interface AccessoriesSectionProps {
  limit?: number;
}

const AccessoriesSection = ({ limit }: AccessoriesSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedData = limit ? accessoriesData.slice(0, limit) : accessoriesData;
  const totalPages = Math.ceil(paginatedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = paginatedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white min-h-screen pb-10">
      <Navbar />

      <div className="bg-green-900 text-white">
        <div className="w-full h-[400px] pb-16 flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center">
            Car Accessories Collection
          </h2>
          <p className="mt-3 text-base md:text-lg font-normal tracking-tight text-center max-w-2xl">
            Premium car accessories at the best possible pricing in Pakistan
          </p>

          <div className="w-full max-w-5xl mt-6 px-4 sm:px-0">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* SECTION WRAPPER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((accessory) => (
            <div key={accessory.id} className="group border border-gray-300 rounded-[24px] duration-300 text-left w-full h-full p-4 mt-6 hover:shadow-lg transition-shadow">
              <Link 
                href={`/features/automotive/accessories/${accessory.id}`}
                className="flex flex-col h-full"
                aria-label={`View details for ${accessory.title}`}
              >
                <div className="relative w-full aspect-[1.5] mb-4 overflow-hidden rounded-[18px] border border-gray-300">
                  <Image
                    src={accessory.images[0]}
                    alt={accessory.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={currentPage === 1 && currentItems.indexOf(accessory) < 4}
                  />
                </div>
                <h2 className="text-[22px] sm:text-[24px] font-bold mt-3 group-hover:text-blue-600 transition-colors">
                  {accessory.title}
                </h2>
                <p className="text-[20px] sm:text-[24px] text-gray-400 font-normal">
                  {accessory.sub_title}
                </p>

                <div className="flex justify-between mt-3 text-[18px] sm:text-[20px] font-medium text-gray-600 flex-wrap gap-1">
                  <span className="flex items-center gap-1">
                    <CheckIcon className="w-5 h-5" />
                    {accessory.feature1}
                  </span>
                  <span className="flex items-center gap-1">
                    <RatingIcons className="w-5 h-5" />
                    {accessory.rating}
                  </span>
                </div>

                <div className="mt-auto pt-2">
                  <div className="text-gray-500 text-lg sm:text-xl">{accessory.price}</div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xl sm:text-2xl text-green-700">
                      {accessory.amount_price}
                    </span>
                    {accessory.sub_price && (
                      <span className="text-gray-400 text-xs sm:text-sm font-medium line-through">
                        {accessory.sub_price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination Below Grid */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      <FooterSection/>
    </div>
  );
};

export default AccessoriesSection;

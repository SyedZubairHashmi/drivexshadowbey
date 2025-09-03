"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import carSectionData from "@/app/features/automotive/car-section/data";
import CheckIcon from "@/components/shared/icons/checkIcons";
import CcLayer from "@/components/shared/icons/cc-layer1";
import Seater from "@/components/shared/icons/seater";
import SearchBar from "@/components/layout/search/searchbar";
import Pagination from "@/components/shared/pagination/pagination";
import AccessoriesSection from "@/components/automotive/accessories/AccessoriesSection";

interface CarSectionProps {
  limit?: number;
}

const CarSection = ({ limit }: CarSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedData = limit ? carSectionData.slice(0, limit) : carSectionData;
  const totalPages = Math.ceil(paginatedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = paginatedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white min-h-screen pb-10">
      {/* GREEN HERO SECTION */}
      <div className="bg-green-900 text-white">
        <div className="w-full h-[400px] flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-6">
            Cars Collection
          </h2>
          <p className="mt-3 text-base md:text-lg font-normal tracking-tight max-w-2xl mx-auto">
            All cars at the best possible pricing in Pakistan
          </p>

          <div className="w-full max-w-5xl mt-6 px-4 sm:px-0">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* SECTION WRAPPER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((car) => (
            <Link key={car.id} href={`/features/automotive/car/${car.id}`} passHref>
              <div className="group border border-gray-300 rounded-[24px] duration-300 text-left w-full h-[426px] p-4 mt-6">
                <Image
                  src={car.images[0]}
                  alt={car.title}
                  width={314}
                  height={200}
                  className="rounded-[18px] border border-gray-300 p-1 object-cover w-full h-[200px] transform transition-transform duration-300 group-hover:scale-105"
                />
                <h2 className="text-[22px] sm:text-[24px] font-bold mt-3">{car.title}</h2>
                <p className="text-[20px] sm:text-[24px] text-gray-400 font-normal">{car.sub_title}</p>

                <div className="flex justify-between mt-3 text-[18px] sm:text-[20px] font-medium text-gray-600 flex-wrap gap-1">
                  <span className="flex items-center gap-1">
                    <Seater />
                    {car.num} Seats
                  </span>
                  <span className="flex items-center gap-1">
                    <CcLayer />
                    {car.num2}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckIcon />
                    {car.num3}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-gray-500 text-lg sm:text-xl">{car.price}</div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xl sm:text-2xl text-green-700">
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

        {/* Pagination Below Grid */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Accessories Section Below */}
      <AccessoriesSection />
    </div>
  );
};

export default CarSection;

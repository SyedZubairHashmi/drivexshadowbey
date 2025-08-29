"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import carSectionData from "@/app/carSection/data";
import CheckIcon from "@/components/icons/checkIcons";
import CcLayer from "@/components/icons/cc-layer1";
import Seater from "@/components/icons/seater";
import Navbar from "@/components/navbar/navbar";
import SearchBar from "@/components/searchbar/searchbar";
import Pagination from "@/components/pagination/pagination";

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
      <Navbar />

      <div className="bg-green-900 text-white">
        <div className="w-full h-[400px] pb-16 flex flex-col items-center justify-center relative overflow-hidden px-2">
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight">
            Happy Buyers, Real Stories
          </h2>
          <p className="mt-3 text-base font-normal tracking-tight text-center">
            Stories from happy buyers who found their car with DriveXDeals.
          </p>

          <div className="w-full max-w-5xl mt-6">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* SECTION WRAPPER */}
      <div className="max-w-[1440px] mx-auto px-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((car) => (
            <Link key={car.id} href={`/car/${car.id}`} className="cursor-pointer">
              <div className="group border border-gray-300 rounded-[24px] duration-300 text-left w-full max-w-[314px] h-[426px] mx-auto p-4 mt-6">
                <Image
                  src={car.images[0]}
                  alt={car.title}
                  width={314}
                  height={200}
                  className="rounded-[18px] border border-gray-300 p-1 object-cover w-full h-[200px] transform transition-transform duration-300 group-hover:scale-105"
                />
                <h2 className="text-[24px] font-bold mt-3">{car.title}</h2>
                <p className="text-[24px] text-gray-400 font-normal">{car.sub_title}</p>

                <div className="flex justify-between mt-3 text-[20px] font-medium text-gray-600 flex-wrap gap-1">
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
                  <div className="text-gray-500 text-xl">{car.price}</div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-2xl text-green-700">
                      {car.amount_price}
                    </span>
                    <span className="text-gray-400 text-sm font-medium line-through">
                      {car.sub_price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ✅ Pagination Below Grid */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CarSection;

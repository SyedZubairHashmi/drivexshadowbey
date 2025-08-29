"use client";

import Image from "next/image";
import { useState } from "react";
import accessoriesData from "./data";
import Navbar from "@/components/navbar/navbar";
import SearchBar from "@/components/searchbar/searchbar";
import Pagination from "@/components/pagination/pagination";

export default function CarAccessoriesCollectionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(accessoriesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = accessoriesData.slice(startIndex, startIndex + itemsPerPage);

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

      {/* ✅ Accessories Grid Section */}
      <div className="p-4 sm:p-8 md:p-16 bg-gray-50 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 text-left bg-white"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={280}
                height={180}
                className="rounded-lg border border-gray-300 p-1 object-cover w-full h-44 sm:h-48"
              />

              <h2 className="text-lg font-semibold mt-3">{item.title}</h2>
              <p className="text-gray-500">{item.sub_title}</p>

              <div className="flex flex-row gap-1 mt-3 text-sm text-gray-600">
                <span>✅ {item.feature1}</span>
                <span>✅ {item.rating}</span>
              </div>

              <div className="mt-4">
                <div className="text-gray-500 text-xs">{item.price}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-bold text-lg text-green-700">
                    {item.amount_price}
                  </span>
                  <span className="text-gray-400 line-through">
                    {item.sub_price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

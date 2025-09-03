"use client";

import Image from "next/image";
import Link from "next/link";
import carSectionData from "@/app/carSection/data";
import CheckIcon from "@/components/icons/checkIcons";
import CcLayer from "@/components/icons/cc-layer1";
import Seater from "@/components/icons/seater";

interface CarSectionProps {
  limit?: number;
}

const CarSection = ({ limit }: CarSectionProps) => {
  return (
    <div className="bg-white pt-12 pb-20 font-raleway">
      {/* Unified Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px]">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4 sm:gap-0">
          <div className="flex flex-col">
            <h2 className="text-black text-3xl sm:text-4xl font-normal mb-1 text-left">
              Discover More
            </h2>
            <p className="text-gray-600 text-base sm:text-lg font-normal">
              These are the luxury collection we have
            </p>
          </div>

          
  {/* View More Button - Full width on mobile, right-aligned on desktop */}
<div className="w-full sm:w-auto flex justify-center sm:justify-end">
  <Link href="/cars-collection" className="w-full sm:w-auto">
    <button
      className="w-full sm:w-auto border border-gray-700 rounded-full text-black font-medium px-4 py-2 text-base sm:text-lg text-center"
    >
      View More
    </button>
  </Link>
</div>





        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {carSectionData
            .slice(0, limit || carSectionData.length)
            .map((car) => (
              <Link key={car.id} href={`/car/${car.id}`} className="cursor-pointer">
                <div className="group border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-300 text-left w-full h-auto">
                  <Image
                    src={car.images[0]}
                    alt={car.title}
                    width={314}
                    height={200}
                    className="rounded-xl border border-gray-300 p-1 object-cover w-full h-[200px] transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <h2 className="text-xl sm:text-2xl font-bold mt-3">
                    {car.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-400 font-normal">
                    {car.sub_title}
                  </p>

                  <div className="flex justify-between mt-3 text-base sm:text-lg font-medium text-gray-600 flex-wrap gap-1">
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
                    <div className="text-gray-500 text-lg sm:text-xl">
                      {car.price}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xl sm:text-2xl text-green-700">
                        {car.amount_price}
                      </span>
                      <span className="text-gray-400 text-sm sm:text-base font-medium line-through">
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

export default CarSection;

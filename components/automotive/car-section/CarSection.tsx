"use client";

import Image from "next/image";
import Link from "next/link";
import carSectionData from "@/app/features/automotive/car-section/data";
import CheckIcon from "@/components/icons/checkIcons";
import CcLayer from "@/components/icons/cc-layer1";
import Seater from "@/components/icons/seater";

interface CarSectionProps {
  limit?: number;
}

const CarSection = ({ limit }: CarSectionProps) => {
  return (
    <div className="bg-white pt-6 sm:pt-12 pb-20 font-raleway">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px]">
        {/* Top Bar: Heading + Button */}
        <div className="flex flex-row justify-between items-center mb-6 sm:mb-10 flex-nowrap">
          {/* Heading */}
          <h2 className="text-black text-2xl sm:text-4xl font-normal mb-0">
            Discover More
          </h2>

          {/* View More Button right side */}
          <Link href="/features/automotive/car-section">
            <button className="border border-gray-700 rounded-full text-black font-medium px-3 py-1 text-[13px] sm:text-lg hover:bg-gray-100 transition whitespace-nowrap">
              View More
            </button>
          </Link>
        </div>

        {/* Subtitle hidden on mobile */}
        <p className="text-gray-600 text-base sm:text-lg font-normal hidden sm:block mb-4">
          These are the luxury collection we have
        </p>

        {/* Car Grid / Horizontal Scroll for Mobile */}
        <div className="flex gap-5 sm:gap-4 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-x-visible">
          {carSectionData
            .slice(0, limit || carSectionData.length)
            .map((car) => (
              <Link
                key={car.id}
                href={`/car/${car.id}`}
                className="cursor-pointer flex-shrink-0 w-[264px] sm:w-[250px] lg:w-auto"
              >
                <div className="group border border-gray-300 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition duration-300 text-left w-full h-auto">
                  <Image
                    src={car.images[0]}
                    alt={car.title}
                    width={280}
                    height={200}
                    className="rounded-xl border border-gray-300 p-1 object-cover w-full h-[180px] sm:h-[200px] transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <h2 className="text-base sm:text-2xl font-bold mt-2 sm:mt-3">
                    {car.title}
                  </h2>
                  <p className="text-sm sm:text-xl text-gray-400 font-normal sm:block">
                    {car.sub_title}
                  </p>

                  {/* Icons Row */}
                  <div className="flex justify-between items-center mt-2 font-medium text-gray-600 gap-2">
                    <span className="flex items-center gap-1">
                      <Seater className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="text-[11px] sm:text-base">
                        {car.num} Seats
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CcLayer className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="text-[11px] sm:text-base">
                        {car.num2}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="text-[11px] sm:text-base">
                        {car.num3}
                      </span>
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="text-gray-500 text-xs sm:text-xl">
                      {car.price}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-bold text-sm sm:text-2xl text-green-700">
                        {car.amount_price}
                      </span>
                      <span className="text-gray-400 text-[10px] sm:text-base font-medium line-through">
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

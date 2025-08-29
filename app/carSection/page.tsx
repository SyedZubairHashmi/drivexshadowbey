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
    <div className="bg-white pt-[60px] pb-[80px] font-raleway">
      {/* SECTION WRAPPER */}
      <div className="max-w-[1440px] mx-auto px-[60px]">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <h2 className="text-black text-[44px] font-normal mb-1 text-left font-raleway">
              Discover More
            </h2>
            <p className="text-gray-600 text-[20px] font-normal font-raleway">
              These are the luxury collection we have
            </p>
          </div>
          <button className="text-black border border-gray-700 rounded-full px-5 py-2 text-[20px] font-normal font-raleway">
            View More
          </button>
        </div>

        {/* CAR GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {carSectionData
            .slice(0, limit || carSectionData.length)
            .map((car) => (
              <Link
                key={car.id}
                href={`/car/${car.id}`}
                className="cursor-pointer"
              >
                <div className="group border border-gray-300 rounded-[24px] duration-300 text-left w-full max-w-[314px] h-[426px] mx-auto p-4 mt-6 font-raleway">
                  <Image
                    src={car.images[0]}
                    alt={car.title}
                    width={314}
                    height={200}
                    className="rounded-[18px] border border-gray-300 p-1 object-cover w-full h-[200px] transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <h2 className="text-[24px] font-bold mt-3 font-raleway">
                    {car.title}
                  </h2>
                  <p className="text-[24px] text-gray-400 font-normal font-raleway">
                    {car.sub_title}
                  </p>

                  <div className="flex justify-between mt-3 text-[20px] font-medium text-gray-600 flex-wrap gap-1 font-raleway">
                    <span className="flex items-center gap-1">
                      <Seater/>
                      {car.num} Seats
                    </span>
                    <span className="flex items-center gap-1">
                      <CcLayer/>
                      {car.num2}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckIcon/>
                      {car.num3}
                    </span>
                  </div>

                  <div className="mt-2 font-raleway">
                    <div className="text-gray -500 text-xl">{car.price}</div>
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
      </div>
    </div>
  );
};

export default CarSection;

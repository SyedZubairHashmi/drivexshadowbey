"use client";

import productData from "@/components/productSection/productData";
import Image from "next/image";
import Link from "next/link";
import CarIcons1 from "../icons/carIcons";
import RatingIcons from "../icons/ratingIcons";

const ProductSection = () => {
  return (
    // Outer container: max width 1440px, consistent padding (like other sections)
    <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] pt-[30px] pb-8 font-raleway">
      {/* Inner white background container, no extra horizontal padding */}
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
  <Link href="/cars-collection" className="w-full sm:w-auto">
    <button className="w-full sm:w-auto border border-gray-700 rounded-full text-black font-normal px-4 py-2 text-[20px] text-center font-raleway">
      View More
    </button>
  </Link>
</div>

        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productData.map((car) => (
            <Link key={car.id} href={`/car/${car.id}`} passHref>
              <div className="border border-gray-300 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-shadow duration-300 text-left font-raleway cursor-pointer group">
                {/* Image with Zoom on Hover */}
                <div className="rounded-[20px] border border-gray-300 overflow-hidden">
                  <Image
                    src={car.images[0]}
                    alt={car.title}
                    width={280}
                    height={200}
                    className="w-full h-[200px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-[24px] font-bold mt-2">{car.title}</h2>
                <p className="text-[20px] text-gray-500">{car.sub_title}</p>

                {/* Icons */}
                <div className="flex text-[20px] text-gray-600 font-medium flex-wrap gap-2 mt-2">
                  <span className="flex items-center gap-1">
                    <CarIcons1 />
                    {car.num2}
                  </span>
                  <span className="flex items-center gap-1">
                    <RatingIcons />
                    {car.num3}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 flex flex-col">
                  <div className="text-gray-500 font-medium text-[14px]">
                    Price
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-[24px] text-green-700">
                      {car.amount_price}
                    </span>
                    <span className="text-gray-500 font-medium text-[14px] line-through">
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

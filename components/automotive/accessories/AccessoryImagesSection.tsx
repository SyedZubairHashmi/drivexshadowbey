"use client";

import { useState } from "react";
import Image from "next/image";

interface AccessoryImagesSectionProps {
  images: string[];
  title: string;
}

const AccessoryImagesSection = ({ images, title }: AccessoryImagesSectionProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="flex flex-col w-full lg:max-w-[649px] px-4 sm:px-6 lg:px-0">
      {/* Main Large Image Card */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] mb-6 rounded-lg overflow-hidden shadow-lg bg-gray-100">
        <Image
          src={images[selectedImageIndex] || images[0]}
          alt={`${title} - Main View`}
          fill
          className="object-cover transition-all duration-300 ease-in-out hover:scale-105"
          priority
        />
        
        {/* Image Counter Badge */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Images Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative h-20 sm:h-24 lg:h-28 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedImageIndex === index
                ? "ring-2 ring-green-600 ring-offset-2 shadow-lg scale-105"
                : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 hover:shadow-md hover:scale-102"
            }`}
          >
            <Image
              src={image}
              alt={`${title} - View ${index + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Selected Overlay */}
            {selectedImageIndex === index && (
              <div className="absolute inset-0 bg-green-600 bg-opacity-20 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Navigation Dots (for mobile) */}
      <div className="flex justify-center mt-4 space-x-2 sm:hidden">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              selectedImageIndex === index
                ? "bg-green-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AccessoryImagesSection;

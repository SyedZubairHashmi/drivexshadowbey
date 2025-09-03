// components/carDetail/CarImagesSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";

interface CarImagesSectionProps {
  images: StaticImageData[];
  title: string;
  className?: string;
}

const CarImagesSection: React.FC<CarImagesSectionProps> = ({ 
  images, 
  title, 
  className = "" 
}) => {
  const [selectedImage, setSelectedImage] = useState<StaticImageData | undefined>(undefined);

  useEffect(() => {
    if (images?.length) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!images?.length) {
    return (
      <div className={`flex flex-col flex-1 items-center justify-center ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col flex-1 ${className}`}>
      {/* Main Image */}
      <div className="relative rounded-lg w-full max-w-[611px] h-[332px] border border-gray-300 p-2 mb-4">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-3 mt-8 overflow-x-auto px-1">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`border-2 rounded-md p-[2px] cursor-pointer transition-colors duration-300 ${
              selectedImage === img ? "border-blue-600" : "border-gray-300"
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(img)}
            aria-label={`Select image ${index + 1}`}
          >
            <Image 
              src={img} 
              alt={`${title} thumbnail ${index + 1}`} 
              width={120} 
              height={70} 
              className="rounded-md object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Contact Button */}
      <div className="flex justify-center mt-6">
        <button className="bg-green-600 w-full text-white px-6 py-2 rounded-xl font-semibold shadow-sm hover:bg-green-700 transition">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default CarImagesSection;

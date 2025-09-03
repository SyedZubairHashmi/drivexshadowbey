// components/carDetail/CarImagesSection.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

interface CarImagesSectionProps {
  images: StaticImageData[];
  title: string;
}

const CarImagesSection = ({ images, title }: CarImagesSectionProps) => {
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (images?.length > 0) {
      setSelectedImage(images[0]);
      setSelectedIndex(0);
    }
  }, [images]);

  const handleThumbnailClick = (img: StaticImageData, index: number) => {
    setSelectedImage(img);
    setSelectedIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[332px] bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Main Image */}
      <div className="relative w-full aspect-video max-w-[611px] rounded-lg border border-gray-300 overflow-hidden mb-4">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={`${title} - Main view`}
            fill
            sizes="(max-width: 768px) 100vw, 
                   (max-width: 1200px) 50vw, 
                   33vw"
            className="object-contain bg-white"
            priority
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4 overflow-x-auto pb-2 px-1 -mx-1">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(img, index)}
            className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              selectedIndex === index 
                ? "border-blue-600 ring-2 ring-blue-500 ring-offset-1" 
                : "border-gray-200 hover:border-gray-400"
            }`}
            aria-label={`View image ${index + 1} of ${images.length}`}
            aria-current={selectedIndex === index ? "true" : "false"}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${index + 1} of ${images.length}`}
              width={80}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button 
          className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={() => {
            // Handle inquiry button click
            console.log('Inquiry button clicked');
          }}
        >
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default CarImagesSection;

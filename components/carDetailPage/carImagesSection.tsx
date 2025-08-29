// components/carDetail/CarImagesSection.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

interface CarImagesSectionProps {
  images: StaticImageData[];
  title: string;
}

const CarImagesSection = ({ images, title }: CarImagesSectionProps) => {
  const [selectedImage, setSelectedImage] = useState<StaticImageData | undefined>(undefined);

  useEffect(() => {
    if (images?.length) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  return (
    <div className="flex flex-col flex-1">
    <div className="relative rounded-lg w-[611px] h-[332px] border border-gray-300 p-2 mb-4">
  {selectedImage && (
    <Image
      src={selectedImage}
      alt={title}
      fill
      className="object-cover rounded-lg"
    />
  )}
</div>


      <div className="flex gap-3 mt-8 overflow-x-auto px-1">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`border-2 rounded-md p-[2px] cursor-pointer transition-colors duration-300 ${
              selectedImage === img ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <Image src={img} alt={`thumb-${index}`} width={120} height={70} className="rounded-md object-cover" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button className="bg-green-600 w-full text-white px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-green-700 transition">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default CarImagesSection;

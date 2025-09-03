"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const galleryData = [
  {
    id: 1,
    youtubeId: "dQw4w9WgXcQ",
    title: "Luxury Interior",
  },
  {
    id: 2,
    youtubeId: "9bZkp7q19f0",
    title: "Exterior Design",
  },
  {
    id: 3,
    youtubeId: "kJQP7kiw5Fk",
    title: "Performance View",
  },
  {
    id: 4,
    youtubeId: "fJ9rUzIMcZQ",
    title: "Comfort Features",
  },
  {
    id: 5,
    youtubeId: "ZZ5LpwO-An4",
    title: "Classic Design",
  },
  {
    id: 6,
    youtubeId: "hFZFjoX2cGg",
    title: "Modern Technology",
  },
  {
    id: 7,
    youtubeId: "y6120QOlsfU",
    title: "Safety Features",
  },
  {
    id: 8,
    youtubeId: "kXYiU_JCYtU",
    title: "Driving Experience",
  },
];

export default function GallerySection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 2;
  const router = useRouter();

  const prev = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(galleryData.length - visibleCount, 0) : prev - 1
    );
  };

  const next = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= galleryData.length ? 0 : prev + 1
    );
  };

  const handleViewMore = () => {
    router.push("/features/automotive/gallery");
  };

  return (
    <div className="bg-black pt-[60px] pb-[80px] font-raleway">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px]">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6 gap-3">
          {/* Header text */}
          <div>
            <h2 className="text-lg sm:text-3xl text-white font-normal">
              Explore Every Feature in Detail
            </h2>
            {/* Subtitle only visible on desktop */}
            <p className="hidden sm:block text-white text-sm sm:text-base mt-1">
              Full tour of design, comfort & performance.
            </p>
          </div>

          {/* Responsive View More Button */}
          <div>
            <button className="border border-gray-700 rounded-full text-white font-medium px-3 py-1 text-base sm:text-lg hover:bg-gray-100 transition whitespace-nowrap">
      View More
    </button>
          </div>
        </div>

        {/* Gallery Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {galleryData
            .slice(startIndex, startIndex + visibleCount)
            .map((item) => (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden shadow-lg bg-[#111] cursor-pointer w-full max-w-[700px] mx-auto"
              >
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${item.youtubeId}`}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>

                <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded text-sm text-white">
                  {item.title}
                </div>
              </div>
            ))}
        </div>

        {/* Arrows */}
        <div className="mt-6 flex justify-center gap-2 items-center select-none">
          <button
            onClick={prev}
            className="w-14 h-14 flex items-center justify-center rounded-full border hover:bg-gray-800 transition"
          >
            <FaChevronLeft size={28} className="text-white" />
          </button>
          <button
            onClick={next}
            className="w-14 h-14 flex items-center justify-center rounded-full border hover:bg-gray-800 transition"
          >
            <FaChevronRight size={28} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

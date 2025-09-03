"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import videos from "./data";

interface ExploreSectionProps {
  className?: string;
}

export default function ExploreSection({ className = "" }: ExploreSectionProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 2;
  const router = useRouter();

  const prev = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(videos.length - visibleCount, 0) : prev - 1
    );
  };

  const next = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= videos.length ? 0 : prev + 1
    );
  };

  const handleViewMore = () => {
    router.push("/features/automotive/gallery");
  };

  return (
    <div className={`bg-black pt-[60px] pb-[80px] font-raleway ${className}`}>
      {/* Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl text-white font-normal">
              Explore Every Feature in Detail
            </h2>
            <p className="text-white text-sm sm:text-base mt-1">
              Full tour of design, comfort & performance.
            </p>
          </div>

          {/* View More Button */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <button
              onClick={handleViewMore}
              className="w-full sm:w-auto border border-gray-700 rounded-full text-white font-normal px-6 py-3 text-base sm:text-lg text-center hover:bg-white hover:text-black transition"
            >
              View More
            </button>
          </div>
        </div>

        {/* Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {videos.slice(startIndex, startIndex + visibleCount).map((video) => (
            <div
              key={video.id}
              className="relative rounded-xl overflow-hidden shadow-lg bg-[#111] cursor-pointer w-full max-w-[700px] mx-auto"
            >
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />

              {/* Video Title Overlay */}
              <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded text-sm text-white">
                {video.title}
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="mt-8 flex justify-center gap-4 items-center select-none">
          <button
            onClick={prev}
            className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-600 hover:bg-gray-800 transition"
            aria-label="Previous video"
          >
            <FaChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={next}
            className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-600 hover:bg-white-800 transition"
            aria-label="Next video"
          >
            <FaChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

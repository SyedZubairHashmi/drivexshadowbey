"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import videos from "./data";

export default function ExploreSection() {
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
    router.push("/gallery");
  };

  return (
    <div className="bg-black pt-[60px] pb-[80px] font-raleway">
      {/* Container with consistent max-width and padding like Footer and Blogs */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
  {/* Header text */}
  <div>
    <h2 className="text-2xl sm:text-3xl text-white font-normal">
      Explore Every Feature in Detail
    </h2>
    <p className="text-white text-sm sm:text-base mt-1">
      Full tour of design, comfort & performance.
    </p>
  </div>

  {/* Responsive View More Button */}
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
              ></iframe>

              <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded text-sm text-white">
                {video.title}
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

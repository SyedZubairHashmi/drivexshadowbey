"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import videos from "./data";

export default function ExploreSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 2;

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

  return (
    <div className="bg-black pt-[60px] pb-[80px] font-raleway">
      <div className="max-w-[1440px] mx-auto px-[60px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between ml-3 items-start sm:items-center mb-6 gap-3 sm:gap-0">
          <div>
            <h2 className="text-xl- sm:text-3xl text-white font-normal ml-3">
              Explore Every Feature in Detail
            </h2>
            <p className="text-xl-400 text-white text-sm sm:text-base ml-3">
              Full tour of design, comfort & performance.
            </p>
          </div>
          <button className="text-white  border border-gray-700 rounded-full px-4 py-1 mt-2 sm:mt-0 text-[20px]">
            View More
          </button>
        </div>

        {/* Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-6">
          {videos.slice(startIndex, startIndex + visibleCount).map((video) => (
            <div
              key={video.id}
              className="relative rounded-lg overflow-hidden shadow-lg bg-[#111] cursor-pointer w-full max-w-[700px] mx-auto"
            >
              {/* Embed YouTube iframe instead of <video> */}
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

              {/* Title Overlay */}
              <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded text-sm">
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

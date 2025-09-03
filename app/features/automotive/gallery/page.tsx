"use client";

import React, { useState } from "react";
import YouTube from "react-youtube";
import Navbar from "@/components/layout/navbar/navbar";
import { videoData } from "./data";
import Pagination from "@/components/shared/pagination/pagination";
import FooterSection from "@/components/layout/footer/footer";

const Gallery: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // adjust as needed

  const totalPages = Math.ceil(videoData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVideos = videoData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-green-900 h-[400px] flex flex-col justify-center items-center text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Drive X Deal Gallery
          </h2>
          <p className="mt-3 text-base md:text-lg font-normal tracking-tight max-w-2xl mx-auto">
            Explore our latest cars and memorable moments in the place.
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-6xl mx-auto px-4 text-center mt-10">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Experience Cars Like Never Before
        </h3>
        <p className="mt-3 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Browse through our gallery and discover the finest cars curated by Drive X Deal.
          Every model reflects power, precision, and passion for driving.
        </p>
      </div>

      {/* Video Gallery */}
      <div className="max-w-[1400px] mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {currentVideos.map((video, idx) => (
          <div key={idx} className="w-full">
            {/* YouTube Video */}
            <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-md">
              <YouTube
                videoId={video.id}
                className="absolute top-0 left-0 w-full h-full"
                opts={{
                  playerVars: {
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0,
                  },
                }}
              />
            </div>

            {/* Title & Description Outside of Card */}
            <div className="mt-4 px-1">
              <h4 className="text-lg font-bold text-gray-900">{video.title}</h4>
              <p className="mt-1 text-sm text-gray-600">{video.description}</p>
            </div>
          </div>
        ))}
         <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" }); // optional: scroll to top on page change
        }}
      />
      </div>

      {/* Pagination */}
     
      <FooterSection/>
    </div>
  );
};

export default Gallery;

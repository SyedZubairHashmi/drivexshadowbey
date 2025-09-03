"use client";

import { blogData, BlogPost } from "@/types/blog";
import SearchBar from "@/components/layout/search/searchbar";
import Link from "next/link";
import AccessoriesSection from "@/components/automotive/accessories/AccessoriesSection";
import GallerySection from "@/components/automotive/gallery/GallerySection";

type BlogsSectionProps = {
  limit?: number; // hero / section header ke liye
  sectionTitle?: string;
  sectionSubtitle?: string;
  seeMoreLink?: string;
};

export default function BlogsSection({
  limit,
  sectionTitle,
  sectionSubtitle,
  seeMoreLink,
}: BlogsSectionProps) {
  const visibleCards: BlogPost[] = blogData; // sab cards show honge

  return (
    <div className="bg-white min-h-screen pb-10 font-raleway">
      {/* Hero Section */}
      {!limit && (
        <div className="bg-green-900 text-white">
          <div className="w-full h-[400px] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Happy Buyers, Real Stories
            </h2>
            <p className="mt-3 text-base md:text-lg font-normal tracking-tight max-w-2xl">
              Stories from happy buyers who found their car with DriveXDeals.
            </p>
            <div className="w-full max-w-5xl mt-6 ">
              <SearchBar />
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] pt-10">
        {limit && (sectionTitle || sectionSubtitle || seeMoreLink) && (
          <div className="flex flex-row justify-between items-center mb-4 sm:mb-6 flex-nowrap">
            <h2 className="text-[24px] sm:text-3xl lg:text-4xl font-bold mb-0">
              {sectionTitle}
            </h2>
            {seeMoreLink && (
              <Link
                href={seeMoreLink}
                className="border border-gray-700 rounded-2xl px-3 py-1 text-[16px] sm:text-lg lg:text-xl text-black hover:bg-gray-100 transition whitespace-nowrap"
              >
                See More
              </Link>
            )}
          </div>
        )}

        {sectionSubtitle && (
          <p className="text-gray-600 text-[14px] sm:text-lg lg:text-xl font-normal hidden sm:block mb-4">
            {sectionSubtitle}
          </p>
        )}

        {/* Blog Cards */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-x-visible">
          {visibleCards.map((item) => (
            <Link
              key={item.id}
              href={`/features/automotive/blog/${item.id}`}
              className="cursor-pointer flex-shrink-0 w-[264px] lg:w-[427px]"
            >
              <div className="group bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition relative w-[264px] h-[371px] lg:w-[427px] lg:h-[500px]">
                {/* Image */}
                <div className="w-full h-[140px] sm:h-[200px] lg:h-[250px] p-2">
                  <img
                    src={`/${item.imgSrc}`}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-[16px] transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 text-gray-900">
                  <h3 className="text-[16px] sm:text-lg lg:text-2xl font-bold leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p
                    className="text-[16px] sm:text-sm lg:text-base text-gray-700"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </p>

                  <span className="mt-auto inline-flex items-center justify-center border border-gray-300 rounded-full px-4 py-2 sm:px-5 sm:py-3 font-medium text-[16px] sm:text-base lg:text-lg text-gray-800 group-hover:bg-gray-100 transition-colors text-center">
                    Read My Story
                    <svg
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Optional Sections */}
      {!limit && (
        <>
          <GallerySection />
          <AccessoriesSection />
        </>
      )}
    </div>
  );
}

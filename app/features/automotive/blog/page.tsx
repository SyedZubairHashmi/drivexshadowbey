import Navbar from "@/components/layout/navbar/navbar";
import { blogData, BlogPost } from "@/types/blog";
import SearchBar from "@/components/layout/search/searchbar";
import Link from "next/link";
import AccessoriesSection from "@/components/automotive/accessories/AccessoriesSection";
import GallerySection from "@/components/automotive/gallery/GallerySection";
import FooterSection from "@/components/layout/footer/footer";

type BlogsSectionProps = {
  limit?: number;
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
  const visibleCards: BlogPost[] = blogData.slice(0, limit || blogData.length);

  return (
    <div className="bg-white min-h-screen pb-10">
      <Navbar />

      {/* Hero Section for full page */}
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

      {/* Section Header + Cards Wrapper */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] pt-10">
        {/* Section Header */}
        {limit && (sectionTitle || sectionSubtitle || seeMoreLink) && (
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col">
              {sectionTitle && (
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {sectionTitle}
                </h2>
              )}
              {sectionSubtitle && (
                <p className="text-gray-600 text-base sm:text-lg mt-1">
                  {sectionSubtitle}
                </p>
              )}
            </div>
            {seeMoreLink && (
              <Link
                href={seeMoreLink}
                className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 border border-gray-700 rounded-2xl text-black font-medium hover:bg-gray-100 transition text-center inline-block"
              >
                See More
              </Link>
            )}
          </div>
        )}

        {/* Blog Cards */}
        <div
          className={`${
            limit ? "mt-6" : "mt-10"
          } grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`}
        >
          {visibleCards.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition relative h-full"
            >
              <Link 
                href={`/features/automotive/blog/${item.id}`}
                className="h-full flex flex-col"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] bg-white p-2 mx-auto mt-2 rounded-[16px] overflow-hidden">
                  <div className="w-full h-full overflow-hidden rounded-[16px]">
                    <img
                      src={`/${item.imgSrc}`}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-[16px] transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex flex-col flex-1 text-gray-900 bg-white">
                  <h3 className="text-base md:text-lg font-bold leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm mb-4 flex-1 text-gray-700 line-clamp-3">
                    {item.description}
                  </p>

                  <span className="mt-auto inline-flex items-center justify-center border border-gray-300 rounded-full px-4 py-2 md:px-5 md:py-3 font-medium text-gray-800 group-hover:bg-gray-100 transition-colors text-center">
                    Read My Story
                    <svg 
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Optional Sections Only for Full Page */}
      {!limit && (
        <>
          <GallerySection />
          <AccessoriesSection />
          <FooterSection />
        </>
      )}
    </div>
  );
}

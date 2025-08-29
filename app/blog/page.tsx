import Navbar from "@/components/navbar/navbar";
import blogData from "./blogdata";
import SearchBar from "@/components/searchbar/searchbar";
import Link from "next/link";

type BlogsSectionProps = {
  limit?: number; // optional
  sectionTitle?: string; // Title upar
  sectionSubtitle?: string; // Subtitle neeche
  seeMoreLink?: string; // See More button link
};

export default function BlogsSection({
  limit,
  sectionTitle,
  sectionSubtitle,
  seeMoreLink,
}: BlogsSectionProps) {
  const visibleCards = blogData.slice(0, limit || blogData.length);

  return (
    <div className="bg-white min-h-screen pb-10">
      <Navbar />

      {!limit && (
        <div className="bg-green-900 text-white">
          <div className="w-full h-[400px] pb-16 flex flex-col items-center justify-center relative overflow-hidden px-2">
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight">
              Happy Buyers, Real Stories
            </h2>
            <p className="mt-3 text-base font-normal tracking-tight text-center">
              Stories from happy buyers who found their car with DriveXDeals.
            </p>

            <div className="w-full max-w-6xl mt-6">
              <SearchBar />
            </div>
          </div>
        </div>
      )}

      {limit && (sectionTitle || sectionSubtitle || seeMoreLink) && (
        <div className="max-w-8xl mx-auto px-6 pt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-col">
            {sectionTitle && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-gray-600 text-[18px] sm:text-[20px] mt-1">
                {sectionSubtitle}
              </p>
            )}
          </div>
          {seeMoreLink && (
            <a
              href={seeMoreLink}
              className="mt-3 sm:mt-0 px-4 py-2 border border-gray-700 rounded-2xl text-black font-medium hover:bg-gray-100 transition"
            >
              See More
            </a>
          )}
        </div>
      )}

      <div
        className={`${
          limit ? "mt-4" : "mt-10"
        } max-w-8xl mx-auto px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`}
      >
        {visibleCards.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition relative"
          >
            <div className="absolute top-0 left-0 w-full bg-[#f1f5f4] border-b border-gray-200"></div>

            {/* Image with Zoom on Hover */}
            <div className="w-[440px] h-[280px] bg-white p-2 mx-auto mt-2 rounded-[16px] overflow-hidden">
              <div className="w-full h-full overflow-hidden rounded-[16px]">
                <img
                  src={`/${item.imgSrc}`}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-[16px] transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 text-gray-900 bg-white">
              <h3 className="text-lg font-bold leading-snug mb-3">{item.title}</h3>
              {/* CLAMP DESCRIPTION TO 3 LINES */}
              <p className="text-sm mb-5 flex-1 text-gray-700 line-clamp-3">{item.description}</p>

              {/* Updated Read My Story Button as Link */}
              <Link
                href={`/blog/${item.id}`}
                className="mt-auto border border-gray-300 rounded-full px-5 py-3 font-medium text-gray-800 hover:bg-gray-100 transition text-center block"
              >
                Read My Story
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Navbar from "@/components/navbar/navbar";
import blogData from "../../public/blogdata";
import SearchBar from "@/components/searchbar/searchbar";
import Link from "next/link";
import ExploreSection from "@/components/exploreSection/exploreSection";
import ProductSection from "@/components/productSection/productSection";
import FooterSection from "@/components/footer/footer";

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
  const visibleCards = blogData.slice(0, limit || blogData.length);

  return (
    <div className="bg-white min-h-screen pb-10">
      <Navbar />

      {/* Hero Section for full page */}
      {!limit && (
        <div className="bg-green-900 text-white">
          <div className="w-full py-12 px-4 flex flex-col items-center justify-center text-center">
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
              <a
                href={seeMoreLink}
                className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 border border-gray-700 rounded-2xl text-black font-medium hover:bg-gray-100 transition text-center"
              >
                See More
              </a>
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
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition relative"
            >
              {/* Image */}
              <div className="w-full aspect-[4/3] bg-white p-2 mx-auto mt-2 rounded-[16px] overflow-hidden">
                <div className="w-full h-full overflow-hidden rounded-[16px]">
                  <img
                    src={`/${item.imgSrc}`}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-[16px] transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 flex flex-col flex-1 text-gray-900 bg-white">
                <h3 className="text-base md:text-lg font-bold leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-sm mb-4 flex-1 text-gray-700 line-clamp-3">
                  {item.description}
                </p>

                <Link
                  href={`/blog/${item.id}`}
                  className="mt-auto border border-gray-300 rounded-full px-4 py-2 md:px-5 md:py-3 font-medium text-gray-800 hover:bg-gray-100 transition text-center block"
                >
                  Read My Story
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Sections Only for Full Page */}
      {!limit && (
        <>
          <ExploreSection />
          <ProductSection />
          <FooterSection />
        </>
      )}
    </div>
  );
}

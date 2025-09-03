"use client";

import SearchBar from "@/components/searchbar/searchbar";

export default function HeroSection() {
  return (
    <section className="h-screen w-full flex items-start justify-center pt-32 sm:pt-44 font-raleway relative">
      {/* Mobile Background */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{ backgroundImage: "url('/mobileResponsiveImage.png')" }}
      ></div>

      {/* Desktop Background */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden sm:block"
        style={{ backgroundImage: "url('/heroCar.png')" }}
      ></div>

      {/* Overlay content */}
      <div className="relative text-center text-white px-4 max-w-6xl mx-auto font-raleway">
        <h1 className="text-[24px] sm:text-[24px] md:text-[40px] lg:text-[50px] font-semibold leading-tight font-raleway">
          Experience the thrill of driving <br /> the finest cars with us!
        </h1>

        <p className="mt-3 text-lg sm:text-lg text-gray-200 font-raleway">
          With thousands of cars, we have just the right one for you
        </p>

        <SearchBar />
      </div>
    </section>
  );
}

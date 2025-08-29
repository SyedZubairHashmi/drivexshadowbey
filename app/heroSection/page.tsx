"use client";

import SearchBar from "@/components/searchbar/searchbar";


export default function HeroSection() {
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center flex items-start justify-center pt-32 sm:pt-44 font-raleway"
      style={{ backgroundImage: "url('/heroCar.png')" }}
    >
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto font-raleway">
        {/* Heading */}
        <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[50px] font-semibold leading-tight font-raleway">
          Experience the thrill of driving <br /> the finest cars with us!
        </h1>

        <p className="mt-3 text-lg text-gray-200 font-raleway">
          With thousands of cars, we have just the right one for you
        </p>

        {/* Reusable SearchBar */}
        <SearchBar />
      </div>
    </section>
  );
}

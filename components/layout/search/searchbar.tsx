"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import CallToActionButton from "../navbar/CallToActionButton";

export default function SearchBar() {
  const [city, setCity] = useState("All Cities");
  const [price, setPrice] = useState("Price Range");

  return (
    <div className="mt-6 w-full flex flex-col items-center justify-center font-raleway max-w-[1440px] mx-auto px-4">
      {/* Desktop version */}
      <div className="hidden sm:flex flex-row items-end rounded-lg shadow-md w-full">
        {/* Input + Selects */}
        <div className="flex-1 sm:w-[914px] h-[57px] bg-white border border-gray-300 rounded-full flex items-center px-3">
          <input
            type="text"
            placeholder="Car Model..."
            className="flex-1 bg-transparent px-4 focus:outline-none text-black font-light text-sm md:text-base"
          />

          {/* Filters */}
          <div className="flex items-center gap-2 ml-2">
            {/* Price Select */}
            <div className="border border-gray-300 rounded-full px-3 py-1.5">
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-light text-sm md:text-base"
              >
                <option>Price Range</option>
                <option>$0 - $100</option>
                <option>$100 - $500</option>
                <option>$500+</option>
              </select>
            </div>

            {/* City Select */}
            <div className="border border-gray-300 rounded-full px-3 py-1.5">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-light text-sm md:text-base"
              >
                <option>All Cities</option>
                <option>Karachi</option>
                <option>Lahore</option>
                <option>Islamabad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button className="bg-[#00674F] hover:bg-[#008060] w-[124px] h-[57px] text-white text-sm md:text-base rounded-full shadow-lg font-medium transition ml-4">
          Search
        </button>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden w-full max-w-md mx-auto">
        {/* Search Bar */}
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 h-12 shadow-sm">
          <input
            type="text"
            placeholder="Car Model..."
            className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
          />
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00674F] hover:bg-[#008060] transition text-white ml-2"
            aria-label="Search"
          >
            <FiSearch size={16} />
          </button>
        </div>

        {/* CTA Button below */}
        <div className="mt-4 text-center">
          <CallToActionButton />
        </div>
      </div>
    </div>
  );
}

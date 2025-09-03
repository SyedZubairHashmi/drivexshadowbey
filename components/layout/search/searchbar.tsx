"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import CallToActionButton from "../navbar/CallToActionButton";

export default function SearchBar() {
  const [city, setCity] = useState("All Cities");
  const [price, setPrice] = useState("Price Range");

  return (
    <div className="mt-6 w-full flex flex-col items-center justify-center font-raleway max-w-[1440px] mx-auto px-4">
      {/* Container for desktop & mobile */}  
      <div className="w-full">
        
        {/* Desktop version - hidden on mobile */}
        <div className="hidden sm:flex flex-row items-end rounded-lg shadow-md w-full">
          <div className="flex-1 sm:w-[914px] h-[57px] bg-white border border-gray-300 rounded-full flex items-center px-2">
            <input
              type="text"
              placeholder="Car Model..."
              className="flex-1 bg-transparent px-4 focus:outline-none text-black font-light"
            />
            <div className="flex items-center gap-1 ml-4">
              <div className="border border-gray-300 rounded-full px-4 py-2">
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-700 font-light"
                >
                  <option>Price Range</option>
                  <option>$0 - $100</option>
                  <option>$100 - $500</option>
                  <option>$500+</option>
                </select>
              </div>

              <div className="border border-gray-300 rounded-full px-4 py-2">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-700 font-light"
                >
                  <option>All Cities</option>
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                </select>
              </div>
            </div>
          </div>

          <button className="bg-[#00674F] hover:bg-[#008060] w-[124px] h-[57px] text-white px-8 py-4 text-lg rounded-full shadow-lg font-medium transition ml-4">
            Search
          </button>
        </div>

        {/* Mobile version - visible only on small screens */}
        <div className="sm:hidden">
          {/* Search Bar */}
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 h-12 shadow-sm w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Car Model"
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
            />
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00674F] hover:bg-[#008060] transition text-white ml-2"
              aria-label="Search"
            >
              <FiSearch size={16} />
            </button>
          </div>

          {/* CTA Button below search bar */}
          <div className="block sm:hidden mt-4 w-full max-w-md mx-auto text-center">
            <CallToActionButton fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
}

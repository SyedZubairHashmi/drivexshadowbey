"use client";

import { useState } from "react";

export default function SearchBar() {
  const [city, setCity] = useState("All Cities");
  const [price, setPrice] = useState("Price Range");

  return (
    <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center sm:gap-2 font-raleway">
      {/* White Rounded Box */}
      <div className="flex flex-col sm:flex-row items-end rounded-lg shadow-md max-w-[1440px] w-full mx-auto font-raleway">
        {/* Input wrapper */}
        <div className="flex-1 sm:w-[914px] h-[57px] bg-white border border-gray-300 rounded-full flex items-center px-2 font-raleway">
          <input
            type="text"
            placeholder="Car Model..."
            className="flex-1 bg-transparent px-4 focus:outline-none text-black font-light font-raleway"
          />
          <div className="flex items-center gap-1 ml-0 sm:ml-4 font-raleway">
            {/* Price Range */}
            <div className="border border-gray-300 rounded-full px-4 py-2 font-raleway">
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-light font-raleway"
              >
                <option>Price Range</option>
                <option>$0 - $100</option>
                <option>$100 - $500</option>
                <option>$500+</option>
              </select>
            </div>

            {/* Cities */}
            <div className="border border-gray-300 rounded-full px-4 py-2 font-raleway">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-light font-raleway"
              >
                <option>All Cities</option>
                <option>Karachi</option>
                <option>Lahore</option>
                <option>Islamabad</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button className="bg-green-700 hover:bg-green-600 sm:w-[124px] h-[57px] text-white px-8 py-4 text-lg rounded-full shadow-lg font-medium transition w-full font-raleway">
        Search
      </button>
    </div>
  );
}

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import React from "react";

interface DesktopMenuProps {
  carsOpen: boolean;
  setCarsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productsOpen: boolean;
  setProductsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  textColor?: string;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({
  carsOpen,
  setCarsOpen,
  productsOpen,
  setProductsOpen,
  textColor = "text-white",
}) => {
  return (
    <ul
      className={`hidden md:flex space-x-6 font-medium text-[16px] ${textColor} font-raleway`}
    >
      {/* Cars Dropdown */}
      <li className="relative cursor-pointer hover:text-gray-400 font-raleway">
        <div
          className="flex items-center gap-1"
          onClick={() => setCarsOpen(!carsOpen)}
        >
          Cars
          <FaChevronDown
            size={12}
            className={`transition-transform ${carsOpen ? "rotate-180" : ""}`}
          />
        </div>
        {carsOpen && (
          <ul className="absolute left-0 mt-2 bg-white text-black rounded shadow-md w-48 text-[16px] font-raleway z-50">
            <li className="px-4 py-2 hover:bg-gray-400 cursor-pointer whitespace-nowrap">
              <Link href="/features/automotive/collection">Cars Collection</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-400 cursor-pointer whitespace-nowrap">
              <Link href="/features/automotive/accessories">Cars Accessories</Link>
            </li>
          </ul>
        )}
      </li>

      {/* Products Mega Menu - Centered */}
      <li className="relative cursor-pointer hover:text-gray-400 font-raleway">
        <div
          className="flex items-center gap-1"
          onClick={() => setProductsOpen(!productsOpen)}
        >
          Products
          <FaChevronDown
            size={12}
            className={`transition-transform ${
              productsOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {productsOpen && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-black rounded-xl shadow-xl w-[1320px] max-h-[320px] overflow-y-auto p-6 pl-8 font-raleway z-50"
          >
            <div className="grid grid-cols-4 gap-6 divide-x">
              {/* Car Accessories */}
              <div className="pr-8">
                <h3 className="font-semibold mb-2">Car Accessories</h3>
                <ul className="space-y-1">
                  <li className="hover:text-green-400 cursor-pointer whitespace-nowrap">
                    Seat Covers
                  </li>
                  <li className="hover:text-green-400 cursor-pointer whitespace-nowrap">
                    Floor Mats
                  </li>
                  <li className="hover:text-green-400 cursor-pointer whitespace-nowrap">
                    Steering Wheel Covers
                  </li>
                  <li className="hover:text-green-400 cursor-pointer whitespace-nowrap">
                    Dashboard Covers
                  </li>
                  <li className="hover:text-green-400 cursor-pointer whitespace-nowrap">
                    Sun Shades
                  </li>
                </ul>
              </div>

              {/* Interior Accessories */}
              <div className="px-6">
                <h3 className="font-semibold mb-2">Interior Accessories</h3>
                <ul className="space-y-1">
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    LED Lights
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Mobile Holders
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Organizers
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Cushions
                  </li>
                </ul>
              </div>

              {/* Exterior Accessories */}
              <div className="px-6">
                <h3 className="font-semibold mb-2">Exterior Accessories</h3>
                <ul className="space-y-1">
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Alloy Wheels
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Body Kits
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Car Covers
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Roof Racks
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Spoilers
                  </li>
                </ul>
              </div>

              {/* Electronics */}
              <div className="pl-6">
                <h3 className="font-semibold mb-2">Electronics</h3>
                <ul className="space-y-1">
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Dash Cameras
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Parking Sensors
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Reverse Cameras
                  </li>
                  <li className="hover:text-green-600 cursor-pointer whitespace-nowrap">
                    Chargers & Cables
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </li>

      {/* Other Nav Links */}
      <li className="cursor-pointer hover:text-gray-400 font-raleway">
        <Link href="/features/automotive/blog">Blog</Link>
      </li>
      <li className="cursor-pointer hover:text-gray-400 font-raleway">
        <Link href="/features/automotive/gallery">Gallery</Link>
      </li>
      <li className="cursor-pointer hover:text-gray-400 font-raleway">
        <Link href="/contact">Contact</Link>
      </li>
    </ul>
  );
};

export default DesktopMenu;

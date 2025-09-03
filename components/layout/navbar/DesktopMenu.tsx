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
      <li className="relative">
        <button
          className={`flex items-center gap-1 hover:text-gray-400 ${textColor}`}
          onClick={() => setCarsOpen(!carsOpen)}
        >
          Cars
          <FaChevronDown
            size={12}
            className={`transition-transform ${carsOpen ? "rotate-180" : ""}`}
          />
        </button>
        {carsOpen && (
          <ul className="absolute left-0 mt-2 bg-white text-black rounded shadow-md w-48 text-[16px] font-raleway z-50">
            <li>
              <Link
                href="/features/automotive/collection"
                className="block px-4 py-2 hover:bg-gray-400 whitespace-nowrap"
              >
                Cars Collection
              </Link>
            </li>
            <li>
              <Link
                href="/features/automotive/accessories"
                className="block px-4 py-2 hover:bg-gray-400 whitespace-nowrap"
              >
                Cars Accessories
              </Link>
            </li>
          </ul>
        )}
      </li>

      {/* Products Mega Menu - Centered */}
      <li className="relative">
        <button
          className={`flex items-center gap-1 hover:text-gray-400 ${textColor}`}
          onClick={() => setProductsOpen(!productsOpen)}
        >
          Products
          <FaChevronDown
            size={12}
            className={`transition-transform ${
              productsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {productsOpen && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-black rounded-xl shadow-xl w-[1320px] max-h-[320px] overflow-y-auto p-6 pl-8 font-raleway z-50"
          >
            <div className="grid grid-cols-4 gap-6 divide-x">
              {/* Car Accessories */}
              <div className="pr-8">
                <h3 className="font-semibold mb-2">Car Accessories</h3>
                <ul className="space-y-1">
                  {[
                    "Seat Covers",
                    "Floor Mats",
                    "Steering Wheel Covers",
                    "Dashboard Covers",
                    "Sun Shades",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/features/automotive/accessories?category=${item
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="hover:text-green-400 whitespace-nowrap block"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interior Accessories */}
              <div className="px-6">
                <h3 className="font-semibold mb-2">Interior Accessories</h3>
                <ul className="space-y-1">
                  {[
                    "LED Lights",
                    "Mobile Holders",
                    "Organizers",
                    "Cushions",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/features/automotive/accessories?category=${item
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="hover:text-green-600 whitespace-nowrap block"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exterior Accessories */}
              <div className="px-6">
                <h3 className="font-semibold mb-2">Exterior Accessories</h3>
                <ul className="space-y-1">
                  {[
                    "Alloy Wheels",
                    "Body Kits",
                    "Car Covers",
                    "Roof Racks",
                    "Spoilers",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/features/automotive/accessories?category=${item
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="hover:text-green-600 whitespace-nowrap block"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Electronics */}
              <div className="pl-6">
                <h3 className="font-semibold mb-2">Electronics</h3>
                <ul className="space-y-1">
                  {[
                    "Dash Cameras",
                    "Parking Sensors",
                    "Reverse Cameras",
                    "Chargers & Cables",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/features/automotive/accessories?category=${item
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="hover:text-green-600 whitespace-nowrap block"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </li>

      {/* Other Nav Links */}
      <li>
        <Link 
          href="/features/automotive/blog" 
          className={`hover:text-gray-400 ${textColor} block py-2`}
        >
          Blog
        </Link>
      </li>
      <li>
        <Link 
          href="/features/automotive/gallery" 
          className={`hover:text-gray-400 ${textColor} block py-2`}
        >
          Gallery
        </Link>
      </li>
      <li>
        <Link 
          href="/features/general/contact" 
          className={`hover:text-gray-400 ${textColor} block py-2`}
        >
          Contact
        </Link>
      </li>
    </ul>
  );
};

export default DesktopMenu;

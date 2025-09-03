import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import React from "react";
import { usePathname } from "next/navigation";

interface DesktopMenuProps {
  carsOpen: boolean;
  setCarsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productsOpen: boolean;
  setProductsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  textColor?: string;
  currentPath?: string;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({
  carsOpen,
  setCarsOpen,
  productsOpen,
  setProductsOpen,
  textColor = "text-white",
  currentPath = "",
}) => {
  const pathname = usePathname();
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };
  
  // Check if any cars submenu is active
  const isCarsActive = isActive("/cars") || isActive("/car");
  
  // Check if any products submenu is active
  const isProductsActive = isActive("/features/automotive/accessories");
  
  // Check if blog is active
  const isBlogActive = isActive("/features/automotive/blog");
  
  // Check if gallery is active
  const isGalleryActive = isActive("/features/automotive/gallery");
  
  // Check if contact is active
  const isContactActive = isActive("/features/general/contact");

  return (
    <ul
      className={`flex space-x-8 xl:space-x-10 font-medium text-[15px] lg:text-[16px] ${textColor} font-raleway items-center`}
    >
      {/* Cars Dropdown */}
      <li className="relative" data-dropdown>
        <button
          className={`flex items-center gap-2 hover:text-gray-400 transition-all duration-200 py-2 px-3 rounded-lg relative
            ${isCarsActive ? 'text-green-400 font-semibold bg-green-50/20' : textColor}
          `}
          onClick={() => setCarsOpen(!carsOpen)}
          aria-expanded={carsOpen}
        >
          Cars
          <FaChevronDown
            size={12}
            className={`transition-transform duration-300 ${carsOpen ? "rotate-180" : ""}`}
          />
        </button>
        <div className={`absolute left-0 mt-2 transition-all duration-300 ease-out transform origin-top ${
          carsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}>
          <ul className="bg-white text-black rounded-xl shadow-2xl w-56 text-[14px] font-raleway z-50 border border-gray-100 overflow-hidden">
            <li>
              <Link
  href="/features/automotive/collection"
  className={`block px-5 py-4 hover:bg-gray-50 whitespace-nowrap transition-all duration-200 border-b border-gray-50 last:border-b-0
    ${isActive("/features/automotive/collection") ? 'bg-gradient-to-r from-green-50 to-green-25 text-green-700 font-semibold' : 'hover:text-green-600'}
  `}
  onClick={() => setCarsOpen(false)}
>
  Cars Collection
</Link>

            </li>
            <li>
              <Link
                href="/features/automotive/accessories"
                className={`block px-5 py-4 hover:bg-gray-50 whitespace-nowrap transition-all duration-200
                  ${isActive("/features/automotive/accessories") ? 'bg-gradient-to-r from-green-50 to-green-25 text-green-700 font-semibold' : 'hover:text-green-600'}
                `}
                onClick={() => setCarsOpen(false)}
              >
                Cars Accessories
              </Link>
            </li>
          </ul>
        </div>
      </li>

      {/* Products Mega Menu - Centered */}
      <li className="relative" data-dropdown>
        <button
          className={`flex items-center gap-2 hover:text-gray-400 transition-all duration-200 py-2 px-3 rounded-lg relative
            ${isProductsActive ? 'text-green-400 font-semibold bg-green-50/20' : textColor}
          `}
          onClick={() => setProductsOpen(!productsOpen)}
          aria-expanded={productsOpen}
        >
          Products
          <FaChevronDown
            size={12}
            className={`transition-transform duration-300 ${
              productsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ease-out origin-top ${
          productsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}>
          <div
            className="bg-white text-black rounded-xl shadow-2xl w-[85vw] sm:w-[90vw] max-w-[1100px] max-h-[450px] overflow-y-auto p-4 sm:p-6 font-raleway z-50 border border-gray-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              {/* Car Accessories */}
              <div className="pr-0 sm:pr-4 lg:pr-6 pb-4 sm:pb-0">
                <h3 className="font-semibold mb-3 text-gray-800 text-sm sm:text-base">Car Accessories</h3>
                <ul className="space-y-1 sm:space-y-2">
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
                        className="hover:text-green-600 whitespace-nowrap block py-2 px-3 rounded-lg hover:bg-green-50 transition-all duration-200 text-xs sm:text-sm"
                        onClick={() => setProductsOpen(false)}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interior Accessories */}
              <div className="px-0 sm:px-2 lg:px-6 pb-4 sm:pb-0">
                <h3 className="font-semibold mb-3 text-gray-800 text-sm sm:text-base">Interior Accessories</h3>
                <ul className="space-y-1 sm:space-y-2">
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
                        className="hover:text-green-600 whitespace-nowrap block py-2 px-3 rounded-lg hover:bg-green-50 transition-all duration-200 text-xs sm:text-sm"
                        onClick={() => setProductsOpen(false)}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exterior Accessories */}
              <div className="px-0 sm:px-2 lg:px-6 pb-4 sm:pb-0">
                <h3 className="font-semibold mb-3 text-gray-800 text-sm sm:text-base">Exterior Accessories</h3>
                <ul className="space-y-1 sm:space-y-2">
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
                        className="hover:text-green-600 whitespace-nowrap block py-2 px-3 rounded-lg hover:bg-green-50 transition-all duration-200 text-xs sm:text-sm"
                        onClick={() => setProductsOpen(false)}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Electronics */}
              <div className="pl-0 sm:pl-2 lg:pl-6">
                <h3 className="font-semibold mb-3 text-gray-800 text-sm sm:text-base">Electronics</h3>
                <ul className="space-y-1 sm:space-y-2">
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
                        className="hover:text-green-600 whitespace-nowrap block py-2 px-3 rounded-lg hover:bg-green-50 transition-all duration-200 text-xs sm:text-sm"
                        onClick={() => setProductsOpen(false)}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>

      {/* Other Nav Links */}
      <li>
        <Link 
          href="/features/automotive/blog" 
          className={`hover:text-gray-400 transition-all duration-200 block py-2 px-3 rounded-lg relative
            ${isBlogActive ? 'text-green-400 font-semibold bg-green-50/20' : textColor}
          `}
        >
          Blog
        </Link>
      </li>
      <li>
        <Link 
          href="/features/automotive/gallery" 
          className={`hover:text-gray-400 transition-all duration-200 block py-2 px-3 rounded-lg relative
            ${isGalleryActive ? 'text-green-400 font-semibold bg-green-50/20' : textColor}
          `}
        >
          Gallery
        </Link>
      </li>
      <li>
        <Link 
          href="/features/general/contact" 
          className={`hover:text-gray-400 transition-all duration-200 block py-2 px-3 rounded-lg relative
            ${isContactActive ? 'text-green-400 font-semibold bg-green-50/20' : textColor}
          `}
        >
          Contact
        </Link>
      </li>
    </ul>
  );
};

export default DesktopMenu;

import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import React from "react";
import CallToActionButton from "./CallToActionButton";

interface MobileMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileCarsOpen: boolean;
  setMobileCarsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileProductsOpen: boolean;
  setMobileProductsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  textColor?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  setOpen,
  mobileCarsOpen,
  setMobileCarsOpen,
  mobileProductsOpen,
  setMobileProductsOpen,
  textColor = "text-white",
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-10 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer with glassmorphism */}
      <div
        className={`md:hidden fixed top-0 left-0 w-3/4 max-w-xs h-full
          bg-white/10 backdrop-blur-lg border border-white/30
          z-20 flex flex-col items-start justify-start pt-24 px-6
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} font-raleway
        `}
      >
        <ul className={`space-y-4 text-[16px] font-medium w-full ${textColor}`}>
          <li>
            <Link href="/" onClick={() => setOpen(false)} className="font-raleway">
              Home
            </Link>
          </li>

          {/* Cars */}
          <li className="w-full">
            <button
              className="flex justify-between items-center w-full py-2 font-raleway"
              onClick={() => setMobileCarsOpen(!mobileCarsOpen)}
            >
              <span>Cars</span>
              <FaChevronDown
                className={`transition-transform ${mobileCarsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileCarsOpen && (
              <ul className="pl-4 mt-2 space-y-2 font-raleway">
                <li>
                  <Link 
                    href="/features/automotive/collection" 
                    onClick={() => setOpen(false)} 
                    className="block py-1 hover:text-gray-300 transition-colors"
                  >
                    Cars Collection
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/features/automotive/accessories" 
                    onClick={() => setOpen(false)} 
                    className="block py-1 hover:text-gray-300 transition-colors"
                  >
                    Cars Accessories
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Products */}
          <li className="w-full">
            <button
              className="flex justify-between items-center w-full py-2 font-raleway"
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
            >
              <span>Products</span>
              <FaChevronDown
                className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileProductsOpen && (
              <ul className="pl-4 mt-2 space-y-2 font-raleway">
                {[
                  { name: "Seat Covers", category: "car-accessories" },
                  { name: "Floor Mats", category: "car-accessories" },
                  { name: "Steering Wheel Covers", category: "car-accessories" },
                  { name: "Dashboard Covers", category: "car-accessories" },
                  { name: "Sun Shades", category: "car-accessories" },
                  { name: "LED Lights", category: "interior-accessories" },
                  { name: "Mobile Holders", category: "interior-accessories" },
                  { name: "Organizers", category: "interior-accessories" },
                  { name: "Cushions", category: "interior-accessories" },
                  { name: "Alloy Wheels", category: "exterior-accessories" },
                  { name: "Body Kits", category: "exterior-accessories" },
                  { name: "Car Covers", category: "exterior-accessories" },
                  { name: "Roof Racks", category: "exterior-accessories" },
                  { name: "Spoilers", category: "exterior-accessories" },
                  { name: "Dash Cameras", category: "electronics" },
                  { name: "Parking Sensors", category: "electronics" },
                  { name: "Reverse Cameras", category: "electronics" },
                  { name: "Chargers & Cables", category: "electronics" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={`/features/automotive/accessories?category=${item.category}`}
                      onClick={() => setOpen(false)}
                      className="block py-1 hover:text-gray-300 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link 
              href="/features/automotive/blog" 
              onClick={() => setOpen(false)} 
              className="block py-2 hover:text-gray-300 transition-colors"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              href="/features/automotive/gallery" 
              onClick={() => setOpen(false)} 
              className="block py-2 hover:text-gray-300 transition-colors"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link 
              href="/features/general/contact" 
              onClick={() => setOpen(false)} 
              className="block py-2 hover:text-gray-300 transition-colors"
            >
              Contact
            </Link>
          </li>

          {/* CTA */}
          <li className="w-full">
            <CallToActionButton fullWidth isBlackTheme={false} />
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileMenu;

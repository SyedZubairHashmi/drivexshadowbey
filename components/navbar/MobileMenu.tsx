import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import React from "react";

// Placeholder for your actual CallToActionButton component
const CallToActionButton: React.FC<{ fullWidth?: boolean }> = ({ fullWidth }) => (
  <button
    className={`border border-gray-400 text-white rounded-full bg-black hover:bg-gray-800 py-2 text-[16px] ${
      fullWidth ? "w-full" : ""
    } font-raleway`}
  >
    Get My Dream Car
  </button>
);

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
    <div
      className={`md:hidden fixed top-0 left-0 w-full h-full bg-black flex flex-col items-start justify-start pt-24 px-6 transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"} z-20 font-raleway`}
    >
      <ul className="space-y-4 text-[16px] font-medium w-full text-white font-raleway">
        <li>
          <Link href="/" onClick={() => setOpen(false)} className="font-raleway">
            Home
          </Link>
        </li>

        {/* Cars */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer font-raleway"
            onClick={() => setMobileCarsOpen(!mobileCarsOpen)}
          >
            Cars{" "}
            <FaChevronDown
              className={`transition-transform ${mobileCarsOpen ? "rotate-180" : ""}`}
            />
          </div>
          {mobileCarsOpen && (
            <ul className="pl-4 mt-2 space-y-2 font-raleway">
              <li>
                <Link href="/cars-collection" onClick={() => setOpen(false)} className="font-raleway">
                  Cars Collection
                </Link>
              </li>
              <li>
                <Link href="/cars-accessories" onClick={() => setOpen(false)} className="font-raleway">
                  Cars Accessories
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Products */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer font-raleway"
            onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
          >
            Products{" "}
            <FaChevronDown
              className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
            />
          </div>
          {mobileProductsOpen && (
            <ul className="pl-4 mt-2 space-y-2 font-raleway">
              {[
                "Seat Covers",
                "Floor Mats",
                "Steering Wheel Covers",
                "Dashboard Covers",
                "Sun Shades",
                "LED Lights",
                "Mobile Holders",
                "Organizers",
                "Cushions",
                "Alloy Wheels",
                "Body Kits",
                "Car Covers",
                "Roof Racks",
                "Spoilers",
                "Dash Cameras",
                "Parking Sensors",
                "Reverse Cameras",
                "Chargers & Cables",
              ].map((item, idx) => (
                <li key={idx} className="font-raleway">{item}</li>
              ))}
            </ul>
          )}
        </li>

        <li>
          <Link href="/blog" onClick={() => setOpen(false)} className="font-raleway">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/about" onClick={() => setOpen(false)} className="font-raleway">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" onClick={() => setOpen(false)} className="font-raleway">
            Contact
          </Link>
        </li>

        {/* CTA */}
        <li className="w-full">
          <CallToActionButton fullWidth />
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;

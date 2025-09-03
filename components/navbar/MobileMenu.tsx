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
                  <Link href="/features/automotive/collection" onClick={() => setOpen(false)} className="font-raleway">
                    Cars Collection
                  </Link>
                </li>
                <li>
                  <Link href="/features/automotive/accessories" onClick={() => setOpen(false)} className="font-raleway">
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
                  <li key={idx} className="font-raleway">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link href="/features/automotive/blog" onClick={() => setOpen(false)} className="font-raleway">
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
            <CallToActionButton fullWidth isBlackTheme={false} />
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileMenu;

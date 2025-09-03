"use client";

import { useState } from "react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import CallToActionButton from "./CallToActionButton";
import Logo from "./logo";

export default function Navbar() {
  const [carsOpen, setCarsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full h-16 flex items-center justify-between 
      px-6 lg:px-10 bg-black/20 backdrop-blur-md shadow-md z-50"
    >
      {/* Left: Logo */}
      <div className="hover:scale-105 transition-transform duration-300">
        <Logo />
      </div>

      {/* Center: Desktop Menu */}
      <div className="hidden lg:flex space-x-8 font-medium text-gray-800">
        <DesktopMenu
          carsOpen={carsOpen}
          setCarsOpen={setCarsOpen}
          productsOpen={productsOpen}
          setProductsOpen={setProductsOpen}
        />
      </div>

      {/* Right: CTA + Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* CTA Button */}
        <div className="hidden lg:block">
          <button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white 
            px-6 py-2 rounded-full shadow-lg font-semibold 
            hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Get My Dream Car
          </button>
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </nav>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "./logo";
import DesktopMenu from "./DesktopMenu";
import CallToActionButton from "./CallToActionButton";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCarsOpen, setMobileCarsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [carsOpen, setCarsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  // Check if we are on car detail page (adjust route check as needed)
  const isCarDetailPage = pathname.includes("/car/");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;

      if (scrollPercent > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 py-3 px-4 md:px-12 flex items-center justify-between transition-colors duration-300
        ${scrolled ? "bg-black/90" : ""}
        ${isCarDetailPage ? "text-black" : "text-white"}
      `}
    >
      {/* Logo with black bg when on car detail page */}
      <div className={`${isCarDetailPage ? "bg-black p-1 rounded" : ""}`}>
        <Logo />
      </div>

      {/* Desktop Menu */}
      <DesktopMenu
        carsOpen={carsOpen}
        setCarsOpen={setCarsOpen}
        productsOpen={productsOpen}
        setProductsOpen={setProductsOpen}
        textColor={isCarDetailPage ? "text-black" : "text-white"}
      />

      {/* CTA Button */}
      <div className="hidden md:block">
        <CallToActionButton isBlackTheme={isCarDetailPage} />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden z-30 flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`
            transition-colors duration-300 px-2 py-1 rounded
            ${
              isCarDetailPage
                ? "text-white hover:text-black hover:bg-white"
                : "text-white hover:text-black hover:bg-transparent"
            }
          `}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
        mobileCarsOpen={mobileCarsOpen}
        setMobileCarsOpen={setMobileCarsOpen}
        mobileProductsOpen={mobileProductsOpen}
        setMobileProductsOpen={setMobileProductsOpen}
        textColor={isCarDetailPage ? "text-black" : "text-white"}
      />
    </nav>
  );
};

export default Navbar;

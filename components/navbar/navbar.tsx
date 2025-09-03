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

  // Page detection
  const isCarDetailPage = pathname.includes("/car/");
  const isContactPage = pathname === "/contact";

  // Detect scroll to toggle background and text
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;

      setScrolled(scrollPercent > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine navbar color theme
  const isScrolledNavbar = scrolled;
  const isLightPage = isContactPage || isCarDetailPage;
  const useWhiteIcon = isScrolledNavbar || !isLightPage;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 py-3 px-4 md:px-12 flex items-center justify-between transition-colors duration-300
        ${scrolled ? "bg-black/90" : ""}
        ${useWhiteIcon ? "text-white" : "text-black"}
      `}
    >
      {/* Logo */}
      <div className={`${!useWhiteIcon ? "bg-black p-1 rounded" : ""}`}>
        <Logo />
      </div>

      {/* Desktop Menu */}
      <DesktopMenu
        carsOpen={carsOpen}
        setCarsOpen={setCarsOpen}
        productsOpen={productsOpen}
        setProductsOpen={setProductsOpen}
        textColor={useWhiteIcon ? "text-white" : "text-black"}
      />

      {/* CTA Button */}
      <div className="hidden md:block">
        <CallToActionButton isBlackTheme={!useWhiteIcon} />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden z-30 flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`
            transition-colors duration-300 px-2 py-1 rounded
            ${
              useWhiteIcon
                ? "text-white hover:text-black"
                : "text-black hover:text-white"
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
        textColor={useWhiteIcon ? "text-white" : "text-black"}
      />
    </nav>
  );
};

export default Navbar;

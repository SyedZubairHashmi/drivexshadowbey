"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [carsOpen, setCarsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button onClick={() => setOpen(!open)} className="text-gray-800">
        {open ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col space-y-4 p-6 z-50 max-h-[90vh] overflow-y-auto">
          {/* Cars Dropdown */}
          <div>
            <button
              onClick={() => setCarsOpen(!carsOpen)}
              className="flex justify-between items-center w-full"
            >
              Cars
              <FaChevronDown
                className={`ml-2 transform transition-transform ${
                  carsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {carsOpen && (
              <div className="ml-4 mt-2 flex flex-col space-y-2 text-sm">
                <Link
                  href="/features/automotive/collection"
                  onClick={() => setOpen(false)}
                >
                  Car Collection
                </Link>
                <Link
                  href="/features/automotive/accessories"
                  onClick={() => setOpen(false)}
                >
                  Car Accessories
                </Link>
              </div>
            )}
          </div>

          {/* Products Mega Menu */}
          <div>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className="flex justify-between items-center w-full"
            >
              Products
              <FaChevronDown
                className={`ml-2 transform transition-transform ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {productsOpen && (
              <div className="ml-4 mt-2 grid grid-cols-2 gap-4 text-sm">
                <Link href="/products/interior" onClick={() => setOpen(false)}>
                  Interior
                </Link>
                <Link href="/products/exterior" onClick={() => setOpen(false)}>
                  Exterior
                </Link>
                <Link href="/products/electronics" onClick={() => setOpen(false)}>
                  Electronics
                </Link>
                <Link href="/products/performance" onClick={() => setOpen(false)}>
                  Performance
                </Link>
                <Link href="/products/wheels" onClick={() => setOpen(false)}>
                  Wheels
                </Link>
                <Link href="/products/lights" onClick={() => setOpen(false)}>
                  Lights
                </Link>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          <Link href="/features/automotive/blog" onClick={() => setOpen(false)}>
            Blog
          </Link>
          <Link href="/features/automotive/gallery" onClick={() => setOpen(false)}>
            Gallery
          </Link>
          <Link href="/features/general/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}

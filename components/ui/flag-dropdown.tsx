"use client";
import { useState } from "react";
import Image from "next/image";

const countries = [
  { name: "United States", flag: "/flags/usa.svg", code: "USD", rate: 200 },
  { name: "Australia", flag: "/flags/australia.svg", code: "AUD", rate: 135 },
  { name: "Japan", flag: "/flags/japan.svg", code: "JPY", rate: 1.35 },
  { name: "UK", flag: "/flags/uk.svg", code: "GBP", rate: 250 },
  { name: "Korea", flag: "/flags/korea.svg", code: "KRW", rate: 0.15 },
];

interface FlagDropdownProps {
  onSelect?: (country: { name: string; flag: string; code: string; rate: number }) => void;
  selectedCountry?: { name: string; flag: string; code: string; rate: number } | null;
  className?: string;
  hideOtherFlags?: boolean; // New prop to hide other flags when one is selected
}

export default function FlagDropdown({ onSelect, selectedCountry, className = "", hideOtherFlags = false }: FlagDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (country: { name: string; flag: string; code: string; rate: number }) => {
    onSelect?.(country);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          height: '45px',
          padding: '10px 18px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '50px',
          border: '1px solid rgba(0, 0, 0, 0.24)',
          background: 'white',
          cursor: 'pointer'
        }}
      >
                        <span className="flex items-center gap-2">
                  {selectedCountry ? (
                    <Image 
                      src={selectedCountry.flag} 
                      alt={selectedCountry.name} 
                      width={24} 
                      height={16} 
                      className="rounded border" 
                    />
                  ) : (
                    <span>🌍</span>
                  )}
                  <span>{selectedCountry ? selectedCountry.name : "Actions"}</span>
                </span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="py-1">
            {countries
              .filter(country => {
                // If hideOtherFlags is true and a country is selected, only show the selected country
                if (hideOtherFlags && selectedCountry) {
                  return country.name === selectedCountry.name;
                }
                // Otherwise show all countries
                return true;
              })
              .map((country) => (
              <button
                key={country.name}
                type="button"
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleSelect(country)}
              >
                <Image 
                  src={country.flag} 
                  alt={country.name} 
                  width={24} 
                  height={16} 
                  className="rounded border" 
                />
                <span>{country.name}</span>
                <span className="text-gray-500 ml-auto">({country.code})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

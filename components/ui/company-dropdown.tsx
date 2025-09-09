"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CompanyDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

const COMPANIES = [
  // Japanese Brands
  "TOYOTA", "HONDA", "SUZUKI", "DAIHATSU", "NISSAN", "MAZDA", "ISUZU", "MITSUBISHI",
  // German Luxury Brands
  "MERCEDES-BENZ", "BMW", "AUDI", "PORSCHE", "VOLKSWAGEN",
  // Japanese Luxury Brands
  "LEXUS", "ACURA", "INFINITI",
  // Korean Brands
  "KIA", "HYUNDAI", "GENESIS",
  // Chinese Brands
  "BYD", "GEELY", "GREAT WALL", "CHERY",
  // American Brands
  "FORD", "CHEVROLET", "CADILLAC", "LINCOLN", "JEEP", "DODGE", "CHRYSLER",
  // Italian Brands
  "FERRARI", "LAMBORGHINI", "MASERATI", "ALFA ROMEO", "FIAT",
  // British Brands
  "BENTLEY", "ROLLS-ROYCE", "ASTON MARTIN", "JAGUAR", "LAND ROVER", "MINI",
  // French Brands
  "PEUGEOT", "RENAULT", "CITROEN",
  // Swedish Brands
  "VOLVO", "SAAB",
  // Other Brands
  "SUBARU", "MITSUOKA", "DATSUN"
];

export default function CompanyDropdown({ 
  value, 
  onChange, 
  placeholder = "Select Company", 
  className = "",
  style = {}
}: CompanyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(COMPANIES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter companies based on search term (fuzzy matching)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(COMPANIES);
      return;
    }

    const filtered = COMPANIES.filter(company => {
      const companyLower = company.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      // Exact match
      if (companyLower === searchLower) return true;
      
      // Starts with search term
      if (companyLower.startsWith(searchLower)) return true;
      
      // Contains search term
      if (companyLower.includes(searchLower)) return true;
      
      // Fuzzy matching - check if all characters in search term exist in company name in order
      let searchIndex = 0;
      for (let i = 0; i < companyLower.length && searchIndex < searchLower.length; i++) {
        if (companyLower[i] === searchLower[searchIndex]) {
          searchIndex++;
        }
      }
      return searchIndex === searchLower.length;
    });

    setFilteredCompanies(filtered);
  }, [searchTerm]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If user types a company name that matches exactly, select it
    const exactMatch = COMPANIES.find(company => 
      company.toLowerCase() === newValue.toLowerCase()
    );
    
    if (exactMatch && exactMatch !== value) {
      onChange(exactMatch);
      setSearchTerm("");
      setIsOpen(false);
    } else if (newValue !== value) {
      // Update the value as user types for fuzzy matching
      onChange(newValue);
    }
  };

  // Handle company selection
  const handleCompanySelect = (company: string) => {
    onChange(company);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCompanies.length > 0) {
        handleCompanySelect(filteredCompanies[0]);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-[42px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{
            ...style,
            paddingRight: '40px'
          }}
        />
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearchTerm(value);
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <button
                key={company}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                onClick={() => handleCompanySelect(company)}
              >
                {company}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No companies found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

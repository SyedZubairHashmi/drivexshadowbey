"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ModelDropdownProps {
  value: string;
  onChange: (value: string) => void;
  company: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Model data organized by company
const COMPANY_MODELS: { [key: string]: string[] } = {
  "TOYOTA": [
    "COROLLA", "CAMRY", "RAV4", "HIGHLANDER", "PRADO", "LAND CRUISER", "YARIS", "AVANZA", "INNOVA", "FORTUNER", "HILUX", "COASTER", "HIACE"
  ],
  "HONDA": [
    "CIVIC", "ACCORD", "CR-V", "PILOT", "FIT", "CITY", "BR-V", "HR-V", "PASSPORT", "RIDGELINE", "ODYSSEY", "INSIGHT"
  ],
  "SUZUKI": [
    "SWIFT", "BALENO", "CELERIO", "DZIRE", "ERTIGA", "XL7", "JIMNY", "VITARA", "S-CROSS", "CIAZ", "IGNIS", "S-PRESSO"
  ],
  "DAIHATSU": [
    "TERIOS", "SIRION", "CHARADE", "MATERIA", "COPEN", "MOVE", "TANTO", "WAKE", "ROCKY", "AYLA", "SIGRA", "GRAN MAX"
  ],
  "NISSAN": [
    "SENTRA", "ALTIMA", "MAXIMA", "ROGUE", "MURANO", "PATHFINDER", "ARMADA", "VERSA", "KICKS", "LEAF", "GT-R", "370Z", "JUKE", "NV200"
  ],
  "MAZDA": [
    "MAZDA3", "MAZDA6", "CX-3", "CX-5", "CX-9", "MX-5", "RX-7", "RX-8", "TRIBUTE", "MPV", "B-SERIES", "MIATA"
  ],
  "ISUZU": [
    "D-MAX", "MU-X", "NPR", "NQR", "FTR", "GIGA", "ELF", "PICKUP", "TROOPER", "RODEO", "ASCENDER", "I-280", "I-350"
  ],
  "MITSUBISHI": [
    "LANCER", "GALANT", "OUTLANDER", "ECLIPSE", "MIRAGE", "ASX", "PAJERO", "MONTERO", "TRITON", "L200", "CANTER", "FUSO"
  ],
  "MERCEDES-BENZ": [
    "C-CLASS", "E-CLASS", "S-CLASS", "A-CLASS", "B-CLASS", "GLA", "GLC", "GLE", "GLS", "G-CLASS", "CLS", "SL", "AMG GT", "SPRINTER"
  ],
  "BMW": [
    "1 SERIES", "2 SERIES", "3 SERIES", "4 SERIES", "5 SERIES", "6 SERIES", "7 SERIES", "8 SERIES", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "I3", "I8"
  ],
  "AUDI": [
    "A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4", "Q5", "Q7", "Q8", "TT", "R8", "E-TRON", "RS3", "RS4", "RS5", "RS6", "RS7"
  ],
  "PORSCHE": [
    "911", "CAYENNE", "MACAN", "PANAMERA", "TAYCAN", "BOXSTER", "CAYMAN", "718", "918 SPYDER", "CARRERA GT"
  ],
  "VOLKSWAGEN": [
    "GOLF", "JETTA", "PASSAT", "CC", "ARTEON", "TIGUAN", "ATLAS", "TOUAREG", "BEETLE", "POLO", "VENTO", "AMAROK", "CRAFTER", "TRANSPORTER"
  ],
  "LEXUS": [
    "IS", "ES", "GS", "LS", "CT", "UX", "NX", "RX", "GX", "LX", "LC", "RC", "SC", "LFA"
  ],
  "ACURA": [
    "ILX", "TLX", "RLX", "RDX", "MDX", "NSX", "INTEGRA", "LEGEND", "VIGOR", "CL", "RSX", "TSX"
  ],
  "INFINITI": [
    "Q50", "Q60", "Q70", "QX30", "QX50", "QX60", "QX70", "QX80", "G35", "G37", "M35", "M37", "FX35", "FX37", "EX35", "EX37"
  ],
  "KIA": [
    "RIO", "FORTE", "OPTIMA", "STINGER", "SOUL", "SPORTAGE", "SORENTO", "TELLURIDE", "SEDONA", "NIRO", "EV6", "CARNIVAL"
  ],
  "HYUNDAI": [
    "ACCENT", "ELANTRA", "SONATA", "GENESIS", "VELOSTER", "TUCSON", "SANTA FE", "PALISADE", "VENUE", "KONA", "IONIQ", "NEXO"
  ],
  "GENESIS": [
    "G70", "G80", "G90", "GV70", "GV80", "COUPE", "SEDAN"
  ],
  "BYD": [
    "F3", "F6", "G3", "G6", "L3", "S6", "TANG", "HAN", "QIN", "SONG", "YUAN", "SEAL", "DOLPHIN", "ATTO 3"
  ],
  "GEELY": [
    "EMGRAND", "BINYUE", "HAOYUE", "XINGYUE", "JIAJI", "BOYUE", "ATLAS", "COOLRAY", "AZKARRA", "GC9", "LC", "MK"
  ],
  "GREAT WALL": [
    "HAVAL H1", "HAVAL H2", "HAVAL H6", "HAVAL H8", "HAVAL H9", "WINGLE", "DEER", "SAFE", "PERI", "FLORID", "COOLBEAR", "V80"
  ],
  "CHERY": [
    "QQ", "QQ3", "QQ6", "A1", "A3", "A5", "E5", "TIGGO", "TIGGO 3", "TIGGO 5", "TIGGO 7", "TIGGO 8", "ARRIZO", "FULWIN"
  ],
  "FORD": [
    "FOCUS", "FIESTA", "FUSION", "TAURUS", "MUSTANG", "ESCAPE", "EDGE", "EXPLORER", "EXPEDITION", "F-150", "F-250", "F-350", "RANGER", "ECOSPORT", "BRONCO"
  ],
  "CHEVROLET": [
    "SPARK", "SONIC", "CRUZE", "MALIBU", "IMPALA", "CAMARO", "CORVETTE", "TRAX", "EQUINOX", "TRAVERSE", "TAHOE", "SUBURBAN", "SILVERADO", "COLORADO"
  ],
  "CADILLAC": [
    "ATS", "CTS", "XTS", "CT4", "CT5", "CT6", "XT4", "XT5", "XT6", "ESCALADE", "SRX", "ELR", "XLR", "DTS", "STS"
  ],
  "LINCOLN": [
    "MKZ", "MKS", "MKT", "MKX", "MKX", "NAVIGATOR", "CONTINENTAL", "CORSAIR", "AVIATOR", "NAUTILUS", "ZEPHYR", "LS", "TOWN CAR"
  ],
  "JEEP": [
    "WRANGLER", "GRAND CHEROKEE", "CHEROKEE", "COMPASS", "RENEGADE", "GLADIATOR", "COMMANDER", "LIBERTY", "PATRIOT", "GRAND WAGONEER"
  ],
  "DODGE": [
    "CHARGER", "CHALLENGER", "DART", "AVENGER", "CALIBER", "NEON", "STRATUS", "INTREPID", "MAGNUM", "VIPER", "JOURNEY", "DURANGO", "GRAND CARAVAN", "RAM"
  ],
  "CHRYSLER": [
    "300", "200", "SEBRING", "CIRRUS", "CONCORDE", "LHS", "TOWN & COUNTRY", "PACIFICA", "ASPEN", "PT CRUISER", "CROSSFIRE"
  ],
  "FERRARI": [
    "488", "F8", "SF90", "ROMA", "PORTOFINO", "812", "LAFERRARI", "ENZO", "F40", "F50", "599", "612", "CALIFORNIA", "458", "430", "360"
  ],
  "LAMBORGHINI": [
    "HURACAN", "AVENTADOR", "URUS", "GALLARDO", "MURCIELAGO", "DIABLO", "COUNTACH", "MIURA", "ESPADA", "JARAMA", "ISLERO", "SILHOUETTE"
  ],
  "MASERATI": [
    "GHIBLI", "QUATTROPORTE", "LEVANTE", "GRANTURISMO", "GRANCABRIO", "COUPE", "SPYDER", "3200 GT", "4200 GT", "CAMBIO CORSA"
  ],
  "ALFA ROMEO": [
    "GIULIA", "STELVIO", "4C", "GIULIETTA", "MITO", "159", "147", "156", "166", "GT", "SPIDER", "BRERA", "GT V6"
  ],
  "FIAT": [
    "500", "500L", "500X", "PANDA", "PUNTO", "TIPO", "DOBLO", "DUCATO", "TALENTO", "FULLBACK", "124 SPIDER", "BRAVO", "STILO", "MULTIPLA"
  ],
  "BENTLEY": [
    "CONTINENTAL", "FLYING SPUR", "BENTAYGA", "MULSANNE", "AZURE", "BROOKLANDS", "ARNAGE", "TURBO R", "TURBO RT", "CONTINENTAL GT", "CONTINENTAL GTC"
  ],
  "ROLLS-ROYCE": [
    "PHANTOM", "GHOST", "WRAITH", "DAWN", "CULLINAN", "SILVER SHADOW", "SILVER SPIRIT", "SILVER SERAPH", "CORNICHE", "CAMARGUE", "PARK WARD"
  ],
  "ASTON MARTIN": [
    "DB11", "VANTAGE", "DBS", "RAPIDE", "VANQUISH", "DB9", "V8 VANTAGE", "DB7", "V12 VANTAGE", "ONE-77", "VULCAN", "VALKYRIE"
  ],
  "JAGUAR": [
    "XE", "XF", "XJ", "F-TYPE", "F-PACE", "E-PACE", "I-PACE", "XK", "S-TYPE", "X-TYPE", "XJS", "XJR", "XKR", "XFR"
  ],
  "LAND ROVER": [
    "DEFENDER", "DISCOVERY", "DISCOVERY SPORT", "RANGE ROVER", "RANGE ROVER SPORT", "RANGE ROVER EVOQUE", "RANGE ROVER VELAR", "FREELANDER", "LR2", "LR3", "LR4"
  ],
  "MINI": [
    "COOPER", "COOPER S", "COOPER SE", "COUNTRYMAN", "CLUBMAN", "CONVERTIBLE", "PACEMAN", "COUPE", "ROADSTER", "JOHN COOPER WORKS"
  ],
  "PEUGEOT": [
    "208", "308", "408", "508", "2008", "3008", "5008", "PARTNER", "EXPERT", "BOXER", "RIFTER", "TRAVELLER", "108", "107", "206", "207", "307", "407"
  ],
  "RENAULT": [
    "CLIO", "MEGANE", "LAGUNA", "SCENIC", "KADJAR", "KOLEOS", "CAPTUR", "TALISMAN", "ESPACE", "KANGOO", "TRAFIC", "MASTER", "TWINGO", "SYMBOL", "FLUENCE"
  ],
  "CITROEN": [
    "C1", "C3", "C4", "C5", "C6", "C8", "BERLINGO", "JUMPER", "JUMPY", "C-CROSSER", "C4 PICASSO", "GRAND C4 PICASSO", "DS3", "DS4", "DS5"
  ],
  "VOLVO": [
    "S40", "S60", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90", "C30", "C70", "240", "740", "760", "850", "940", "960"
  ],
  "SAAB": [
    "9-3", "9-5", "9-7X", "900", "9000", "99", "96", "95", "93", "92", "SONNETT", "VIGGEN"
  ],
  "SUBARU": [
    "IMPREZA", "LEGACY", "OUTBACK", "FORESTER", "TRIBECA", "BRZ", "WRX", "STI", "ASCENT", "CROSSTREK", "BAJA", "SVX", "XT", "JUSTY"
  ],
  "MITSUOKA": [
    "OROCHI", "GALUE", "RYOGA", "LE-SEYDE", "NUOVO", "VIEWT", "BUBU", "K-2", "HIMIKO", "ROCK STAR", "BUDDY", "LIKE"
  ],
  "DATSUN": [
    "GO", "GO+", "REDI-GO", "1200", "120Y", "140Y", "160Y", "180B", "200L", "240Z", "260Z", "280Z", "280ZX", "PICKUP", "VAN"
  ]
};

export default function ModelDropdown({ 
  value, 
  onChange, 
  company,
  placeholder = "Select Model", 
  className = "",
  style = {}
}: ModelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get available models for the selected company
  const availableModels = company ? (COMPANY_MODELS[company.toUpperCase()] || []) : [];

  // Filter models based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredModels(availableModels);
      return;
    }

    const filtered = availableModels.filter(model => {
      const modelLower = model.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      // Exact match
      if (modelLower === searchLower) return true;
      
      // Starts with search term
      if (modelLower.startsWith(searchLower)) return true;
      
      // Contains search term
      if (modelLower.includes(searchLower)) return true;
      
      // Fuzzy matching
      let searchIndex = 0;
      for (let i = 0; i < modelLower.length && searchIndex < searchLower.length; i++) {
        if (modelLower[i] === searchLower[searchIndex]) {
          searchIndex++;
        }
      }
      return searchIndex === searchLower.length;
    });

    setFilteredModels(filtered);
  }, [searchTerm, availableModels]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If user types a model name that matches exactly, select it
    const exactMatch = availableModels.find(model => 
      model.toLowerCase() === newValue.toLowerCase()
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

  // Handle model selection
  const handleModelSelect = (model: string) => {
    onChange(model);
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
      if (filteredModels.length > 0) {
        handleModelSelect(filteredModels[0]);
      }
    }
  };

  // Reset when company changes
  useEffect(() => {
    if (!company) {
      if (value) {
        onChange("");
      }
      setSearchTerm("");
      setIsOpen(false);
    }
  }, [company, onChange, value]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={() => {
            if (company) {
              setIsOpen(true);
              setSearchTerm(value);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={company ? placeholder : "Select company first"}
          disabled={!company}
          className={`w-full h-[42px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            !company ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          style={{
            ...style,
            paddingRight: '40px'
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (company) {
              setIsOpen(!isOpen);
              if (!isOpen) {
                setSearchTerm(value);
                setTimeout(() => inputRef.current?.focus(), 0);
              }
            }
          }}
          disabled={!company}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            company ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && company && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <button
                key={model}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                onClick={() => handleModelSelect(model)}
              >
                {model}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No models found for {company}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

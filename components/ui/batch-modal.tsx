"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2, CheckCircle, FileText, ChevronDown } from "lucide-react";
import { batchAPI } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Flag SVG Components --- //
const FlagJP = () => (
  <svg viewBox="0 0 3 2" className="h-4 w-6" aria-label="Japan flag" role="img">
    <path fill="#fff" d="M0 0h3v2H0z" />
    <circle cx="1.5" cy="1" r="0.5" fill="#bc002d" />
  </svg>
);

const FlagUS = () => (
  <svg viewBox="0 0 7410 3900" className="h-4 w-6" aria-label="United States flag" role="img">
    <path fill="#b22234" d="M0 0h7410v3900H0z" />
    <path stroke="#fff" strokeWidth="300" d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410" />
    <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="h-4 w-6" aria-label="United Kingdom flag" role="img">
    <clipPath id="s"><path d="M0 0v30h60V0z"/></clipPath>
    <clipPath id="t"><path d="M30 15h30v15zM0 0h30V0zM0 15H0v15zM30 0h30v15z"/></clipPath>
    <g clipPath="url(#s)">
      <path fill="#012169" d="M0 0h60v30H0z"/>
      <path stroke="#fff" strokeWidth="6" d="M0 0l60 30m0-30L0 30"/>
      <path stroke="#C8102E" strokeWidth="4" clipPath="url(#t)" d="M0 0l60 30m0-30L0 30"/>
      <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60"/>
      <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60"/>
    </g>
  </svg>
);

const FlagAU = () => (
  <svg viewBox="0 0 60 30" className="h-4 w-6" aria-label="Australia flag" role="img">
    <path fill="#00247d" d="M0 0h60v30H0z"/>
    <g transform="scale(0.5)">
      <clipPath id="a"><path d="M0 0h30v15H0z"/></clipPath>
      <g clipPath="url(#a)">
        <path fill="#012169" d="M0 0h30v15H0z"/>
        <path stroke="#fff" strokeWidth="3" d="M0 0l30 15m0-15L0 15"/>
        <path stroke="#C8102E" strokeWidth="2" d="M0 0l30 15m0-15L0 15"/>
        <path stroke="#fff" strokeWidth="5" d="M15 0v15M0 7.5h30"/>
        <path stroke="#C8102E" strokeWidth="3" d="M15 0v15M0 7.5h30"/>
      </g>
    </g>
    <g fill="#fff">
      <circle cx="40" cy="5" r="1.2"/>
      <circle cx="50" cy="10" r="1.2"/>
      <circle cx="45" cy="15" r="1.2"/>
      <circle cx="52" cy="18" r="1.2"/>
      <circle cx="38" cy="20" r="1.2"/>
      <circle cx="12" cy="20" r="2" />
    </g>
  </svg>
);

const FlagKR = () => (
  <svg viewBox="0 0 3 2" className="h-4 w-6" aria-label="South Korea flag" role="img">
    <path fill="#fff" d="M0 0h3v2H0z"/>
    <g transform="translate(1.5 1)">
      <circle r="0.5" fill="#cd2e3a"/>
      <path d="M0-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" fill="#0047a0"/>
    </g>
    <g stroke="#000" strokeWidth="0.06">
      <g transform="translate(.5 .45)"><path d="M-.3-.2h.6M-.3 0h.6M-.3.2h.6"/></g>
      <g transform="translate(2.5 1.55)"><path d="M-.3-.2h.6M-.3 0h.6M-.3.2h.6"/></g>
      <g transform="translate(.5 1.55)"><path d="M-.3-.2h.6M-.3.2h.6"/></g>
      <g transform="translate(2.5 .45)"><path d="M-.3-.2h.6M-.3.2h.6"/></g>
    </g>
  </svg>
);

const COUNTRIES = [
  { code: "JP", name: "Japan", Flag: FlagJP },
  { code: "US", name: "United States", Flag: FlagUS },
  { code: "GB", name: "United Kingdom", Flag: FlagGB },
  { code: "AU", name: "Australia", Flag: FlagAU },
  { code: "KR", name: "South Korea", Flag: FlagKR },
];

function classNames(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BatchData {
  batchNumber: string;
  countryOfOrigin: string;
  flagImage: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export function BatchModal({ isOpen, onClose }: BatchModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [createdBatchNumber, setCreatedBatchNumber] = useState("");
  const [batchData, setBatchData] = useState<BatchData>({
    batchNumber: "",
    countryOfOrigin: "",
    flagImage: "",
  });
  const [nextBatchNumber, setNextBatchNumber] = useState("");
  const [flagDropdownOpen, setFlagDropdownOpen] = useState(false);
  const [flagHighlight, setFlagHighlight] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const flagListRef = useRef<HTMLDivElement>(null);
  const flagBtnRef = useRef<HTMLButtonElement>(null);

  // Reset form when modal opens and calculate next batch number
  useEffect(() => {
    if (isOpen) {
      calculateNextBatchNumber();
      setBatchData({
        batchNumber: "",
        countryOfOrigin: "",
        flagImage: "",
      });
      setErrors({});
      setSuccessMessage("");
    }
  }, [isOpen]);

  const calculateNextBatchNumber = async () => {
    try {
      const response = await batchAPI.getAll();
      if (response.success) {
        const existingBatches = response.data;
        
        // Extract batch numbers and find the highest one
        const batchNumbers = existingBatches
          .map((batch: any) => batch.batchNo)
          .filter((batchNo: string) => batchNo && /^\d+$/.test(batchNo))
          .map((batchNo: string) => parseInt(batchNo))
          .sort((a: number, b: number) => b - a);
        
        const highestBatchNumber = batchNumbers.length > 0 ? batchNumbers[0] : 0;
        const nextNumber = highestBatchNumber + 1;
        const nextBatchString = nextNumber.toString().padStart(2, '0'); // 01, 02, 03, etc.
        
        setNextBatchNumber(nextBatchString);
        setBatchData(prev => ({
          ...prev,
          batchNumber: nextBatchString
        }));
      }
    } catch (error) {
      console.error("Error calculating next batch number:", error);
      // Fallback to 01 if there's an error
      setNextBatchNumber("01");
      setBatchData(prev => ({
        ...prev,
        batchNumber: "01"
      }));
    }
  };

  const handleInputChange = (field: keyof BatchData, value: string) => {
    setBatchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Flag dropdown keyboard handling
  useEffect(() => {
    if (!flagDropdownOpen) return;
    const el = flagListRef.current?.querySelectorAll<HTMLButtonElement>("[role='option']")[flagHighlight];
    el?.focus();
  }, [flagDropdownOpen, flagHighlight]);

  const onFlagKeyDown = (e: React.KeyboardEvent) => {
    if (!flagDropdownOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setFlagDropdownOpen(true);
      e.preventDefault();
      return;
    }
    if (e.key === "Escape") {
      setFlagDropdownOpen(false);
      flagBtnRef.current?.focus();
    }
    if (!flagDropdownOpen) return;
    if (e.key === "ArrowDown") {
      setFlagHighlight((h) => (h + 1) % COUNTRIES.length);
      e.preventDefault();
    }
    if (e.key === "ArrowUp") {
      setFlagHighlight((h) => (h - 1 + COUNTRIES.length) % COUNTRIES.length);
      e.preventDefault();
    }
    if (e.key === "Enter") {
      setSelectedCountry(COUNTRIES[flagHighlight]);
      setBatchData(prev => ({
        ...prev,
        countryOfOrigin: COUNTRIES[flagHighlight].name,
        flagImage: COUNTRIES[flagHighlight].code
      }));
      setFlagDropdownOpen(false);
      flagBtnRef.current?.focus();
      e.preventDefault();
    }
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setBatchData(prev => ({
      ...prev,
      countryOfOrigin: country.name,
      flagImage: country.code
    }));
    setFlagDropdownOpen(false);
  };

  const handleCreateBatch = async () => {
    // Validate required fields
    const newErrors: ValidationErrors = {};
    
    if (!batchData.countryOfOrigin.trim()) {
      newErrors.countryOfOrigin = "Country of origin is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      // Create batch
      const batchApiData = {
        batchNo: batchData.batchNumber,
        countryOfOrigin: batchData.countryOfOrigin,
        flagImage: batchData.flagImage,
        notes: `Batch created via UI - ${new Date().toLocaleDateString()}`,
      };

      const response = await batchAPI.create(batchApiData);
      
      if (response.success) {
        setCreatedBatchNumber(batchData.batchNumber);
        setShowSuccessCard(true);
        setTimeout(() => {
          onClose();
          setShowSuccessCard(false);
          setCreatedBatchNumber("");
        }, 3000);
      } else {
        setErrors({ general: response.error || "Failed to create batch" });
      }
    } catch (error: any) {
      console.error("Error creating batch:", error);
      setErrors({ general: error.message || "An error occurred while creating the batch" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
    setSuccessMessage("");
    setBatchData({
      batchNumber: "",
      countryOfOrigin: "",
      flagImage: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "#000000CC" }}>
      {/* Main Modal */}
      <div 
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mx-4"
        style={{
          width: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header with X button */}
        <div className="flex items-center justify-between mb-6">
            <div className="items-center gap-2">
              <h1 style={{
                fontWeight: 500,
                fontStyle: "Medium",
                fontSize: "24px",
                lineHeight: "120%",
                letterSpacing: "0%",
                verticalAlign: "middle",
              }}>Batch Detail</h1>
              <span style={{
                fontWeight: 400,
                fontStyle: "Regular",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "2%",
              }}>You New Batch number is available</span>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: "35px",
              height: "35px",
              left: "437px",
              borderRadius: "50px",
              opacity: 1,
              backgroundColor: "#00000014",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X className="h-4 w-4 text-black-700" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800 text-sm">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800 text-sm">{errors.general}</span>
          </div>
        )}

        {/* Batch Creation Form */}
        <div className="space-y-4">
          {/* Batch Number */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#111827" }}>
              Batch Number 
            </label>
            <input
              type="text"
              value={batchData.batchNumber}
              readOnly
              disabled
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />

          </div>

          {/* Country of Origin */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#111827" }}>
              Country of Origin 
            </label>
            <div className="relative" onKeyDown={onFlagKeyDown}>
              <button
                ref={flagBtnRef}
                aria-haspopup="listbox"
                aria-expanded={flagDropdownOpen}
                onClick={() => setFlagDropdownOpen((v) => !v)}
                className={`w-full inline-flex items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2 text-left shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-10 ${
                  errors.countryOfOrigin ? "border-red-500" : "border-gray-300"
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  <selectedCountry.Flag />
                  <span className="text-gray-900 font-medium">{selectedCountry.name}</span>
                </span>
                <ChevronDown className={classNames("h-4 w-4 transition", flagDropdownOpen && "rotate-180")} />
              </button>

              {flagDropdownOpen && (
                <div
                  ref={flagListRef}
                  role="listbox"
                  aria-activedescendant={`opt-${COUNTRIES[flagHighlight].code}`}
                  className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none"
                >
                  {COUNTRIES.map((c, i) => (
                    <button
                      key={c.code}
                      id={`opt-${c.code}`}
                      role="option"
                      aria-selected={selectedCountry.code === c.code}
                      onMouseEnter={() => setFlagHighlight(i)}
                      onClick={() => handleCountrySelect(c)}
                      className={classNames(
                        "w-full flex items-center gap-3 px-3 py-2 text-left focus:outline-none h-10",
                        i === flagHighlight ? "bg-gray-50" : "",
                        selectedCountry.code === c.code ? "font-semibold" : ""
                      )}
                    >
                      <c.Flag />
                      <span className="text-gray-900">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.countryOfOrigin && (
              <p className="text-red-500 text-xs mt-1">{errors.countryOfOrigin}</p>
            )}
          </div>

          {/* Flag Display */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#111827" }}>
              Flag 
            </label>
            <div className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
              {batchData.flagImage ? (
                <div className="flex items-center gap-2">
                  {(() => {
                    const country = COUNTRIES.find(c => c.code === batchData.flagImage);
                    return country ? <country.Flag /> : <span className="text-gray-500">No flag selected</span>;
                  })()}
                </div>
              ) : (
                <span className="text-gray-500">Select a country to see the flag</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleCreateBatch}
            disabled={isLoading}
            className={`w-full h-11 rounded-xl text-white text-sm font-medium border-none flex items-center justify-center transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
            style={{
              backgroundColor: "#00674F",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Save and Close"
            )}
          </button>
        </div>
      </div>

      {/* Success Card Overlay */}
      {showSuccessCard && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-60" 
          style={{ backgroundColor: "#000000CC" }}
        >
          <div 
            style={{
              width: "496px",
              height: "320px",
              borderRadius: "12px",
              borderWidth: "1px",
              borderColor: "#E5E7EB",
              padding: "24px",
              gap: "40px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Success Icon */}
            <div className="mb-6">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#F3F4F6"/>
                <path d="M32 16C23.164 16 16 23.164 16 32C16 40.836 23.164 48 32 48C40.836 48 48 40.836 48 32C48 23.164 40.836 16 32 16ZM28 38L22 32L24.586 29.414L28 32.828L39.414 21.414L42 24L28 38Z" fill="#10B981"/>
              </svg>
            </div>

            {/* Heading */}
            <div 
              style={{
                width: "448px",
                height: "54px",
                gap: "4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2 style={{
                fontWeight: 500,
                fontStyle: "Medium",
                fontSize: "24px",
                lineHeight: "120%",
                letterSpacing: "0%",
                verticalAlign: "middle",
                color: "#111827",
                margin: 0,
              }}>
                Batch {createdBatchNumber} Created
              </h2>
              <span style={{
                fontWeight: 400,
                fontSize: "14px",
                color: "#6B7280",
                marginTop: "4px",
              }}>
                You have successfully created new batch
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

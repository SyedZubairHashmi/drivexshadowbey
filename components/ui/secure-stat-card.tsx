"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Custom Eye Icon with line through it
const EyeWithLine = () => (
  <svg
    width="24"
    height="23"
    viewBox="0 0 24 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.4 }}
  >
    <path
      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
      fill="currentColor"
    />
    {/* Line through the eye */}
    <line
      x1="2"
      y1="21"
      x2="22"
      y2="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Eye Icon without line (same design as EyeWithLine but without the line)
const EyeWithoutLine = () => (
  <svg
    width="24"
    height="23"
    viewBox="0 0 24 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 1 }}
  >
    <path
      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
      fill="#141414"
    />
  </svg>
);

interface SecureStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  isBlurred?: boolean;
  onToggleBlur?: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
}

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPinSubmit: (pin: string) => void;
}

function PinModal({ isOpen, onClose, onPinSubmit }: PinModalProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPinSubmit(pin);
    setPin("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div 
         className="bg-white rounded-xl border border-gray-300 flex flex-col gap-5"
                   style={{
            width: "550px",
            height: "280px",
            top: "280px",
            left: "460px",
            borderWidth: "1px",
            gap: "20px",
            opacity: 1,
            borderRadius: "12px",
            padding: "20px"
          }}
       >
         <div className="flex justify-between items-center ">
           <h2 
             className="text-black"
             style={{
               fontWeight: 500,
               fontStyle: "normal",
               fontSize: "30px",
               lineHeight: "50%",
               letterSpacing: "0%",
               verticalAlign: "middle"
             }}
           >
             Safety Alert
           </h2>
           <button
             onClick={onClose}
             className="text-black-500 hover:text-gray-700 flex items-center justify-center"
             style={{
               width: "35px",
               height: "35px",
               opacity: 1,
               borderRadius: "100%",
               backgroundColor: "#00000014"
             }}
           >
             <X size={22} />
           </button>
         </div>
         
         <p 
           className="text-black-600"
           style={{
             fontWeight: 400,
             fontStyle: "normal",
             fontSize: "18px",
             lineHeight: "100%",
             letterSpacing: "2%"
           }}
         >
           Safety Pin required
         </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-lg text-black-500 mb-2">
              Enter your Pin Number
            </label>
            <div className="relative">
                             <input
                 type={showPin ? "text" : "password"}
                 value={pin}
                 onChange={(e) => setPin(e.target.value)}
                 className="border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 w-full"
                 placeholder="Enter PIN"
                 maxLength={4}
                 style={{
                   height: "42px",
                   borderWidth: "1px",
                   gap: "12px",
                   opacity: 1,
                   borderRadius: "8px",
                   paddingTop: "10px",
                   paddingRight: "40px",
                   paddingBottom: "10px",
                   paddingLeft: "12px"
                 }}
               />
               <button
                 type="button"
                 onClick={() => setShowPin(!showPin)}
                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                 style={{ 
                   width: "24px", 
                   height: "23px",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center"
                 }}
               >
                                 {showPin ? (
                   <EyeWithoutLine />
                 ) : (
                   <EyeWithLine />
                 )}
              </button>
            </div>
          </div>
          
                     <button
             type="submit"
             className="text-white transition-colors w-full"
             style={{
               height: "45px",
               maxHeight: "45px",
               gap: "15px",
               opacity: 1,
               borderRadius: "12px",
               backgroundColor: "#00674F"
             }}
           >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

export function SecureStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  isBlurred = true,
  onToggleBlur,
  showEditButton = false,
  onEdit,
}: SecureStatCardProps) {
  const { user } = useAuth();
  const [showPinModal, setShowPinModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleEyeClick = () => {
    if (!isUnlocked) {
      setShowPinModal(true);
    } else {
      setIsUnlocked(false);
    }
  };

  const handlePinSubmit = async (pin: string) => {
    if (!user) {
      alert("User not authenticated. Please login again.");
      return;
    }

    // For subusers, use companyId; for company users, use their own _id
    const companyId = user.role === 'subuser' ? user.companyId : user._id;
    
    if (!companyId) {
      alert("Company information not found. Please login again.");
      return;
    }

    try {
      const response = await fetch('/api/auth/validate-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId, pin }),
      });

      const data = await response.json();

      if (data.success && data.isValid) {
        setIsUnlocked(true);
        setShowPinModal(false);
      } else {
        alert("Incorrect PIN. Please try again.");
      }
    } catch (error) {
      console.error('Error validating PIN:', error);
      alert("Error validating PIN. Please try again.");
    }
  };

  const displayValue = isUnlocked ? value : "••••••••";

  return (
    <>
      <div 
        style={{
          display: 'flex',
          width: '290px',
          minWidth: '166.667px',
          padding: '16.667px 20px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '6.667px',
          borderRadius: '13.333px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          position: 'relative',
        }}
        className={className}
      >
        <div className="flex justify-between items-start w-full">
          <div className="text-sm text-black-500">{title}</div>
          <button
            onClick={handleEyeClick}
            className="transition-colors"
            style={{ 
              width: "24px", 
              height: "23px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#141414"
            }}
          >
            {isUnlocked ? (
              <EyeWithoutLine />
            ) : (
              <EyeWithLine />
            )}
          </button>
        </div>
        
        <div className="flex justify-between items-end w-full">
          <div className="flex items-center gap-2">
            <div 
              className={`text-2xl font-bold transition-all duration-300 ${
                !isUnlocked ? 'blur-sm' : ''
              }`}
              style={{ color: "#141414" }}
            >
              {displayValue}
            </div>
            {showEditButton && isUnlocked && (
              <button
                onClick={onEdit}
                className="transition-colors"
                style={{ 
                  width: "16px", 
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#141414"
                }}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            )}
          </div>
          {subtitle && (
            <p className={`text-[10px] text-gray-500 transition-all duration-300 ${
              !isUnlocked ? 'blur-sm' : ''
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onPinSubmit={handlePinSubmit}
      />
    </>
  );
}

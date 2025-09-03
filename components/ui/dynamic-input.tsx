import React, { useMemo } from 'react';

interface DynamicInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxDigits?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DynamicInput: React.FC<DynamicInputProps> = ({
  value,
  onChange,
  placeholder,
  maxDigits = 5,
  className = "",
  style = {}
}) => {
  const dynamicWidth = useMemo(() => {
    const contentLength = String(value || "").length;
    
    // If content length is 0, use width for 1 digit
    if (contentLength === 0) {
      return 32; // Width for 1 digit: 1 * 12 + 20 = 32px
    }
    
    // If content length reaches max digits, fix the width
    if (contentLength >= maxDigits) {
      return maxDigits * 12 + 20;
    }
    
    // Otherwise, calculate width based on content length
    return contentLength * 12 + 20;
  }, [value, maxDigits]);

  return (
    <input
      type="number"
      min="0"
      step="0.01"
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        const newValue = e.target.value;
        // Prevent negative numbers
        if (newValue.startsWith('-')) return;
        onChange(newValue);
      }}
      style={{
        minWidth: "32px",
        border: '1px solid #0000003D',
        borderRadius: "5px",
        backgroundColor: "#fff",
        padding: "0 8px",
        textAlign: "center",
        flexShrink: 0,
        width: `${dynamicWidth}px`,
        MozAppearance: "textfield", // Firefox
        ...style
      }}
      className={`text-sm outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
    />
  );
};

export default DynamicInput;

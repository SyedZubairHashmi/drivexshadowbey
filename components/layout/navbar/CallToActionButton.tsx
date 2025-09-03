import React from "react";

type CallToActionButtonProps = {
  fullWidth?: boolean;
  isBlackTheme?: boolean;
};

const CallToActionButton = ({
  fullWidth = false,
  isBlackTheme = false,
}: CallToActionButtonProps) => {
  return (
    <div className={`flex justify-center sm:justify-start ${fullWidth ? "w-full" : ""}`}>
      <a href="/features/automotive/collection" className={`${fullWidth ? "w-full" : ""}`}>
        <button
          className={`
            ${fullWidth 
              ? "w-full py-3 px-4" 
              : "w-[120px] sm:w-[180px] py-1.5 sm:py-2 px-3 sm:px-4"}
            rounded-full transition-all duration-300 ease-in-out
            text-[12px] sm:text-[16px] font-raleway font-medium
            border text-center
            ${
              isBlackTheme
                ? "border-black text-black hover:bg-black hover:text-white"
                : "border-white text-white hover:bg-white hover:text-black"
            }
          `}
        >
          Get My Dream Car
        </button>
      </a>
    </div>
  );
};

export default CallToActionButton;

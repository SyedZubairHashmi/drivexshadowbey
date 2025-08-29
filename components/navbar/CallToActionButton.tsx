const CallToActionButton = ({ fullWidth = false, isBlackTheme = false }) => {
  return (
    <button
      className={`
        rounded-full transition text-[16px] font-raleway
        ${fullWidth ? "w-full py-2" : "w-[193px] h-[50px]"}
        border
        ${
          isBlackTheme
            ? "border-black text-black hover:bg-black hover:text-white"
            : "border-white text-white hover:bg-white hover:text-black"
        }
      `}
    >
      Get My Dream Car
    </button>
  );
};

export default CallToActionButton;

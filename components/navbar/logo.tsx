import Image from "next/image";

const Logo = () => (
  <div className="flex items-center space-x-2 cursor-pointer">
    <Image
      src="/logo.png"
      alt="Logo"
      width={184}
      height={24}
      className="object-contain"
    />
  </div>
);

export default Logo;

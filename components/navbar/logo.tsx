import Image from "next/image";
import Link from "next/link";

const Logo = () => (
  <Link href="/" passHref>
    <div className="flex items-center space-x-2 cursor-pointer">
      <Image
        src="/logo.png"
        alt="Logo"
        width={184}
        height={24}
        className="object-contain"
      />
    </div>
  </Link>
);

export default Logo;

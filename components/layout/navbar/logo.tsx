import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={150}
          priority
          className="cursor-pointer"
        />
      </Link>
    </div>
  );
}

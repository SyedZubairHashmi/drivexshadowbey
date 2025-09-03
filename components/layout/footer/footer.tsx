'use client';
import Image from "next/image";

export default function FooterSection() {
  return (
    <section className="bg-black text-white w-full flex flex-col">

      {/* Container aligned same as other sections */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] py-10 sm:py-12">

        {/* Top Row: Text + Button (Desktop only) */}
        <div className="hidden sm:flex justify-between items-center mb-8">
          <p className="text-gray-400 text-base font-normal">
            Uncover the potency of Drive X Deals
          </p>
          <button className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600 transition text-base">
            Contact Us Now
          </button>
        </div>

        {/* Top Text (Mobile only) */}
        <div className="sm:hidden mb-4">
          <p className="text-gray-400 text-sm font-normal">
            Uncover the potency of Drive X Deals
          </p>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal leading-snug whitespace-pre-line mb-4">
          Ready to start{'\n'}with us?
        </h1>

        {/* Mobile-only Button Under Heading */}
        <div className="sm:hidden mb-8">
          <button className="w-full bg-[#00674F] text-white rounded-full px-4 py-2 hover:bg-green-600 transition text-base">
            Contact Us Now
          </button>
        </div>

        <hr className="border-gray-800 w-full mb-10" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-gray-400 text-sm">
          <div>
            <p className="font-bold text-white mb-2">Head Office</p>
            <p>
              11605 West Dodge Rd, Suite 3,
              <br />
              Omaha, NE - 68154
            </p>
          </div>

          <div>
            <p className="font-bold text-white mb-2">Office Hours</p>
            <p>
              Mon - Sat: 9.00am to 7.00pm
              <br />
              Sunday: Closed
            </p>
          </div>

          <div>
            <p className="font-bold text-white mb-2">Email</p>
            <p className="break-words">contact@drivexdeals.com</p>
          </div>

          <div>
            <p className="font-bold text-white mb-2">Phone</p>
            <p className="break-words">+92 330 010009</p>
          </div>
        </div>

        {/* Bottom Center Image INSIDE container */}
        <div className="w-full flex justify-center mt-8 mb-4">
          <Image
            src="/footerLogo.png"
            alt="Footer Logo"
            width={1250}
            height={600}
            className="w-full max-w-full transition duration-300 ease-in-out hover:brightness-125"
          />
        </div>

      </div>

    </section>
  );
}

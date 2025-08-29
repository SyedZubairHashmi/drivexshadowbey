'use client';
import Image from "next/image";

export default function FooterSection() {
  return (
    <>
      <section className="bg-black text-white w-full flex flex-col">
        
        {/* TEXT CONTENT CONTAINER */}
        <div className="w-full max-w-[1270px] mx-auto px-4 py-12">
          
          {/* Top text and button */}
          <div className="flex sm:flex-row justify-between items-center mb-8">
            <p className="text-gray-400 text-sm sm:text-base font-normal">
              Uncover the potency of Drive X Deals
            </p>
            <button className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600 transition">
              Contact Us Now
            </button>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal leading-snug whitespace-pre-line mb-8">
            Ready to start{'\n'}with us?
          </h1>

          <hr className="border-gray-800 w-full mb-12" />

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row justify-between gap-12 text-gray-400 text-sm">
            <div>
              <p className="font-bold text-white mb-2">Head Office</p>
              <p className="leading-relaxed">
                11605 West Dodge Rd, Suite 3,
                <br />
                Omaha, NE - 68154
              </p>
            </div>

            <div>
              <p className="font-bold text-white mb-2">Office Hours</p>
              <p className="leading-relaxed">
                Mon - Sat: 9.00am to 7.00pm
                <br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <p className="font-bold text-white mb-2">Email</p>
              <p className="leading-relaxed">contact@drivexdeals.com</p>
            </div>

            <div>
              <p className="font-bold text-white mb-2">Phone</p>
              <p className="leading-relaxed">+92 330 010009</p>
            </div>
          </div>
        </div>

        {/* Bottom Center Image */}
        <div className="w-full flex justify-center mt-1 mb-4">
          <Image
            src="/footerLogo.png"
            alt="Footer Logo"
            width={1250}
            height={600}
            className="transition duration-300 ease-in-out hover:brightness-125"
          />
        </div>
      </section>
    </>
  );
}
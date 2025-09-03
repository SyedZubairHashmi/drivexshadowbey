"use client";

import { useParams } from "next/navigation";
import carSectionData from "@/app/carSection/data";
import CarSection from "@/app/carSection/page";
import ProductSection from "@/components/productSection/productSection";
import ExploreSection from "@/components/exploreSection/exploreSection";
import Navbar from "@/components/navbar/navbar";
import CarImagesSection from "@/components/carDetailPage/carImagesSection";
import CarDetailsSection from "@/components/carDetailPage/CarDetailsSection";
import { Footer } from "react-day-picker";
import FooterSection from "@/components/footer/footer";

const CarDetailPage = () => {
  const params = useParams();
  const carIdStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const carId = parseInt(carIdStr!);
  const car = carSectionData.find((c) => c.id === carId);

  if (!car) return <div className="text-center mt-10 text-xl">Car not found</div>;

  return (
    <>
      <Navbar />

      {/* CAR IMAGE & DETAILS SECTION */}
      <div className="max-w-[1440px] mx-auto pt-[60px] pb-6 px-4 sm:px-[60px] mt-24">
        <div className="flex gap-8 flex-wrap lg:flex-nowrap">
          <CarImagesSection images={car.images} title={car.title} />
          <CarDetailsSection car={car} />
        </div>
      </div>

      {/* RELATED CAR SECTION - Full width */}
      <div className="w-full">
        <CarSection limit={4} />
      </div>

      {/* OTHER SECTIONS */}
      <ExploreSection />
      <ProductSection />
      <FooterSection/>
    </>
  );
};

export default CarDetailPage;

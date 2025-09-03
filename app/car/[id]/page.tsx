"use client";

import { useParams } from "next/navigation";
import carSectionData from "@/app/features/automotive/car-section/data";
import CarSection from "@/app/features/automotive/car-section/page";
import ProductSection from "@/components/productSection/productSection";
import ExploreSection from "@/components/exploreSection/exploreSection";
import CarImagesSection from "@/components/carDetailPage/carImagesSection";
import CarDetailsSection from "@/components/automotive/car-detail/CarDetailsSection";

const CarDetailPage = () => {
  const params = useParams();
  const carIdStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const carId = parseInt(carIdStr!);
  const car = carSectionData.find((c) => c.id === carId);

  if (!car) return <div className="text-center mt-10 text-xl">Car not found</div>;

  return (
    <>
      {/* CAR IMAGE & DETAILS SECTION */}
      <div className="w-full bg-white pt-24 pb-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px]">
          <div className="flex gap-6 lg:gap-8 flex-col lg:flex-row">
            <div className="w-full lg:w-1/2">
              <CarImagesSection images={car.images} title={car.title} />
            </div>
            <div className="w-full lg:w-1/2">
              <CarDetailsSection car={car} />
            </div>
          </div>
        </div>
      </div>

      {/* RELATED CAR SECTION */}
      <CarSection limit={4} />

      {/* OTHER SECTIONS */}
      <ExploreSection />
      <ProductSection />
    </>
  );
};

export default CarDetailPage;

"use client";

import { useParams } from "next/navigation";
import accessoriesData from "@/app/features/automotive/accessories/data";
import AccessoriesSection from "@/components/automotive/accessories/AccessoriesSection";
import GallerySection from "@/components/automotive/gallery/GallerySection";
import Navbar from "@/components/layout/navbar/navbar";
import AccessoryImagesSection from "@/components/automotive/accessories/AccessoryImagesSection";
import FooterSection from "@/components/layout/footer/footer";
import AccessoryDetailsSection from "@/components/automotive/accessories/AccessoryDetailsSection";

const AccessoryDetailPage = () => {
  const params = useParams();
  const accessoryIdStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const accessoryId = parseInt(accessoryIdStr!);
  const accessory = accessoriesData.find((a) => a.id === accessoryId);

  if (!accessory) return <div className="text-center mt-10 text-xl">Accessory not found</div>;

  return (
    <>
      <Navbar />

      {/* ACCESSORY IMAGE & DETAILS SECTION */}
      <div className="max-w-[1440px] mx-auto pt-[60px] pb-6 px-4 sm:px-[60px] mt-24">
        <div className="flex gap-8 flex-wrap lg:flex-nowrap">
          <AccessoryImagesSection images={accessory.images || []} title={accessory.title} />
          <AccessoryDetailsSection accessory={accessory} />
        </div>
      </div>

      {/* RELATED ACCESSORIES SECTION - Full width */}
      <div className="w-full">
        <AccessoriesSection limit={4} />
      </div>

      {/* OTHER SECTIONS */}
      <GallerySection />
      <AccessoriesSection />
      <FooterSection/>
    </>
  );
};

export default AccessoryDetailPage;

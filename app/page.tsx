import React from "react";
import CarSection from "@/components/automotive/car-section/CarSection"; // page";
import Navbar from "@/components/layout/navbar/navbar";
import HeroSection from "./features/general/hero-section/page";
import TestimonialSlider from "@/components/shared/testimonial/testimonalSlider";
import AccessoriesSection from "@/components/automotive/accessories/AccessoriesSection";
import GallerySection from "@/components/automotive/gallery/GallerySection";
import BlogsSection from "./features/automotive/blog/page";
import Footer from "@/components/layout/footer/footer";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CarSection />
      <TestimonialSlider />
      <AccessoriesSection />
      <GallerySection />
      <BlogsSection
        limit={3}
        sectionTitle="Happy Buyers, Real Stories"
        sectionSubtitle="Stories from happy buyers who found their car with DriveXDeals."
        seeMoreLink="/features/automotive/blog"
      />
      <Footer />
    </div>
  );
}

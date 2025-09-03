import React from "react";
import CarSection from "../features/automotive/car-section/page";
import HeroSection from "../features/general/hero-section/page";
import TestimonialSlider from "@/components/testimonal/testimonalSlider";
import ProductSection from "@/components/productSection/productSection";
import ExploreSection from "@/components/exploreSection/exploreSection";
import BlogsSection from "../features/automotive/blog/page";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CarSection />
      <TestimonialSlider />
      <ProductSection />
      <ExploreSection />
      <BlogsSection
        limit={3}
        sectionTitle="Happy Buyers, Real Stories"
        sectionSubtitle="Stories from happy buyers who found their car with DriveXDeals."
        seeMoreLink="/features/automotive/blog"
      />
    </div>
  );
};

export default HomePage;
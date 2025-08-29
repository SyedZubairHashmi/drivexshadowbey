import React from "react";
import CarSection from "../carSection/page";
import Navbar from "@/components/navbar/navbar";
import HeroSection from "../heroSection/page";
import TestimonialSlider from "@/components/testimonal/testimonalSlider";
import ProductSection from "@/components/productSection/productSection";
import ExploreSection from "@/components/exploreSection/exploreSection";
import BlogsSection from "../blog/page";
import Footer from "@/components/footer/footer";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CarSection />
      <TestimonialSlider />
      <ProductSection />
      <ExploreSection />
      <BlogsSection
        limit={3}
        sectionTitle="Happy Buyers, Real Stories"
        sectionSubtitle="Stories from happy buyers who found their car with DriveXDeals."
        seeMoreLink="/blogs"
      />
      <Footer />
    </div>
  );
};

export default HomePage;
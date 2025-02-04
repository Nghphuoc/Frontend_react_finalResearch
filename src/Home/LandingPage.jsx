import React from "react";
import Navbar from "../Nav/Navbar";
import HeroSection from "./HeroSection";
import ProductGrid from "../Product/ProductGrid ";

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductGrid />
    </div>
  );
};

export default LandingPage;

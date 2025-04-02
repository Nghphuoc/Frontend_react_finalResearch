import React from "react";
import Navbar from "../Nav/Navbar";
import HeroSection from "./HeroSection";
import ProductGrid from "../Product/ProductGrid ";
import Footer from "../Foot/Footer";
import ChatBot from "../ChatBot/Chat";
import HotSaleProduct from "../Product/HotSaleProduct";
import HotSaleCarousel from "../Product/HotSaleProduct";

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50 ">
        <Navbar />
      </div>

      <HeroSection />
 
      <ProductGrid />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default LandingPage;

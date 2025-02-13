import React from "react";
import Navbar from "../Nav/Navbar";
import HeroSection from "./HeroSection";
import ProductGrid from "../Product/ProductGrid ";
import Footer from "../Foot/Footer";
import ChatBot from "../ChatBot/Chat";
import { useParams } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductGrid />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default LandingPage;

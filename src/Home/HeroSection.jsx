import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeroSection = () => {
  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbTQ4ONOldf2Py6r8QJir_qzArGOEM8cKzbg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS26tCPU9vYlSFcJCiub_OW--El-WlUQt-G6A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZs5CJwp_mytX7y5bj7KXv2SwoKSdYnJAEdg&s",
    "https://i.pinimg.com/736x/ef/bf/05/efbf05e63012623a8a37869eb6f79237.jpg",
  ];

  return (
    <section className="flex flex-col items-center text-center py-5 px-4">
      {/* Carousel */}
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        interval={3000}
        className="w-full max-w-screen-md"
      >
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Slide ${index + 1}`} className="rounded-lg" />
          </div>
        ))}
      </Carousel>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center space-x-4 mt-6">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition">
          Purchase Now
        </button>
        <button className="border border-gray-400 text-gray-600 px-6 py-3 rounded-full flex items-center hover:bg-gray-100 transition">
          <i className="fa fa-play-circle mr-2"></i> Watch Video
        </button>
      </div>
    </section>
  );
};
export default HeroSection;

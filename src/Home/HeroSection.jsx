import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeroSection = () => {
  const images = [
    "https://athenalogistics.com.vn/wp-content/uploads/2023/06/Delivery-Order-la-gi.png",
    
    "https://blog.dktcdn.net/files/ban-hang-order.png",
    "https://static.vecteezy.com/system/resources/previews/026/790/533/non_2x/order-button-flat-monochrome-isolated-object-order-now-editable-black-and-white-line-art-drawing-simple-outline-spot-illustration-for-web-graphic-design-vector.jpg",
  ];

  return (
    <section className=" flex flex-col items-center text-center py-5 px-4 mt-10">
      {/* Carousel */}
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        interval={2000}
        className="w-full max-w-screen-lg pt-6"
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


import React from "react";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome
import { FaOpencart } from "react-icons/fa";
function LandingPage() {
  return (
    <>
      <div className="bg-white">
        {/* Top Banner */}

        {/* Navigation Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center">
            <img
              src="https://placehold.co/40x40"
              alt="Envato Market Logo"
              className="mr-2"
            />
            <span className="text-xl font-bold">
              Tech<span className="text-green-500">Shoop</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 text-xl font-bold">
            <a href="#" className="text-gray-600 hover:text-black">
              Home
            </a>
            
            <div className="relative group">
              <a href="#" className="text-gray-600 hover:text-black">
                Collections
              </a>

              <div className="absolute left-0 mt-2 w-max bg-white shadow-lg rounded-md hidden group-hover:flex p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[
                    { title: "Modern Watch", icon: "fas fa-watch" },
                    { title: "Classic Watch", icon: "fas fa-clock" },
                    { title: "Sports Watch", icon: "fas fa-stopwatch" },
                    { title: "Bestsellers", icon: "fas fa-star" },
                    { title: "Custom Watch", icon: "fas fa-cogs" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-6 text-center w-40"
                    >
                      <i className={`${item.icon} text-6xl mb-4`}></i>
                      <h2 className="text-xl font-bold mb-4">{item.title}</h2>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                        Check Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <a href="#" className="text-gray-600 hover:text-black">
              Watches
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              Quick find
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              Pages
            </a>
          </div>

          {/* Contact and Cart */}
          <div className="flex items-center space-x-4">
            <button className="bg-black text-white px-4 py-2 rounded-full">
              Contact Us
            </button>
            <div className="relative text-4xl">
              <FaOpencart />
              <span className="absolute top-0 right-0 bg-pink-500 text-white text-xs rounded-full px-1">
                0
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center py-16 px-6">
          <h2 className="text-gray-400 text-lg">Skip the Impossible</h2>
          <h1 className="text-5xl font-bold mt-2">
            Extraordinery <span className="text-black">Performance</span>
          </h1>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full">
              Purchase Now
            </button>
            <button className="border border-gray-400 text-gray-600 px-6 py-3 rounded-full flex items-center">
              <i className="fa fa-play-circle mr-2"></i> Watch Video
            </button>
          </div>

          {/* Image */}
          <div className="mt-10">
            <img
              src="https://placehold.co/400x400"
              alt="Smartwatch"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>

      <div>
        <main className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-4 text-center">
              <img
                src="https://placehold.co/200x200"
                alt="Chrome Watch"
                className="mx-auto mb-4"
              />
              <h2 className="font-bold text-lg">Chrome Watch</h2>
              <div className="text-yellow-500 mb-2">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-700 mb-4">$399</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add to cart
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4 text-center relative">
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs rounded-full px-2">
                20%
              </div>
              <img
                src="https://placehold.co/200x200"
                alt="Classic Watch"
                className="mx-auto mb-4"
              />
              <h2 className="font-bold text-lg">Classic Watch</h2>
              <div className="text-yellow-500 mb-2">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <p className="text-gray-500 line-through">$499</p>
              <p className="text-gray-700 mb-4">$399</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add to cart
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4 text-center">
              <img
                src="https://placehold.co/200x200"
                alt="Gold Watch"
                className="mx-auto mb-4"
              />
              <h2 className="font-bold text-lg">Gold Watch</h2>
              <div className="text-yellow-500 mb-2">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-700 mb-4">$699</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add to cart
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4 text-center">
              <img
                src="https://placehold.co/200x200"
                alt="Black Watch"
                className="mx-auto mb-4"
              />
              <h2 className="font-bold text-lg">Black Watch</h2>
              <div className="text-yellow-500 mb-2">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-700 mb-4">$599</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add to cart
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default LandingPage;

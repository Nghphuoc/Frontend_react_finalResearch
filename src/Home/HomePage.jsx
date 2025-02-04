import React from "react";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome
import { FaOpencart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();

  function handelClickCart() {
    navigate("/#");
  }

  const products = Array(10).fill({
    title: "Chrome Watch",
    image: "https://placehold.co/200x200",
    price: "$399",
  });

  return (
    <>
      <div className="bg-white">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          {/* Logo */}
          <div className="flex items-center">
            <img src="" alt="Logo" className="mr-2" />
            <span className="text-xl font-bold">
              Tech<span className="text-green-500">Shop</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-lg font-bold">
            {/* {["Home", "Collections", "Watches", "Quick find", "Pages"].map(
              (item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 hover:text-black"
                >
                  {item}
                </a>
              )
            )} */}
            <a href="#" className="text-gray-600 hover:text-black">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              Collections
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              Watches
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              Quick find
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              Pages
            </a>
          </nav>

          {/* Contact & Cart */}
          <div className="flex items-center space-x-4">
            <button className="bg-black text-white px-4 py-2 rounded-full">
              Contact Us
            </button>
            <div className="relative text-3xl">
              <button onClick={handelClickCart}>
                <FaOpencart />
              </button>
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2">
                0
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-16 px-6">
          {/* <h2 className="text-gray-400 text-lg">Skip the Impossible</h2>
          <h1 className="text-5xl font-bold mt-2">
            Extraordinary <span className="text-black">Performance</span>
          </h1> */}

          <div
            id="default-carousel"
            className="relative w-full"
            data-carousel="slide"
          >
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src="/docs/images/carousel/carousel-1.svg"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src="/docs/images/carousel/carousel-2.svg"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src="/docs/images/carousel/carousel-3.svg"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src="/docs/images/carousel/carousel-4.svg"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src="/docs/images/carousel/carousel-5.svg"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
            </div>
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="true"
                aria-label="Slide 1"
                data-carousel-slide-to="0"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 2"
                data-carousel-slide-to="1"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 3"
                data-carousel-slide-to="2"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 4"
                data-carousel-slide-to="3"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 5"
                data-carousel-slide-to="4"
              ></button>

              <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center space-x-4 mt-6">
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
              className="w-full max-w-md mx-auto"
            />
          </div>
        </section>

        {/* Product Grid */}
        <main className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-4 text-center"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="mx-auto mb-4"
                />
                <h2 className="font-bold text-lg">{product.title}</h2>
                <div className="text-yellow-500 mb-2 flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{product.price}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;

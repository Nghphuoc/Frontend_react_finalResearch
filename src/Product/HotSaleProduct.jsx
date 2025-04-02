import React, { useState, useEffect, useRef } from "react";
import {
  FaFireAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaHeart,
  FaBoxOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// Format price in Vietnamese currency style
const formatPrice = (price) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
    }).format(price) + "đ"
  );
};

const ProductCard = ({ product }) => {
  // Calculate discount if oldPrice exists
  const calculateDiscount = () => {
    if (product.oldPrice && product.price) {
      return Math.round((1 - product.price / product.oldPrice) * 100) + "%";
    }
    return product.discount || null;
  };

  const discount = calculateDiscount();
  const navigate = useNavigate();
    function handleClickMoreInfo(id) {
      navigate(`/detail/${id}`);
    }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden m-2 flex-shrink-0 w-[280px] relative group"
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Ribbon and badges */}
      <div className="relative">
        {discount && (
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-br-lg shadow-md">
            -{discount}
          </div>
        )}

        <div className="absolute top-0 right-0 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg shadow-md">
          HOT SALE
        </div>

        {/* Product image */}
        {/* <Link to={`/product/${product.productId}`}> */}
          <div className="relative overflow-hidden h-[180px] bg-gray-100 flex items-center justify-center">
            <img
              src={product.imageUrl || "/placeholder-product.png"}
              alt={product.productName}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              onClick={() => handleClickMoreInfo(product.productId)}
            />

            {/* Quick action overlay */}
            
          </div>
        {/* </Link> */}
      </div>

      {/* Product info */}
      <div className="p-4">
        {/* Product name */}
        <h3 className="font-semibold text-sm h-10 line-clamp-2 mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">
          {product.productName}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-red-600 text-lg font-bold">
            ${product.price?.toFixed(2)}
          </span>
          {product.price + 0?.toFixed(2) && (
            <span className="text-gray-400 text-sm line-through">
              {product.price + 0?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center">
            <FaBoxOpen className="mr-1 text-green-500" />
            <span
              className={
                product.stock_quantity > 0
                  ? "text-green-600 font-medium"
                  : "text-red-500 font-medium"
              }
            >
              {product.stock_quantity > 0
                ? `${product.stock_quantity} in stock`
                : "Out of stock"}
            </span>
          </div>

          <div className="flex items-center">
            <FaShoppingCart className="mr-1 text-indigo-500" />
            <span>{product.number_Of_Purchases || 0} sold</span>
          </div>
        </div>

        {/* Rating stars based on popularity */}
        <div className="flex items-center mt-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i <
                  Math.min(
                    5,
                    Math.ceil((product.number_Of_Purchases || 0) / 50)
                  )
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
                size={14}
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-2">
            {Math.min(5, Math.ceil((product.number_Of_Purchases || 0) / 50))}/5
            ({product.number_Of_Purchases || 0} reviews)
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const HotSaleCarousel = ({ products, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const carouselRef = useRef(null);
  const [hotSaleProducts, setHotSaleProducts] = useState([]);

  // Filter products that have checkSale === true
  useEffect(() => {
    if (products && products.length > 0) {
      // Filter logic based on checkSale field
      const saleProducts = products.filter(
        (product) => product.checkSale === true
      );
      setHotSaleProducts(saleProducts);
    }
  }, [products]);

  // Adjust number of items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    const maxIndex = Math.max(0, hotSaleProducts.length - itemsPerView);
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, hotSaleProducts.length - itemsPerView);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : Math.max(0, prevIndex - 1)
    );
  };

  // Early returns for loading or empty states
  if (loading) {
    return (
      <div className="py-6 px-4 md:px-8 bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-2 rounded-full text-2xl font-extrabold text-red-700 shadow-lg mb-5 transform rotate-[358deg]">
            <FaFireAlt className="mr-2 animate-pulse" /> HOT SALE CUỐI TUẦN
          </div>
        </div>
        <div className="flex">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white bg-opacity-20 rounded-xl p-4 m-2 w-[280px] h-[300px] animate-pulse"
            >
              <div className="h-[180px] bg-white bg-opacity-10 rounded-lg mb-4"></div>
              <div className="h-4 bg-white bg-opacity-10 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-white bg-opacity-10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render the component if there are no hot sale products
  if (!hotSaleProducts || hotSaleProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-6 px-4 md:px-8 bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full opacity-10 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full opacity-10 -ml-16 -mb-16"></div>

      {/* Header area with title */}
      <div className="relative z-10 mb-6">
        <div className="text-center">
          <h2 className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-2 rounded-full text-2xl font-extrabold text-red-700 shadow-lg mb-5 transform rotate-[358deg]">
            <FaFireAlt className="mr-2 animate-pulse" /> HOT SALE CUỐI TUẦN
          </h2>
        </div>
      </div>

      {/* Product list carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={carouselRef}>
          <motion.div
            className="flex"
            initial={false}
            animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {hotSaleProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </motion.div>
        </div>

        {/* Navigation buttons - only show if there are more products than viewable slots */}
        {hotSaleProducts.length > itemsPerView && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-3 shadow-lg text-gray-800 hover:bg-indigo-500 hover:text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-3 shadow-lg text-gray-800 hover:bg-indigo-500 hover:text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots - only show if there are more products than viewable slots */}
      {hotSaleProducts.length > itemsPerView && (
        <div className="flex justify-center mt-6">
          {Array.from({
            length: Math.ceil(hotSaleProducts.length / itemsPerView),
          }).map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 mx-1 rounded-full focus:outline-none ${
                Math.floor(currentIndex / itemsPerView) === i
                  ? "bg-white"
                  : "bg-white bg-opacity-40"
              }`}
              onClick={() => setCurrentIndex(i * itemsPerView)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotSaleCarousel;

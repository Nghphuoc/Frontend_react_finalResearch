import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "./service";
import toast, { Toaster } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const cartId = sessionStorage.getItem("cartId");

  function handleClickMoreInfo(id) {
    navigate(`/detail/${id}`);
  }

  const handleClickAddToCart = async (productId) => {
    if (!cartId || !productId) {
      toast.error("You must be logged in to add products to cart");
      navigate("/home");
      return;
    }
    try {
      const cartResponse = await addProductToCart(cartId, productId);
      if (cartResponse) {
        toast.success("Product added to cart");
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      toast.error("Error adding product to cart");
    }
  };

  // Truncate product name if it's too long
  const truncateName = (name) => {
    return name.length > 45 ? name.substring(0, 45) + "..." : name;
  };

  // Mock data - in a real app, these would come from the product data
  const discount = product.discount || 0;
  const rating = product.rating || 4.5;
  const maxRating = 5;

  return (
    <>
      <Toaster />
      <div className={`bg-white shadow-lg rounded-lg overflow-hidden h-[380px] w-full relative group `}>
        {/* Product image container with fixed height */}
        <div
          className="h-48 w-full relative overflow-hidden cursor-pointer"
          onClick={() => handleClickMoreInfo(product.productId)}
        >
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity duration-300"></div>
        </div>

        {/* Discount tag - only show if there's a discount */}
        {discount > 0 && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
            -{discount}%
          </div>
        )}

        {/* Add to cart quick button - appears on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClickAddToCart(product.productId);
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          aria-label="Add to cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>

        {/* Product information section */}
        <div className="p-4 flex flex-col h-[188px]">
          {/* Product name with fixed height and ellipsis for overflow */}
          <h4
            className="font-bold text-sm text-left line-clamp-2 h-10 mb-2"
            title={product.productName}
          >
            {truncateName(product.productName)}
          </h4>

          {/* Star rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(maxRating)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs ml-1 text-gray-500">
                ({product.number_Of_Purchases || 0} sold)
              </span>
            </div>
          </div>

          {/* Spacer to push price and button to bottom */}
          <div className="flex-grow"></div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-red-500 font-bold text-lg">
              ${product.price?.toFixed(2) || "0.00"}
            </p>
            {discount > 0 && (
              <p className="text-gray-400 text-sm line-through">
                ${((product.price || 0) / (1 - discount / 100)).toFixed(2)}
              </p>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={() => handleClickAddToCart(product.productId)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

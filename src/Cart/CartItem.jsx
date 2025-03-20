import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { deleteProductDetail, removeItemOnCart } from "./CartService";
import { addProductToCart } from "../Product/service";
import { FaTimes, FaMinus, FaPlus, FaInfoCircle } from "react-icons/fa";

const CartItem = ({ item, requestDataCart, isChecked, onCheckboxChange }) => {
  const navigate = useNavigate();
  const cartId = sessionStorage.getItem("cartId");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  function handleClickMoreInfo(id) {
    navigate(`/detail/${id}`);
  }

  async function deleteProduct(productId) {
    try {
      setIsLoading(true);
      const removeCartResponse = await deleteProductDetail(cartId, productId);
      if (removeCartResponse.data) {
        toast.success("Product removed from cart");
        requestDataCart();
      } else {
        toast.error("Error removing product from cart");
      }
    } catch (error) {
      toast.error("Failed to remove product");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeProduct(productId) {
    try {
      setIsLoading(true);
      const removeCartResponse = await removeItemOnCart(cartId, productId);
      if (removeCartResponse) {
        requestDataCart();
      } else {
        toast.error("Error reducing product quantity");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClickAddToCart = async (productId) => {
    if (item.stock_quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (item.quantity >= item.stock_quantity) {
      toast.error(`Only ${item.stock_quantity} units available`);
      return;
    }

    try {
      setIsLoading(true);
      const cartResponse = await addProductToCart(cartId, productId);
      if (cartResponse) {
        requestDataCart();
      } else {
        toast.error("Failed to update cart");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate available stock class
  const getStockClass = () => {
    if (item.stock_quantity <= 0) return "text-red-500 font-medium";
    if (item.stock_quantity < 5) return "text-amber-500 font-medium";
    return "text-green-600";
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 
                     ${
                       item.stock_quantity <= 0
                         ? "border border-red-200"
                         : "hover:shadow-lg"
                     }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Checkbox and Image Section */}
        <div className="flex items-center p-3 sm:p-4 sm:w-1/3 bg-gray-50">
          {/* Fixed Checkbox */}
          <div className="flex-shrink-0 w-6 h-6 mr-3">
            <input
              type="checkbox"
              className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-sm accent-blue-600 cursor-pointer"
              checked={isChecked}
              onChange={() => onCheckboxChange(item.productId)}
              disabled={item.stock_quantity <= 0}
            />
          </div>

          {/* Fixed Image Container */}
          <div className="relative flex-shrink-0 w-[100px] h-[100px] mx-auto sm:mx-0 sm:ml-2">
            {/* Image with error handling */}
            {!imageError ? (
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-full h-full object-contain rounded-md cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleClickMoreInfo(item.productId)}
                onError={handleImageError}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-gray-400"
                onClick={() => handleClickMoreInfo(item.productId)}
              >
                <span className="text-sm text-center px-2">
                  Image not available
                </span>
              </div>
            )}

            {item.stock_quantity <= 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                OUT OF STOCK
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex-grow p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-800 line-clamp-1 pr-4">
                {item.productName}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2">
                {item.description}
              </p>
            </div>
            <button
              onClick={() => deleteProduct(item.productId)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove item"
              disabled={isLoading}
            >
              <FaTimes />
            </button>
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
            {/* Quantity Control */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 mr-2">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  className={`p-2 flex items-center justify-center w-8 h-8 transition ${
                    item.stock_quantity <= 0 || item.quantity <= 1 || isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() =>
                    !isLoading &&
                    item.quantity > 1 &&
                    item.stock_quantity > 0 &&
                    removeProduct(item.productId)
                  }
                  disabled={
                    isLoading || item.quantity <= 1 || item.stock_quantity <= 0
                  }
                  aria-label="Decrease quantity"
                >
                  <FaMinus size={12} />
                </button>
                <span className="w-10 text-center py-1 font-medium text-gray-800 bg-white">
                  {item.quantity}
                </span>
                <button
                  className={`p-2 flex items-center justify-center w-8 h-8 transition ${
                    isLoading ||
                    item.stock_quantity <= 0 ||
                    item.quantity >= item.stock_quantity
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() =>
                    !isLoading &&
                    item.quantity < item.stock_quantity &&
                    handleClickAddToCart(item.productId)
                  }
                  disabled={
                    isLoading ||
                    item.stock_quantity <= 0 ||
                    item.quantity >= item.stock_quantity
                  }
                  aria-label="Increase quantity"
                >
                  <FaPlus size={12} />
                </button>
              </div>

              <button
                className="ml-3 text-blue-500 hover:text-blue-700 transition-colors flex items-center text-sm"
                onClick={() => handleClickMoreInfo(item.productId)}
              >
                <FaInfoCircle className="mr-1" size={14} /> Details
              </button>
            </div>

            {/* Price Information */}
            <div className="text-right min-w-[100px]">
              <p className="text-lg font-semibold text-gray-800">
                ${item.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Subtotal:{" "}
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          {/* Stock Information */}
          <div className="mt-3 flex justify-between items-center border-t border-gray-100 pt-2">
            <div className={`text-xs ${getStockClass()}`}>
              {item.stock_quantity <= 0 ? (
                <span>Out of stock</span>
              ) : item.stock_quantity < 5 ? (
                <span>Only {item.stock_quantity} left!</span>
              ) : (
                <span>{item.stock_quantity} in stock</span>
              )}
            </div>

            {isLoading && (
              <div className="text-xs text-blue-500 flex items-center">
                <div className="w-3 h-3 mr-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                Updating...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

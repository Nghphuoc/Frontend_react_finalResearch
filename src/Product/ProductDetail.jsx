import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Check,
  Info,
  ArrowLeft,
  Home,
  Truck,
  Shield,
  RefreshCcw,
  Minus,
  Plus,
  Loader,
} from "lucide-react";
import { getProduct, addProductToCart } from "./service";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../Nav/Navbar";
import Footer from "../Foot/Footer";
import ChatBot from "../ChatBot/Chat";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tab, setTab] = useState("description");

  const cartId = sessionStorage.getItem("cartId");
  const isLoggedIn = !!sessionStorage.getItem("userId");

  // Fetch product data
  useEffect(() => {
    setIsLoading(true);
    getProduct(id)
      .then((response) => {
        setProduct(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Failed to load product:", error);
        setError("Failed to load product information. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => Math.min(prev + 1, 10)); // Max 10 items
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1)); // Min 1 item
    }
  };

  const handleClickAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart", {
        icon: "🔒",
        duration: 4000,
      });
      return;
    }

    try {
      toast.loading("Adding to cart...");
      const cartResponse = await addProductToCart(
        cartId,
        product.productId
      );
      toast.dismiss();

      if (cartResponse) {
        toast.success("Product added to your cart!", {
          icon: "🛒",
          duration: 3000,
        });
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Could not add product to cart. Please try again.", {
        duration: 4000,
      });
      console.error("Add to cart error:", error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your wishlist", {
        icon: "🔒",
        duration: 3000,
      });
      return;
    }

    toast.success("Product added to your wishlist!", {
      icon: "❤️",
      duration: 3000,
    });
    // Implement actual wishlist functionality here when available
  };

  // Generate dummy product images from the main image for the gallery
  const generateProductGallery = (mainImage) => {
    if (!mainImage) return [];
    return [mainImage, mainImage, mainImage];
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader size={40} className="text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        
        <NavBar />
        <div className="min-h-[60vh] max-w-5xl mx-auto p-8 flex flex-col items-center justify-center">
          <div className="bg-red-50 p-6 rounded-lg text-center w-full max-w-md">
            <Info size={40} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-700 mb-6">
              {error || "The requested product could not be found."}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft size={16} className="inline mr-2" /> Go Back
            </button>
          </div>

        </div>
        <Footer />
      </>
    );
  }

  const productImages = generateProductGallery(product.imageUrl);

  // Mock reviews - in a real app, these would come from the API
  const reviews = [
    {
      id: 1,
      user: "Nguyễn Văn Minh",
      rating: 5,
      date: "2025-03-01",
      comment:
        "Excellent product! Exceeded my expectations. The quality is superb and the performance is outstanding. I would definitely recommend this to anyone looking for reliability and value.",
    },
    {
      id: 2,
      user: "Trần Thị Thanh",
      rating: 4,
      date: "2025-02-15",
      comment:
        "Very good performance. Battery life is impressive. The only minor issue is that it runs a bit hot when used heavily, but overall I'm very satisfied with my purchase.",
    },
    {
      id: 3,
      user: "Phan Thị Thu Hường",
      rating: 5,
      date: "2025-01-22",
      comment:
        "Fast shipping and the product works great. The customer service was also very helpful when I had questions about setup.",
    },
  ];

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <>
      <NavBar />
      <Toaster position="top-center" />
      <ChatBot />
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Home size={14} className="mr-1" />
            <a href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </a>
            <ChevronRight size={14} className="mx-2" />
            <a href="/" className="hover:text-indigo-600 transition-colors">
              Products
            </a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 font-medium truncate">
              {product.productName}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="p-6 lg:p-8">
              <div className="bg-gray-50 rounded-xl p-2 mb-4">
                <img
                  src={productImages[selectedImage]}
                  alt={product.productName}
                  className="w-full h-80 object-contain rounded-lg"
                />
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {productImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`cursor-pointer border-2 rounded-md overflow-hidden w-20 h-20 ${
                        selectedImage === index
                          ? "border-indigo-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.productName} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="p-6 lg:p-8 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {product.productName}
                  </h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {reviews.length} reviews
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddToWishlist}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Add to wishlist"
                  >
                    <Heart size={20} className="text-gray-700" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Share"
                  >
                    <Share2 size={20} className="text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold text-indigo-600">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {product.price && (
                  <span className="text-lg text-gray-500 line-through ml-3">
                    ${parseFloat(product.price + 50).toFixed(2)}
                  </span>
                )}
                {product.inStock ? (
                  <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded inline-flex items-center">
                    <Check size={14} className="mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="ml-3 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                  {product.description ||
                    "No description available for this product."}
                </p>
                <button
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  onClick={() => setTab("description")}
                >
                  Read more
                </button>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                    >
                      <Minus
                        size={16}
                        className={
                          quantity <= 1 ? "text-gray-400" : "text-gray-700"
                        }
                      />
                    </button>
                    <span className="w-10 text-center">{quantity}</span>
                    <button
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= 10}
                    >
                      <Plus
                        size={16}
                        className={
                          quantity >= 10 ? "text-gray-400" : "text-gray-700"
                        }
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    className="col-span-2 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center"
                    onClick={handleClickAddToCart}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    className="bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    onClick={() => navigate("/checkout")}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Product Features */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="p-1.5 bg-indigo-100 rounded-full text-indigo-600 mr-3">
                    <Truck size={16} />
                  </div>
                  <p className="text-sm text-gray-700">
                    Free shipping for orders over $20
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="p-1.5 bg-indigo-100 rounded-full text-indigo-600 mr-3">
                    <Shield size={16} />
                  </div>
                  <p className="text-sm text-gray-700">
                    12-month official warranty
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="p-1.5 bg-indigo-100 rounded-full text-indigo-600 mr-3">
                    <RefreshCcw size={16} />
                  </div>
                  <p className="text-sm text-gray-700">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  tab === "description"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTab("description")}
              >
                Description
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  tab === "specifications"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTab("specifications")}
              >
                Specifications
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  tab === "reviews"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTab("reviews")}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            <div className="p-6">
              {tab === "description" && (
                <div className="prose max-w-none">
                  <p>
                    {product.description ||
                      "No detailed description available for this product."}
                  </p>
                  <p>
                    Experience premium quality with this exceptional product
                    designed for optimal performance and durability. Perfect for
                    both professional use and everyday tasks, it combines
                    innovative technology with sleek design to provide an
                    outstanding user experience.
                  </p>
                </div>
              )}

              {tab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800">
                      Technical Specifications
                    </h3>
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Brand</td>
                          <td className="py-2 text-gray-900 font-medium">
                            {product.brand || "Generic"}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Model</td>
                          <td className="py-2 text-gray-900 font-medium">
                            {product.model || product.productName}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Dimensions</td>
                          <td className="py-2 text-gray-900 font-medium">
                            {product.dimensions || "Standard"}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Weight</td>
                          <td className="py-2 text-gray-900 font-medium">
                            {product.weight || "Not specified"}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Color</td>
                          <td className="py-2 text-gray-900 font-medium">
                            {product.color || "As shown"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800">
                      Package Contents
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>1 x {product.productName}</li>
                      <li>User Manual</li>
                      <li>Warranty Card</li>
                    </ul>
                  </div>
                </div>
              )}

              {tab === "reviews" && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 mr-3">
                      <span className="text-5xl font-bold text-indigo-600">
                        {averageRating.toFixed(1)}
                      </span>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.round(averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Based on {reviews.length} reviews
                      </p>
                    </div>
                    <div className="flex-grow">
                      {/* Rating distribution bars */}
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(
                          (r) => r.rating === rating
                        ).length;
                        const percentage = (count / reviews.length) * 100;

                        return (
                          <div key={rating} className="flex items-center mb-1">
                            <div className="w-8 text-xs text-gray-600">
                              {rating} ★
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-8 text-xs text-gray-600 text-right">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-6 mt-8">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-6"
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {review.user}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}

                    <div className="flex justify-center mt-6">
                      <button className="px-6 py-2 border border-gray-300 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50 transition-colors">
                        Write a Review
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt="Related Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    Similar Product {item}
                  </h3>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < 4
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(12)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-600">
                      ${(product.price * 0.9).toFixed(2)}
                    </span>
                    <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;

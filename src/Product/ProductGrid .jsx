import React, { useState, useEffect } from "react";
import ProductCard from "./ListProduct";
import { getAllProduct, getAllCategory } from "./service";
import { motion, AnimatePresence } from "framer-motion"; // Note: You'll need to install framer-motion

const ProductGrid = () => {
  const [allProduct, setAllProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 20;
  const [allCategory, setAllCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productResponse = await getAllProduct();
        setAllProduct(productResponse.data);
        setFilteredProducts(productResponse.data);
        await getDataCategory();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filter when selectedCategory changes
  useEffect(() => {
    filterProductsByCategory(selectedCategory);
    setCurrentPage(1);
  }, [selectedCategory, allProduct]);

  // Filter products by category
  const filterProductsByCategory = (categoryId) => {
    if (categoryId === null) {
      setFilteredProducts(allProduct);
    } else {
      const filtered = allProduct.filter((product) =>
        product.categories.some(
          (category) => category.categoryId === categoryId
        )
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const getDataCategory = async () => {
    const response = await getAllCategory();
    setAllCategory(response.data);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Smooth scroll to top of product grid
      document.getElementById("product-grid-top").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Category Header Section */}
      <div
        id="product-grid-top"
        className="bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                  ${
                    selectedCategory === null
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                onClick={() => handleCategoryClick(null)}
              >
                All Products
              </button>

              {allCategory.map((category) => (
                <button
                  key={category.categoryId}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${
                      selectedCategory === category.categoryId
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  onClick={() => handleCategoryClick(category.categoryId)}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Products count indicator */}
        <div className="mb-4 text-sm text-gray-500">
          {loading
            ? "Loading products..."
            : `Showing ${filteredProducts.length > 0 ? startIndex + 1 : 0} - 
              ${Math.min(
                startIndex + productsPerPage,
                filteredProducts.length
              )} 
              of ${filteredProducts.length} products`}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-gray-500">
              Try selecting a different category or check back later.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05, // Staggered animation
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-between items-center border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex justify-center items-center space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="hidden md:flex space-x-2">
                {totalPages <= 7 ? (
                  [...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-md text-sm font-medium
                        ${
                          currentPage === index + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))
                ) : (
                  <>
                    {[1, 2].map((page) => (
                      <button
                        key={page}
                        className={`px-4 py-2 rounded-md text-sm font-medium
                          ${
                            currentPage === page
                              ? "bg-indigo-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}

                    {currentPage > 3 && (
                      <span className="px-2 py-2 text-gray-500">...</span>
                    )}

                    {currentPage > 2 && currentPage < totalPages - 1 && (
                      <button className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white">
                        {currentPage}
                      </button>
                    )}

                    {currentPage < totalPages - 2 && (
                      <span className="px-2 py-2 text-gray-500">...</span>
                    )}

                    {[totalPages - 1, totalPages].map((page) => (
                      <button
                        key={page}
                        className={`px-4 py-2 rounded-md text-sm font-medium
                          ${
                            currentPage === page
                              ? "bg-indigo-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </>
                )}
              </div>

              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductGrid;

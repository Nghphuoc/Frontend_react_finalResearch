import React, { useState, useEffect } from "react";
import ProductCard from "./ListProduct";
import { getAllProduct } from "./service";

const ProductGrid = () => {
  const [allProduct, setAllProduct] = useState([]); // Danh sách tất cả sản phẩm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const productsPerPage = 20; // Số sản phẩm trên mỗi trang

  useEffect(() => {
    getAllProduct()
      .then((response) => {
        setAllProduct(response.data); // Lưu danh sách sản phẩm
        
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Tính toán vị trí hiển thị sản phẩm
  const totalPages = Math.ceil(allProduct.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = allProduct.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="p-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}

      <div className="flex justify-center items-center mt-6 space-x-2">
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-500 text-white"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-500 text-white"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductGrid;

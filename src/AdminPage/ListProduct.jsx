import React, { useState, useEffect, useMemo } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaEllipsisV,
  FaFileExport,
  FaEye,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "./SideBar";
import { getAllProduct } from "../Product/service";
import { Toaster, toast } from "react-hot-toast";
import NavBarAdmin from "./NavBarAdmin";
import { useNavigate } from "react-router-dom";
import { deleteProduct, UpdateProductSale } from "./adminService";

// Import the ProductUpdateModal component
import ProductUpdateModal from "./ProductUpdateForm";


const ListProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "productName",
    direction: "asc",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    priceRange: [0, 1000],
    stockStatus: null,
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [lastUpdated] = useState("2025-03-21 08:26:52");
  const [currentUser] = useState("NamProPlayer20");

  // Add these new state variables for the update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [dataCheckSale, setDataCheckSale] = useState([]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      setLoading(true);
      const response = await getAllProduct();
      setProducts(response.data);
      console.log(response.data);
      toast.success("Products loaded successfully", { id: "products-loaded" });
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ml-1 text-indigo-600" />
    ) : (
      <FaSortDown className="ml-1 text-indigo-600" />
    );
  };

  const applyFilters = (product) => {
    // Price range filter
    const priceInRange =
      product.price >= filterOptions.priceRange[0] &&
      product.price <= filterOptions.priceRange[1];

    // Stock status filter
    const stockMatch =
      filterOptions.stockStatus === null ||
      (filterOptions.stockStatus === "inStock" && product.stock_quantity > 0) ||
      (filterOptions.stockStatus === "outOfStock" &&
        product.stock_quantity === 0);

    return priceInRange && stockMatch;
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.productName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) && applyFilters(product)
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        } else {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
      });
  }, [products, searchTerm, sortConfig, filterOptions]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  
  console.log(currentItems);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleRowSelection = (productId) => {
    setSelectedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((item) => item.productId));
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      const response = await deleteProduct(productId);
      if (response.status === 200) {
        toast.success("Product deleted successfully");
        getProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      // Call your delete API
      await deleteProduct(productToDelete.productId);

      // Update local state
      setProducts((prev) =>
        prev.filter((p) => p.productId !== productToDelete.productId)
      );
      toast.success(`${productToDelete.productName} deleted successfully`);

      // Reset
      setProductToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  // Update this function to open the modal instead of navigating
  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setIsUpdateModalOpen(true);
  };

  // Function to handle product updates
  const handleProductUpdated = () => {
    // Refresh product list after update
    getProducts();
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleCheckboxChange = (productId) => {
    setDataCheckSale(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId) // Bỏ chọn
          : [...prevSelected, productId] // Chọn thêm
    );
  };

    console.log(dataCheckSale);

    function handleSubmitSale(){
      UpdateProductSale(dataCheckSale);
      toast.success("success ", "Sale updated successfully");
      setDataCheckSale([]);
      getProducts();
    }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBarAdmin toggleSidebar={toggleSidebar} />
        <Toaster position="top-right" />

        <main className="flex-1 overflow-auto p-4">
          <div className="">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Product Management
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Manage your store products, inventory, and pricing
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Last updated: {lastUpdated}</span>
                  <span className="mx-2">•</span>
                  <span>by {currentUser}</span>
                </div>
              </div>
            </div>

            {/* Card Container */}
            <motion.div
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Action Bar */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search Box */}
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                          <FaTimes size={14} />
                        </button>
                      )}
                    </div>

                    {/* Filter Button & Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className={`px-4 py-2.5 rounded-lg border flex items-center space-x-2 ${
                          showFilterMenu
                            ? "border-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30"
                            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FaFilter size={14} />
                        <span>Filters</span>
                      </button>

                      <AnimatePresence>
                        {showFilterMenu && (
                          <motion.div
                            className="absolute z-10 mt-2 w-72 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  Filters
                                </h3>
                                <button
                                  onClick={() => setShowFilterMenu(false)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <FaTimes size={14} />
                                </button>
                              </div>

                              <div className="space-y-4">
                                {/* Price Range Filter */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range: ${filterOptions.priceRange[0]}{" "}
                                    - ${filterOptions.priceRange[1]}
                                  </label>
                                  <div className="flex items-center gap-4">
                                    <input
                                      type="range"
                                      min="0"
                                      max="1000"
                                      value={filterOptions.priceRange[0]}
                                      onChange={(e) =>
                                        setFilterOptions({
                                          ...filterOptions,
                                          priceRange: [
                                            parseInt(e.target.value),
                                            filterOptions.priceRange[1],
                                          ],
                                        })
                                      }
                                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                  </div>
                                  <div className="flex items-center gap-4 mt-2">
                                    <input
                                      type="range"
                                      min="0"
                                      max="1000"
                                      value={filterOptions.priceRange[1]}
                                      onChange={(e) =>
                                        setFilterOptions({
                                          ...filterOptions,
                                          priceRange: [
                                            filterOptions.priceRange[0],
                                            parseInt(e.target.value),
                                          ],
                                        })
                                      }
                                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                  </div>
                                </div>

                                {/* Stock Status Filter */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Stock Status
                                  </label>
                                  <div className="flex items-center gap-4">
                                    <button
                                      onClick={() =>
                                        setFilterOptions({
                                          ...filterOptions,
                                          stockStatus:
                                            filterOptions.stockStatus ===
                                            "inStock"
                                              ? null
                                              : "inStock",
                                        })
                                      }
                                      className={`px-3 py-1.5 rounded text-sm ${
                                        filterOptions.stockStatus === "inStock"
                                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      In Stock
                                    </button>
                                    <button
                                      onClick={() =>
                                        setFilterOptions({
                                          ...filterOptions,
                                          stockStatus:
                                            filterOptions.stockStatus ===
                                            "outOfStock"
                                              ? null
                                              : "outOfStock",
                                        })
                                      }
                                      className={`px-3 py-1.5 rounded text-sm ${
                                        filterOptions.stockStatus ===
                                        "outOfStock"
                                          ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      Out of Stock
                                    </button>
                                  </div>
                                </div>

                                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                  <button
                                    onClick={() =>
                                      setFilterOptions({
                                        priceRange: [0, 1000],
                                        stockStatus: null,
                                      })
                                    }
                                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                  >
                                    Reset Filters
                                  </button>
                                  <button
                                    onClick={() => setShowFilterMenu(false)}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                  >
                                    Apply Filters
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full justify-between md:justify-end md:w-auto">
                    {/* Bulk Actions (visible when rows selected) */}
                    <AnimatePresence>
                      {selectedRows.length > 0 && (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedRows.length} selected
                          </span>
                          <button
                            className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            onClick={() => {
                              /* Handle bulk delete */
                            }}
                          >
                            Delete Selected
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Export Button */}
                    <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                      <FaFileExport size={14} />
                      <span>Export</span>
                    </button>

                    {/* Add Product Button */}
                    <button
                      onClick={handleSubmitSale}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 transition-colors duration-200"
                    >
                      <FaPlus size={14} />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Applied Filters */}
                {(searchTerm ||
                  filterOptions.stockStatus !== null ||
                  filterOptions.priceRange[0] > 0 ||
                  filterOptions.priceRange[1] < 1000) && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Active Filters:
                    </span>

                    {searchTerm && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-300 rounded-full flex items-center">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    )}

                    {filterOptions.stockStatus !== null && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex items-center ${
                          filterOptions.stockStatus === "inStock"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {filterOptions.stockStatus === "inStock"
                          ? "In Stock"
                          : "Out of Stock"}
                        <button
                          onClick={() =>
                            setFilterOptions({
                              ...filterOptions,
                              stockStatus: null,
                            })
                          }
                          className="ml-1.5 text-current"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    )}

                    {(filterOptions.priceRange[0] > 0 ||
                      filterOptions.priceRange[1] < 1000) && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-300 rounded-full flex items-center">
                        Price: ${filterOptions.priceRange[0]} - $
                        {filterOptions.priceRange[1]}
                        <button
                          onClick={() =>
                            setFilterOptions({
                              ...filterOptions,
                              priceRange: [0, 1000],
                            })
                          }
                          className="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterOptions({
                          priceRange: [0, 1000],
                          stockStatus: null,
                        });
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium ml-2"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Improved Table Layout */}
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="w-10 px-3 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                            checked={
                              selectedRows.length === currentItems.length &&
                              currentItems.length > 0
                            }
                            onChange={toggleAllRows}
                          />
                        </div>
                      </th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Image
                      </th>
                      <th
                        className="w-1/3 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("productName")}
                      >
                        <div className="flex items-center">
                          Product Name {getSortIcon("productName")}
                        </div>
                      </th>
                      <th
                        className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center">
                          Price {getSortIcon("price")}
                        </div>
                      </th>
                      <th
                        className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("stock_quantity")}
                      >
                        <div className="flex items-center">
                          Stock {getSortIcon("stock_quantity")}
                        </div>
                      </th>
                      <th
                        className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("number_Of_Purchases")}
                      >
                        <div className="flex items-center">
                          Sales {getSortIcon("number_Of_Purchases")}
                        </div>
                      </th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer">
                        CheckSale
                      </th>
                      <th className="w-28 px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <tr key={index} className="animate-pulse">
                            <td className="px-3 py-4">
                              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded float-right"></div>
                            </td>
                          </tr>
                        ))
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex flex-col items-center">
                            <FaSearch className="text-gray-300 dark:text-gray-600 text-4xl mb-3" />
                            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                              No products found
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm max-w-md">
                              {searchTerm
                                ? `We couldn't find any products matching "${searchTerm}"`
                                : "Try adjusting your search or filters to find what you're looking for."}
                            </p>
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm("")}
                                className="mt-3 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                              >
                                Clear search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((product) => (
                        <motion.tr
                          key={product.productId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          layout
                        >
                          <td className="px-3 py-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                checked={selectedRows.includes(
                                  product.productId
                                )}
                                onChange={() =>
                                  toggleRowSelection(product.productId)
                                }
                              />
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div className="relative group">
                              <img
                                src={product.imageUrl}
                                alt={product.productName}
                                className="h-16 w-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={() =>
                                    handleViewProduct(product.productId)
                                  }
                                  className="p-1.5 bg-white rounded-full text-gray-700"
                                >
                                  <FaEye size={14} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                              {product.productName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ID: #{product.productId}
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                              ${product.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  product.stock_quantity > 0
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {product.stock_quantity > 0
                                  ? product.stock_quantity
                                  : "Out of Stock"}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex items-center">
                              <FaShoppingCart
                                className="text-gray-400 mr-1.5"
                                size={12}
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {product.number_Of_Purchases || 0}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex items-center">
                              <input
                                className="text-center items-center "
                                type="checkbox"
                                checked={dataCheckSale.includes(
                                  product.productId
                                )}
                                onChange={() =>
                                  handleCheckboxChange(product.productId)
                                }
                              />
                              {product.checkSale ? <span className="text-red-500">
                                Sale
                              </span>:
                              <span className="text-blue-500">
                                No
                              </span>}
                            </div>
                          </td>

                          <td className="px-3 py-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() =>
                                  handleEditProduct(product.productId)
                                }
                                className="p-1.5 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                                title="Edit product"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteClick(product.productId)
                                }
                                className="p-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                                title="Delete product"
                              >
                                <FaTrash size={16} />
                              </button>
                              <div className="relative inline-block text-left">
                                <button
                                  className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                                  title="More options"
                                >
                                  <FaEllipsisV size={16} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section */}
              {!loading && filteredProducts.length > 0 && (
                <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto">
                      <span className="whitespace-nowrap">
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
                        {products.length} products
                      </span>
                      <div className="ml-4 flex items-center space-x-2">
                        <span className="whitespace-nowrap">Show</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md text-sm p-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {[5, 10, 25, 50].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                        <span className="whitespace-nowrap">per page</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FaChevronLeft size={14} />
                      </button>

                      {/* Page Numbers - Desktop */}
                      <div className="hidden md:flex">
                        {Array.from(
                          { length: Math.min(10, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 10) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            if (pageNum > 0 && pageNum <= totalPages) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => paginate(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                    currentPage === pageNum
                                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                            return null;
                          }
                        )}
                      </div>

                      {/* Mobile Pagination */}
                      <span className="md:hidden text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FaChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Footer Info */}
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <div>Last updated: {lastUpdated}</div>
              <div>Logged in as: {currentUser}</div>
            </div>
          </div>
        </main>

        {/* Product Update Modal */}
        <ProductUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          productId={selectedProductId}
          onProductUpdated={handleProductUpdated}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />

              {/* Modal Content */}
              <motion.div
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                      <FaTrash className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Delete Product
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete{" "}
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {productToDelete?.productName}
                          </span>
                          ? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListProduct;

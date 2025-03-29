import { getAllCategory } from "../Product/service";
import { getProduct } from "../Product/service";
import { updateProduct } from "../Product/service";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaExclamationCircle,
  FaSave,
  FaUpload,
  FaTag,
  FaBoxOpen,
  FaDollarSign,
  FaInfo,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
const ProductUpdateModal = ({
  isOpen,
  onClose,
  productId,
  onProductUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    description: "",
    price: 0,
    imageUrl: "",
    stock_quantity: 0,
    number_Of_Purchases: 0,
    categories: [], // Initialize with empty array to prevent undefined
  });

  const [allCategories, setAllCategories] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentUser] = useState("NamProPlayer20");
  const [currentDate] = useState("2025-03-21 08:56:34");
  const [img, setImg] = useState("");

  // Fetch product data and categories when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductData();
    }
  }, [isOpen, productId]);

  const fetchProductData = async () => {
    try {
      setInitialLoading(true);

      // Fetch all categories first
      const categoriesData = await getAllCategory();
      setAllCategories(categoriesData.data || []); // Ensure we default to empty array

      // Fetch product data
      const productData = await getProduct(productId);

      // Ensure categories is always an array
      const normalizedProductData = {
        ...productData,
        categories: productData.categories || [], // Ensure categories is always an array
      };

      setProduct(normalizedProductData);
      setImagePreview(productData.imageUrl || "");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load product data");
      onClose(); // Close modal on error
    } finally {
      setInitialLoading(false);
    }
  };

  // Mark field as touched when user interacts with it
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric values
    if (name === "price" || name === "stock_quantity") {
      setProduct({
        ...product,
        [name]: value === "" ? "" : parseFloat(value),
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    // Preview the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setNewImage(file);

    // Clear any image error
    if (errors.imageUrl) {
      setErrors({
        ...errors,
        imageUrl: null,
      });
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    // Ensure categories exists
    const currentCategories = product.categories || [];

    // Check if category is already selected
    const isCategorySelected = currentCategories.some(
      (cat) => cat && cat.categoryId === categoryId
    );

    let updatedCategories;

    if (isCategorySelected) {
      // Remove the category if already selected
      updatedCategories = currentCategories.filter(
        (cat) => cat && cat.categoryId !== categoryId
      );
    } else {
      // Add the category if not selected
      const categoryToAdd = allCategories.find(
        (cat) => cat && cat.categoryId === categoryId
      );
      if (categoryToAdd) {
        updatedCategories = [...currentCategories, categoryToAdd];
      } else {
        updatedCategories = [...currentCategories];
      }
    }

    setProduct({
      ...product,
      categories: updatedCategories,
    });

    // Clear any category error
    if (errors.categories) {
      setErrors({
        ...errors,
        categories: null,
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!product.productName || !product.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!product.description || !product.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!product.price || product.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (
      product.stock_quantity === undefined ||
      product.stock_quantity === null ||
      product.stock_quantity < 0
    ) {
      newErrors.stock_quantity = "Stock quantity cannot be negative";
    }

    // if (!product.imageUrl && !newImage) {
    //   newErrors.imageUrl = "Product image is required";
    // }

    if (!product.categories || product.categories.length === 0) {
      newErrors.categories = "At least one category must be selected";
    }

    setErrors(newErrors);
    // Mark all fields as touched on validation
    setTouched({
      productName: true,
      description: true,
      price: true,
      stock_quantity: true,
      categories: true,
      imageUrl: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const dataForm = new FormData();
      dataForm.append("file", newImage);
      dataForm.append("upload_preset", "DataIMG");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnnxwgvxa/image/upload",
        dataForm
      );

      setImg(res.data.secure_url);
      console.log(res.data.secure_url);
      console.log(img);

      // Create form data for submission
      const formData = new FormData();

      // Append product data
      formData.append("productName", product.productName);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock_quantity", product.stock_quantity);
      formData.append("number_Of_Purchases", product.number_Of_Purchases || 0);
      console.log(productId)
      // Append categories - with null checks
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach((category, index) => {
          if (category) {
            formData.append(
              `categories[${index}].categoryId`,
              category.categoryId
            );
            formData.append(
              `categories[${index}].categoryName`,
              category.categoryName
            );
          }
        });
      }

      // Append new image if selected
      if (img) {
        formData.append("imageUrl", img);
        console.log(img)
      } else if (product.imageUrl) {
        formData.append("imageUrl", product.imageUrl);
        console.log(product.imageUrl)
      }

      // Submit the form
      await updateProduct(productId, formData);

      toast.success("Product updated successfully");

      // Notify parent component and close modal
      if (onProductUpdated) {
        onProductUpdated();
      }
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // Stop propagation of click events inside the modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Press ESC to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Focus trap inside modal
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Focus first input when modal opens
      const firstInput = document.querySelector(
        ".modal-content input, .modal-content button"
      );
      if (firstInput) firstInput.focus();
    }

    return () => {
      // Restore body scroll
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={handleModalClick}
          >
            {/* Modal Header */}
            <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Update Product
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {initialLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Product Image & Categories */}
                    <div className="col-span-1">
                      {/* Product Image */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Image
                        </label>
                        <div className="mb-2 flex justify-center">
                          <div className="w-full h-48 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Product preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">
                                No image
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <label className="flex items-center justify-center px-4 py-2 border border-indigo-500 dark:border-indigo-500 border-dashed rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors">
                            <FaUpload className="mr-2" />
                            Choose new image
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        {errors.imageUrl && touched.imageUrl && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.imageUrl}
                          </p>
                        )}
                      </div>

                      {/* Categories */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {allCategories &&
                            allCategories.map(
                              (category) =>
                                category && (
                                  <label
                                    key={category.categoryId}
                                    className={`inline-flex items-center px-3 py-2 rounded-full text-sm cursor-pointer transition-colors
                                  ${
                                    product.categories &&
                                    product.categories.some(
                                      (cat) =>
                                        cat &&
                                        cat.categoryId === category.categoryId
                                    )
                                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-2 border-indigo-500"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                                  }`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={
                                        product.categories &&
                                        product.categories.some(
                                          (cat) =>
                                            cat &&
                                            cat.categoryId ===
                                              category.categoryId
                                        )
                                      }
                                      onChange={() =>
                                        handleCategoryChange(
                                          category.categoryId
                                        )
                                      }
                                    />
                                    {category.categoryName}
                                  </label>
                                )
                            )}
                        </div>
                        {errors.categories && touched.categories && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.categories}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rest of the form remains the same */}
                    {/* Right Column - Product Details */}
                    <div className="col-span-2 space-y-5">
                      {/* Product ID (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Product ID
                        </label>
                        <input
                          type="text"
                          value={product.productId || ""}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          disabled
                        />
                      </div>

                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Product Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaTag className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="productName"
                            value={product.productName || ""}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("productName")}
                            className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                              ${
                                errors.productName && touched.productName
                                  ? "border-red-300 dark:border-red-700 focus:ring-red-500/20 dark:focus:ring-red-500/20"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white"
                              }`}
                          />
                        </div>
                        {errors.productName && touched.productName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <FaExclamationCircle className="mr-1" />{" "}
                            {errors.productName}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description *
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                            <FaInfo className="text-gray-400" />
                          </div>
                          <textarea
                            name="description"
                            value={product.description || ""}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("description")}
                            rows="3"
                            className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                              ${
                                errors.description && touched.description
                                  ? "border-red-300 dark:border-red-700 focus:ring-red-500/20 dark:focus:ring-red-500/20"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white"
                              }`}
                          ></textarea>
                        </div>
                        {errors.description && touched.description && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <FaExclamationCircle className="mr-1" />{" "}
                            {errors.description}
                          </p>
                        )}
                      </div>

                      {/* Price and Stock */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price (USD) *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaDollarSign className="text-gray-400" />
                            </div>
                            <input
                              type="number"
                              name="price"
                              value={product.price || ""}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur("price")}
                              min="0"
                              step="0.01"
                              className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                                ${
                                  errors.price && touched.price
                                    ? "border-red-300 dark:border-red-700 focus:ring-red-500/20 dark:focus:ring-red-500/20"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white"
                                }`}
                            />
                          </div>
                          {errors.price && touched.price && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors.price}
                            </p>
                          )}
                        </div>

                        {/* Stock Quantity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stock Quantity *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaBoxOpen className="text-gray-400" />
                            </div>
                            <input
                              type="number"
                              name="stock_quantity"
                              value={product.stock_quantity || ""}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur("stock_quantity")}
                              min="0"
                              className={`pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                                ${
                                  errors.stock_quantity &&
                                  touched.stock_quantity
                                    ? "border-red-300 dark:border-red-700 focus:ring-red-500/20 dark:focus:ring-red-500/20"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white"
                                }`}
                            />
                          </div>
                          {errors.stock_quantity && touched.stock_quantity && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                              <FaExclamationCircle className="mr-1" />{" "}
                              {errors.stock_quantity}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Number of Purchases (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Number of Purchases
                        </label>
                        <input
                          type="number"
                          value={product.number_Of_Purchases || 0}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          disabled
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          This field is automatically updated by the system
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 flex items-center space-x-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
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
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-1" />
                          <span>Update Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <div>Last updated: {currentDate}</div>
              <div>User: {currentUser}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductUpdateModal;
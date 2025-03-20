import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaHeadset,
  FaSignOutAlt,
  FaSearch,
  FaFileInvoice,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaInfoCircle,
  FaSort,
  FaPencilAlt,
  FaSave,
  FaShippingFast ,
} from "react-icons/fa";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import NavBar from "../Nav/Navbar";
import OrderDetails from "../Order/OrderDetail";
import { getUserInfo, getOrderDetail, updateUserProfile } from "./UserService";
import "../Cart/scroll.css";

const UserDetails = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [orderList, setOrderList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "order_date",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // States for editing user profile
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [password, setPassword] = useState("");
  const userId = sessionStorage.getItem("userId");

  // Define tabs with counts that will be updated later
  const [tabs, setTabs] = useState([
    { name: "All Orders", count: 0, filter: null },
    { name: "Ordered", count: 0, filter: "Ordered" },
    { name: "Shipping", count: 0, filter: "Shipping" },
    { name: "Delivered", count: 0, filter: "Delivered" },
    { name: "Order_Cancelled", count: 0, filter: "Order_Cancelled" },
  ]);

  // Fetch user data and orders
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserInfo(userId);
        setUser(response.data);
        setPassword(response.data.password);

        // Initialize edit form with current user data
        setEditFormData({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
        });

        // Process orders with calculated properties
        const processedOrders = response.data.orders.map((order) => ({
          ...order,
          statusColor: getStatusColor(order.status),
          formattedDate: format(
            new Date(order.order_date),
            "dd/MM/yyyy HH:mm",
            { locale: vi }
          ),
        }));

        console.log("processedOrders", processedOrders);

        setOrderList(processedOrders);
        setFilteredOrders(processedOrders);

        // Update tab counts
        updateTabCounts(processedOrders);
        
        console.log("my Tabs", tabs);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [userId, navigate]);

  // Update filtered orders when tab changes or search term updates
  useEffect(() => {
    let result = [...orderList];

    // Apply tab filtering
    if (tabs[activeTab].filter) {
      result = result.filter(
        (order) => order.status === tabs[activeTab].filter
      );
    }

    // Apply search filtering
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.orderId.toString().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result = sortOrders([...result], sortConfig);

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, searchTerm, orderList, sortConfig]);

  // Calculate tab counts
  const updateTabCounts = (Orders) => {
    tabs[0].count = Orders.length;
    tabs[1].count = Orders.filter((order) => order.status === "Ordered").length;
    tabs[2].count = Orders.filter(
      (order) => order.status === "Shipping"
    ).length;
    tabs[3].count = Orders.filter(
      (order) => order.status === "Delivered"
    ).length;
    tabs[4].count = Orders.filter(
      (order) => order.status === "Order_Cancelled"
    ).length;
  };

  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600";
      case "Pending":
        return "text-amber-500";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <AiOutlineDeliveredProcedure className="mr-2" />;
      case "Shipping":
        return <FaShippingFast className="mr-2 " />; // animate-spin
      case "Order_Cancelled":
        return <FaTimesCircle className="mr-2" />;
      case "Ordered":
        return <FaCheckCircle className="mr-2" />;
      default:
        return <FaInfoCircle className="mr-2" />;
    }
  };

  // Sorting function
  const sortOrders = (items, config) => {
    if (!config.key) return items;

    return items.sort((a, b) => {
      if (a[config.key] < b[config.key]) {
        return config.direction === "asc" ? -1 : 1;
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Request sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle order detail view
  const handleOrderDetail = async (id) => {
    try {
      setIsLoading(true);
      const data = await getOrderDetail(id);
      setDataOrder(data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("Failed to load order details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset form data to current user data
      setEditFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setFormErrors({});
    }
    setIsEditing(!isEditing);
    setUpdateSuccess(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!editFormData.fullName.trim()) {
      errors.fullName = "Name is required";
    }

    if (!editFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(editFormData.email)) {
      errors.email = "Invalid email format";
    }

    if (
      editFormData.phone &&
      !/^\d{10,11}$/.test(editFormData.phone.replace(/[^0-9]/g, ""))
    ) {
      errors.phone = "Phone number must be 10-11 digits";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setUpdateLoading(true);

    

    try {
      // Call API to update user profile
      const response = await updateUserProfile(userId, {
        fullName: editFormData.fullName,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
        
      });
      
      // Update user state with new data
      setUser({
        ...user,
        fullName: editFormData.fullName,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
      });

      setUpdateSuccess(true);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating user profile:", err);
      setFormErrors({
        submit: "Failed to update profile. Please try again.",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle user logout
  const handleClickLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("Authorization");
    sessionStorage.removeItem("cartId");
    navigate("/home");
  };

  // Pagination calculations
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <NavBar />

      {/* Order Details Modal */}
      <OrderDetails
        data={dataOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ zIndex: 100 }}
      />

      <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gray-50 p-4 lg:p-6 gap-4 lg:gap-6 mt-14">
        {/* User Profile Sidebar */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white shadow-lg transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 lg:w-1/4 xl:w-1/5 lg:min-h-screen overflow-y-auto rounded-xl`}
          style={{
            zIndex: isModalOpen ? 1 : 50,
            borderRight: "1px solid #e5e7eb",
          }}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? "Edit Profile" : "User Profile"}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={toggleEditMode}
                aria-label={isEditing ? "Cancel editing" : "Edit profile"}
              >
                {isEditing ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaPencilAlt className="text-xl" />
                )}
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Update Success Message */}
          {updateSuccess && (
            <div className="mx-5 mt-3 p-2 bg-green-100 text-green-700 rounded-md flex items-center">
              <FaCheckCircle className="mr-2" />
              Profile updated successfully!
            </div>
          )}

          {/* User Avatar and Status */}
          <div className="p-5 flex flex-col items-center border-b border-gray-200">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-800">
              {user.fullName || "User"}
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mt-1">
              Active Account
            </span>
          </div>

          {/* User Information Form/Display */}
          <div className="p-5 space-y-5">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Personal Information
            </h4>

            {isEditing ? (
              // Edit Form
              <form onSubmit={handleSubmitUserInfo}>
                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={editFormData.fullName}
                        onChange={handleInputChange}
                        className={`pl-10 w-full py-2 border ${
                          formErrors.fullName
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {formErrors.fullName && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className={`pl-10 w-full py-2 border ${
                          formErrors.email
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleInputChange}
                        className={`pl-10 w-full py-2 border ${
                          formErrors.phone
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        value={editFormData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  {/* Submit Error */}
                  {formErrors.submit && (
                    <div className="p-2 bg-red-100 text-red-700 rounded-md">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={toggleEditMode}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      {updateLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // Display User Info
              <div>
                {[
                  { icon: FaUser, label: "Full Name", value: user.fullName },
                  {
                    icon: FaEnvelope,
                    label: "Email Address",
                    value: user.email,
                  },
                  { icon: FaPhone, label: "Phone Number", value: user.phone },
                  {
                    icon: FaMapMarkerAlt,
                    label: "Address",
                    value: user.address,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <item.icon className="text-sm text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <h3 className="text-sm font-medium text-gray-800 break-words">
                        {item.value || "Not updated"}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="px-5 py-4 mt-auto border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={() => console.log("Support clicked")}
              >
                <FaHeadset className="mr-2" />
                Support
              </button>
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                onClick={handleClickLogout}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Last login: {new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Current Date: {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
              </p>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 flex-1 w-full">
          {/* Mobile Sidebar Toggle */}
          <button
            className="mb-4 p-2 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition lg:hidden w-full"
            onClick={toggleSidebar}
          >
            <FaBars className="mr-2" />
            {isSidebarOpen ? "Close User Profile" : "View User Profile"}
          </button>

          {/* Order History Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Order History
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage your recent orders
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-4 md:mt-0 relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <FaTimesCircle className="mr-2" />
              {error}
            </div>
          )}

          {/* Order Tabs */}
          <div className="border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 min-w-max">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-3 text-sm font-medium transition duration-200 rounded-t-lg ${
                    activeTab === index
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.name}{" "}
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="text-indigo-600 text-4xl animate-spin mb-4" />
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FaFileInvoice className="text-gray-300 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500 max-w-md">
                {searchTerm
                  ? `No orders match your search "${searchTerm}". Try a different search term.`
                  : `You don't have any ${
                      tabs[activeTab].filter || ""
                    } orders yet.`}
              </p>
              {searchTerm && (
                <button
                  className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            // Orders Table
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => requestSort("orderId")}
                        >
                          Order
                          <FaSort className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => requestSort("order_date")}
                        >
                          Date
                          <FaSort className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => requestSort("status")}
                        >
                          Status
                          <FaSort className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => requestSort("totalPrice")}
                        >
                          Total
                          <FaSort className="ml-1 text-gray-400" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                      <tr
                        key={order.orderId}
                        className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                              <FaFileInvoice className="text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                #{order.orderId.toString().padStart(5, "0")}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.items?.length || 0} items
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {order.formattedDate}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipping"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Ordered"
                                ? "bg-gray-200 text-gray-600"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-medium text-gray-900">
                            ${order.totalPrice}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-500">
                            {order.statusBanking || "Card Payment"}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleOrderDetail(order.orderId)}
                            className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-xs font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstOrder + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastOrder, filteredOrders.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredOrders.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === i + 1
                                ? "bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            paginate(Math.min(totalPages, currentPage + 1))
                          }
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>

                  {/* Mobile Pagination */}
                  <div className="flex flex-1 justify-between items-center sm:hidden">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 bg-white cursor-not-allowed"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 bg-white cursor-not-allowed"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;

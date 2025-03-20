import React, { useState } from "react";
import {
  FaFileExport,
  FaSearch,
  FaEye,
  FaBars,
  FaBell,
  FaAngleRight,
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "./SideBar";
import { getAllOrder } from "./adminService";
import { useEffect } from "react";
import { updateStatusOrder } from "./adminService";
import toast, { Toaster } from "react-hot-toast";
import NavBarAdmin from "./NavBarAdmin";
import { getOrderDetail } from "../Customer/UserService";
import OrderDetails from "../Order/OrderDetail";

const OrdersDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const [orders, setOrders] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllOrders();
    
  }, []);

  // Sample data for dashboard stats
  const stats = [
    { title: "Total Orders", value: "1,286", trend: "+12%", color: "blue" },
    { title: "Pending Orders", value: "42", trend: "-3%", color: "yellow" },
    {
      title: "Revenue (Monthly)",
      value: "$54,392",
      trend: "+18%",
      color: "green",
    },
    { title: "Average Order", value: "$86.75", trend: "+5%", color: "purple" },
  ];

  async function getAllOrders() {
    const response = await getAllOrder();

    setOrders(sortOrders(response.data));
  }

  function sortOrders(orders) {
    return orders.sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    );
  }

  // Status colors for various states
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipping":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800";
      case "Order_Cancelled":
        return "bg-red-100 text-red-800";
      case "Ordered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "vnPay":
        return "bg-blue-100 text-emerald-800";
      case "Momo":
        return "bg-yellow-100 text-amber-800";
      case "VietComBank":
        return "bg-green-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };


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

  const ordersPerPage = 10; // Số đơn hàng hiển thị trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  // Tính tổng số trang
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Cắt danh sách để chỉ hiển thị đơn hàng của trang hiện tại
  const displayedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);
  
  const checkDateRange = (option) => {

    console.log(option);
    console.log(orders);
    switch (option) {
      case "Today":
        return formatDate(today);
      case "Yesterday":
        return formatDate(yesterday);
      case "Last 7 days":
        return `From ${formatDate(last7Days)} to ${formatDate(today)}`;
      case "Thismonth":
        return `From ${formatDate(startOfMonth)} to ${formatDate(today)}`;
      default:
        return "Custom range";
    }
    
  };


  function UpdateStatus(id, currentStatus) {
    let newStatus = currentStatus === "Ordered" ? "Shipping" : "Delivered";
    const status = { status: newStatus };
    updateStatusOrder(id, status);
    toast.success("Update status successfully");
    window.location.reload();
  }

  return (
    <div className="flex h-screen bg-gray-50 min-h-screen overflow-hidden font-inter">
      {/* Sidebar */}
      <SideBar />
      <Toaster />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        <NavBarAdmin toggleSidebar={toggleSidebar} />

        {/* Order Details Modal */}
        <OrderDetails
          data={dataOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          style={{ zIndex: 100 }}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
                <p className="text-gray-600">
                  Manage and process customer orders
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <div className="relative text-gray-600">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaCalendarAlt />
                  </span>
                  <select
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-300 focus:outline-none"
                    onChange={(e) => checkDateRange(e.target.value)}
                  >
                    <option value={today}>Today</option>
                    <option value={yesterday}>Yesterday</option>
                    <option value={last7Days}>Last 7 days</option>
                    <option value={startOfMonth}>This month</option>
                    <option>Custom range</option>
                  </select>
                </div>

                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-300 transition">
                  <FaFileExport className="mr-2" /> Export
                </button>

                <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">
                  Create New Order
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm font-medium">
                      {stat.title}
                    </p>
                    <span
                      className={`text-xs font-semibold ${
                        stat.trend.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mt-2 text-gray-800">
                    {stat.value}
                  </p>
                  <div
                    className={`h-1 w-full bg-gray-100 mt-3 rounded-full overflow-hidden`}
                  >
                    <div
                      className={`h-full bg-${stat.color}-500`}
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex overflow-x-auto">
                {[
                  "all",
                  "pending",
                  "processing",
                  "shipped",
                  "completed",
                  "cancelled",
                ].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-4 py-3 whitespace-nowrap text-sm font-medium border-b-2 ${
                      orderFilter === filter
                        ? "border-purple-700 text-purple-700"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    {filter === "all" && " Orders"}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
              <div className="relative w-full md:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search orders by ID, customer or status..."
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Show:</span>
                  <select className="border rounded-md py-2 px-3 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 focus:outline-none">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>

                <button className="flex items-center bg-white border px-4 py-2 rounded-md hover:bg-gray-50 transition">
                  <FaFilter className="mr-2 text-gray-600" />
                  <span className="text-gray-700">Filters</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button className="p-2 border rounded-md hover:bg-gray-50">
                    <FaDownload className="text-gray-600" />
                  </button>
                  <button className="p-2 border rounded-md hover:bg-gray-50">
                    <FaPrint className="text-gray-600" />
                  </button>
                  <button className="p-2 border rounded-md hover:bg-gray-50">
                    <FaSortAmountDown className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Sub Total
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Grand Total
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Order Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Channel
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedOrders.map((order) => (
                    <motion.tr
                      key={order.orderId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-blue-600">
                          ORD-096{order.orderId}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        ${order.totalPrice}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                        {order.grandTotal}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        {formatDate(order.order_date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-700">{order.channelName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.statusBanking
                          )}`}
                        >
                          {order.statusBanking}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        {order.user.fullName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition flex justify-end"
                            onClick={() => handleOrderDetail(order.orderId)}
                          >
                            <FaEye />
                          </button>

                          <button
                            className={`p-1 text-gray-600 hover:bg-gray-100 rounded-full transition ${
                              order.status != "Order_Cancelled" ? " " : "hidden"
                            } flex justify-start`}
                            onClick={() =>
                              UpdateStatus(order.orderId, order.status)
                            }
                          >
                            <FaFileExport />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 bg-white border-t">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">4</span> of{" "}
                  <span className="font-medium">24</span> results
                </div>
                {/* <div className="flex items-center space-x-2">
                  <button className="p-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <FaChevronLeft size={14} />
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-9 h-9 flex items-center justify-center rounded-md ${
                        page === 1
                          ? "bg-purple-700 text-white"
                          : "border text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="p-2 border rounded-md text-gray-600 hover:bg-gray-50">
                    <FaChevronRight size={14} />
                  </button>
                </div> */}

                <div className="flex justify-center space-x-2 mt-4">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        className={`w-9 h-9 flex items-center justify-center rounded-md ${
                          page === currentPage
                            ? "bg-purple-700 text-white"
                            : "border text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setCurrentPage(page)} // Khi nhấn, cập nhật trang hiện tại
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Current System Status */}
          <div className="text-xs text-gray-500 text-center mt-6">
            Current Date and Time (UTC): 2025-03-10 03:16:26 | Logged in as:
            NamProPlayer20
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;
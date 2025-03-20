import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaCreditCard,
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCalendarAlt,
  FaReceipt,
  FaChevronRight,
  FaArrowLeft,
  FaTag,
  FaPrint,
  FaHeadset,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { updateStatusOrder } from "../AdminPage/adminService";

const OrderDetails = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;
  if (!data || !data.productQuantities) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[1000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg mx-4 p-8 bg-white rounded-xl shadow-xl"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="text-center">
            <FaBox className="mx-auto text-gray-400 text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Order Data
            </h2>
            <p className="text-gray-500 mb-6">
              The order information could not be loaded.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusSteps = () => {
    const status = data.status || "Processing";

    const steps = [
      { title: "Order Placed", completed: true, icon: FaReceipt },
      {
        title: "Processing",
        completed: ["Processing", "Shipping", "Delivered"].includes(status),
        icon: FaBox,
      },
      {
        title: "Shipping",
        completed: ["Shipping", "Delivered"].includes(status),
        icon: FaTruck,
      },
      {
        title: "Delivered",
        completed: status === "Delivered",
        icon: FaCheckCircle,
      },
    ];

    return steps;
  };

  const productDetail = (id) => {
    onClose();
    navigate(`/detail/${id}`);
  };

  const statusSteps = getStatusSteps();
  const currentDate = "2025-03-15 07:26:12";

  function cancelOrder(id) {
    updateStatusOrder(id, { status: "Order_Cancelled" });
    onClose();
    window.location.reload();
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] overflow-y-auto py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Status */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Order #{data.orderId.toString().padStart(6, "0")}
                </h2>
                <button
                  className="rounded-full p-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>
              <div className="flex items-center mt-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    data.status === "Delivered"
                      ? "bg-green-400"
                      : data.status === "Shipping"
                      ? "bg-blue-400"
                      : data.status === "Order_Cancelled"
                      ? "bg-red-400"
                      : "bg-yellow-400"
                  }`}
                ></div>
                <span className="ml-2 font-medium">
                  {data.status || "Processing"}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Order Progress */}
              <div className="mb-8">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                  Order Progress
                </h3>
                <div className="flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <step.icon />
                      </div>
                      <p
                        className={`text-xs mt-2 ${
                          step.completed
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      {/* {index < statusSteps.length - 1 && (
                        <div
                          className="hidden md:block absolute h-0.5 bg-gray-200 w-24"
                          style={{
                            left: `calc(${(index + 1) * 19}%)`,
                            top: "30%",
                            width: "10%",
                          }}
                        ></div>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary & Customer Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" /> Order
                        Date
                      </span>
                      <span className="font-medium">
                        {formatDate(data.order_date)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <FaCreditCard className="mr-2 text-gray-400" /> Payment
                        Method
                      </span>
                      <span className="font-medium">
                        {data.statusBanking || "Credit Card"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <FaTag className="mr-2 text-gray-400" /> Items
                      </span>
                      <span className="font-medium">
                        {data.productQuantities.length}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 my-2 pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span className="text-indigo-600">
                          ${data.totalPrice?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Shipping Information
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600 flex items-center mb-1">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />{" "}
                        Shipping Address
                      </span>
                      <p className="font-medium">
                        {data.user.address || "No address provided"}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 flex items-center mb-1">
                        <FaPhoneAlt className="mr-2 text-gray-400" /> Contact
                        Number
                      </span>
                      <p className="font-medium">
                        {data.user.phone || "No phone provided"}
                      </p>
                    </div>
                    {data.estimatedDelivery && (
                      <div className="text-sm">
                        <span className="text-gray-600 flex items-center mb-1">
                          <FaTruck className="mr-2 text-gray-400" /> Estimated
                          Delivery
                        </span>
                        <p className="font-medium">{data.estimatedDelivery}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                  Ordered Items
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {data?.productQuantities?.map((item) => (
                    <motion.div
                      key={item.productId}
                      className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
                      whileHover={{
                        scale: 1.01,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div
                        className="w-20 h-20 rounded-lg overflow-hidden mr-4 flex-shrink-0 cursor-pointer"
                        onClick={() => productDetail(item.productId)}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div
                          className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => productDetail(item.productId)}
                        >
                          {item.productName}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-xl font-bold text-indigo-600">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-3 justify-between">
                <div>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    onClick={onClose}
                  >
                    <FaArrowLeft className="mr-2" /> Back to Orders
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <FaTruck className="mr-2" /> Track Order
                  </button>
                  <button
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                      data.status != "Ordered" ? " hidden" : ""
                    }`}
                    onClick={() => cancelOrder(data.orderId)}
                  >
                    <MdCancel className="mr-2" /> Cancel Order
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-between items-center text-gray-500 text-xs">
                <div>Last updated: {currentDate}</div>
                <div className="flex items-center">
                  <FaPrint
                    className="mr-1 hover:text-gray-700 cursor-pointer"
                    title="Print order"
                  />
                  <span className="mx-2">•</span>
                  <span>Need help? Contact support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetails;

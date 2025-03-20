import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  X,
  Clock,
  Info,
  FileText,
  CreditCard,
  Calendar,
} from "lucide-react";

const OrderPopup = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const isSuccessful = order.responseCode === "00";

  // Enhanced currency formatting
  const formatCurrency = (amount) => {
    if (!amount) return "0 VNĐ";

    // Parse the amount and format with thousands separators
    const numericAmount = Number(amount) / 100;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  // Enhanced timestamp formatting
  const formatVNPayTimestamp = (timestamp) => {
    if (!timestamp || timestamp.length !== 14) return "Not available";

    try {
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      const day = timestamp.substring(6, 8);
      const hour = timestamp.substring(8, 10);
      const minute = timestamp.substring(10, 12);
      const second = timestamp.substring(12, 14);

      // Create a formatted date string
      return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
    } catch (error) {
      console.error("Error parsing timestamp:", error);
      return "Invalid date format";
    }
  };

  // Get transaction details
  const getTransactionDetails = () => {
    return [
      {
        icon: <FileText size={18} />,
        label: "Reference",
        value: order.code || "N/A",
        color: "text-blue-600",
      },
      {
        icon: <CreditCard size={18} />,
        label: "Amount",
        value: formatCurrency(order.amount),
        color: "text-emerald-600",
      },
      {
        icon: <Calendar size={18} />,
        label: "Date",
        value: formatVNPayTimestamp(order.date),
        color: "text-violet-600",
      },
      {
        icon: <Info size={18} />,
        label: "Bank",
        value: order.bankCode || "Unknown",
        color: "text-amber-600",
      },
    ];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full relative overflow-hidden"
          >
            {/* Status Header */}
            <div
              className={`p-6 ${
                isSuccessful
                  ? "bg-emerald-50 dark:bg-emerald-900/30"
                  : "bg-red-50 dark:bg-red-900/30"
              }`}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                          bg-white/80 dark:bg-gray-700/80 rounded-full p-1 transition-all hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-4">
                <div
                  className={`rounded-full p-3 ${
                    isSuccessful
                      ? "bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400"
                  }`}
                >
                  {isSuccessful ? (
                    <CheckCircle size={28} strokeWidth={2} />
                  ) : (
                    <XCircle size={28} strokeWidth={2} />
                  )}
                </div>

                <div>
                  <h2
                    className={`text-xl font-bold ${
                      isSuccessful
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {isSuccessful ? "Payment Successful" : "Payment Failed"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {isSuccessful
                      ? "Your transaction has been completed"
                      : "There was an issue processing your payment"}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Transaction Details
              </h3>

              <div className="space-y-3">
                {getTransactionDetails().map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`${detail.color}`}>{detail.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {detail.label}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Info (optional) */}
              {order.orderInfo && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <Info size={14} />
                    <span>Order Information</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {order.orderInfo}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                         text-gray-700 dark:text-gray-300 py-2.5 rounded-lg font-medium text-sm transition-colors"
                onClick={onClose}
              >
                Close
              </motion.button>

              {isSuccessful && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  onClick={onClose}
                >
                  Continue Shopping
                </motion.button>
              )}
            </div>

            {/* Timestamp Footer */}
            <div className="px-6 pb-4 pt-0 flex justify-center">
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                <Clock size={12} className="mr-1" />
                <span>
                  Transaction processed at {formatVNPayTimestamp(order.date)}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderPopup;

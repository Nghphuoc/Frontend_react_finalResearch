import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

const OrderPopup = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    if (!amount) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN").format(Number(amount) / 100) + " VNĐ";
  };

  // Chuyển đổi timestamp VNPay sang định dạng dễ đọc
  const formatVNPayTimestamp = (timestamp) => {
    if (!timestamp || timestamp.length !== 14) return "Không xác định";

    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(8, 10);
    const minute = timestamp.substring(10, 12);
    const second = timestamp.substring(12, 14);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative"
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {order.responseCode === "00" ? (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto" size={50} />
            <h2 className="text-xl font-semibold text-green-600">
              Payment successful || 결제 성공
            </h2>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="text-red-500 mx-auto" size={50} />
            <h2 className="text-xl font-semibold text-red-600">
              Payment failed
            </h2>
          </div>
        )}

        <div className="mt-4">
          <p>
            <strong>Code:</strong> {order.code}
          </p>
          <p>
            <strong>Payment amount: </strong> {formatCurrency(order.amount)}
          </p>
          <p>
            <strong>Time:</strong> {formatVNPayTimestamp(order.date)}
          </p>
        </div>

        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default OrderPopup;

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

const OrderPopup = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;


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
          < X size={20}/>
        </button>

        {order.responseCode === "00" ? (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto" size={50} />
            <h2 className="text-xl font-semibold text-green-600">
              Thanh toán thành công
            </h2>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="text-red-500 mx-auto" size={50} />
            <h2 className="text-xl font-semibold text-red-600">
              Thanh toán thất bại
            </h2>
          </div>
        )}

        <div className="mt-4">
          <p>
            <strong>Mã đơn hàng:</strong> {order.id}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {order.amount} VNĐ
          </p>
          <p>
            <strong>Thời gian:</strong> {order.date}
          </p>
        </div>

        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          onClick={onClose}
        >
          Đóng
        </button>
      </motion.div>
    </div>
  );
};

export default OrderPopup;

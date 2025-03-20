import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InfoUserUpdate = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg mx-4 p-6 bg-white rounded-2xl shadow-xl border border-gray-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-700"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            {/* Order Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Update Info User
              </h2>
              <div className="pt-5 space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-5 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Update
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoUserUpdate;

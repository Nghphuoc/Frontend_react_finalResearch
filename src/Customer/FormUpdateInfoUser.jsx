import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const InfoUserUpdate = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  




  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[1000]">
      <div className="w-full max-w-lg mx-4 p-6 bg-white rounded-2xl shadow-xl border border-gray-300">
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
          <h2 className="text-xl font-bold text-gray-800">Update Info User</h2>

          <div className=" pt-5 space-y-4">
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
        <div className="pt-5 items-center justify-between space-x-4 text-center">
          
          <button className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
            Cancel
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoUserUpdate;

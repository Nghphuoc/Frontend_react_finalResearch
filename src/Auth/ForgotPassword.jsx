import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "./ServiceLogin";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPopup({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    
  };

  const userUpdate={
    email: email,
    phone: phone,
    password: newPassword,
  }

 async function handleSetNewPassword (){
    if (newPassword !== confirmPassword) {
      toast.error("password not match")
      return;
    }
    const response = await resetPassword(userUpdate);
    console.log(response);
    if(response. status === 200){
        toast.success("update password successfully");
        console.log("Reset password request:", { email, phone, newPassword });
        onClose();
    }
    
  }

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
        <Toaster />
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[420px]">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Forgot Password
          </h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <button
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white p-3 rounded-xl font-semibold hover:bg-blue-600 transition active:scale-95"
              onClick={handleSetNewPassword}
            >
              Reset Password
            </button>
            <button
              className="w-full bg-gray-300 p-3 rounded-xl font-semibold hover:bg-gray-400 transition active:scale-95"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
}

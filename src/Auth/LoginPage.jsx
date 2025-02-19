import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import jwtDecode from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setMail] = useState("");
  const [password, setPassword1] = useState("");
  const navigate = useNavigate();

  const onLoginHandler = async () => {
    try {
      if (!email || !password) {
        toast.error("Please enter both email and password.");
        return;
      }
      setLoading(true);

      const loginRequest = {
        email: email,
        password: password,
      };

      console.log(loginRequest);
      const response = await axios.post(
        "http://localhost:8080/api/auth/public/signin",
        loginRequest,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("Authorization", response.data.jwtToken);
      localStorage.setItem("role", response.data.roles);
      let role = localStorage.getItem("role");
      console.log(role);
      toast("login successfully!!!");
      // const Authorization = localStorage.getItem("Authorization");
      // console.log(Authorization)
      if (role === "ROLE_ADMIN") {
        navigate("/");
      } else {
        navigate("/userDetail");
      }
      localStorage.removeItem("role");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
      // setMail("");
      // setPassword1("");
    }
  };

  const onForgotPasswordHandler = () => {
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-indigo-200">
      <Toaster />
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden relative ">
        {/* Left Panel */}
        <div className="bg-blue-500 rounded-r-[120px] text-white p-12 flex flex-col justify-center items-center w-full md:w-1/2 transform transition hover:bg-indigo-500 hover:scale-105 ">
          <h2 className="text-4xl font-bold mb-4">Hello, Welcome!</h2>
          <p className="mb-6">Don't have an account?</p>
          <button
            className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full hover:bg-white hover:text-blue-500 transition duration-300"
            onClick={onForgotPasswordHandler}
          >
            Register
          </button>
        </div>

        {/* Right Panel */}
        <div className="p-12 w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              value={email}
              type="text"
              className="w-full p-4 border border-gray-300 rounded-full text-lg h-12"
              placeholder="Username"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              value={password}
              type="password"
              className="w-full p-4 border border-gray-300 rounded-full text-lg h-12"
              placeholder="Password"
              onChange={(e) => setPassword1(e.target.value)}
            />
          </div>
          <div className="mb-6 text-right">
            <a href="#" className="text-gray-600">
              Forgot Password?
            </a>
          </div>
          <button
            className="bg-blue-500 text-white py-3 px-8 rounded-full w-full text-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            onClick={onLoginHandler}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">or login with social platforms</p>
            <div className="flex justify-center space-x-4">
              {[FaGoogle, FaFacebookF, FaTwitter, FaLinkedinIn].map(
                (Icon, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                  >
                    <Icon />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

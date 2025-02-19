import React, { useState } from "react";
import "./SignUp_LogIn_Form.css"; // Import file CSS
import { FaGoogle, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getInfoUser } from "./ServiceLogin";

const SignUpLogInForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setMail] = useState("");
  const [password, setPassword1] = useState("");
  const [confirmPassword, setPassword2] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const onRegisterHandler = () => {
    setLoading(true);

    const registerRequest = {
      email: email,
      password: password,
      username: name,
      phone: "09087133661",
      address: "50 Ly thuong kiet, Q1, HCM",
    };

    if (!email || !password || !confirmPassword || !phone) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
      }
      console.log(registerRequest);
    }

    const registerResponse = axios.post(
      "http://localhost:8080/api/auth/public/signup",
      registerRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (registerResponse.status === 200) {
      toast.success("Registration successful");
      console.log("register successfully");
      //onLoginHandler();
    } else {
      toast.error("Registration failed");
    }
    setLoading(false);
  };


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

      const Authorization = localStorage.getItem("Authorization");
      console.log(Authorization)

      const responseUser = await getInfoUser(loginRequest);
      console.log("data user", responseUser);
      localStorage.setItem("userId", responseUser.data.userId);
      localStorage.setItem("userName", responseUser.data.fullName);
      localStorage.setItem("cartId",responseUser.data.cart.cartId)
      toast.success("login successfully!!!");

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
  // from-white to-indigo-200
  return (
    <div className="bg-gradient-to-tl from-white to-indigo-200 min-h-screen flex justify-center items-center">
      <div className=" flex justify-center items-center min-h-screen">
        <div className={`container ${isActive ? "active" : ""} `}>
          <Toaster />
          <div className="form-box login">
            <form action="#">
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword1(e.target.value)}
                />
              </div>
              <div className="forgot-link">
                <a href="#">Forgot Password?</a>
              </div>
              <button
                className="btn hover:bg-indigo-500"
                onClick={onLoginHandler}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p>or login with social platforms</p>
              <div className="flex justify-center space-x-4">
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaGoogle />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </form>
          </div>

          <div className="form-box register">
            <form action="#">
              <h1>Registration</h1>
              <div className="input-box">
                <input
                  value={name}
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  value={email}
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  value={password}
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword1(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  value={confirmPassword}
                  type="password"
                  placeholder="confirm Password"
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              <button
                className="btn hover:bg-indigo-500 "
                onClick={onRegisterHandler}
                disabled={loading}
              >
                {loading ? "Register in..." : "Register"}
              </button>
              <p>or register with social platforms</p>
              <div className="flex justify-center space-x-4">
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaGoogle />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-4 rounded-full hover:bg-gray-200 transition duration-300"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </form>
          </div>

          <div className="toggle-box">
            <div
              className={`toggle-panel toggle-left ${
                !isActive ? "active" : ""
              }`}
            >
              <h1 className="text-center">Hello, Welcome To TechShop!</h1>
              <p>Don't have an account?</p>
              <button
                className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full hover:bg-white hover:text-blue-500 transition duration-300"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </div>

            <div
              className={`toggle-panel toggle-right ${
                isActive ? "active" : ""
              }`}
            >
              <h1>Welcome Back! </h1>
              <p>Already have an account?</p>
              <button
                className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full hover:bg-white hover:text-blue-500 transition duration-300"
                onClick={handleLoginClick}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpLogInForm;

import React from "react";
import { FaOpencart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
function NavBar() {

    const navigate = useNavigate();
    
      function handelClickCart(){
        navigate("/uploadimg");
      }

      function handelClickProfile(){
        navigate("/userDetail");
      }

  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 border-b">
        {/* Logo */}
        <div className="flex items-center">
          <img src="" alt="Logo" className="mr-2" />
          <span className="text-3xl font-bold">
            Tech<span className="text-green-500">Shop</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xl font-bold">
          {/* {["Home", "Collections", "Watches", "Quick find", "Pages"].map(
                    (item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="text-gray-600 hover:text-black"
                      >
                        {item}
                      </a>
                    )
                  )} */}
          <a href="#" className="text-gray-600 hover:text-black">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-black">
            Collections
          </a>
          <a href="#" className="text-gray-600 hover:text-black">
            Watches
          </a>
          <a href="#" className="text-gray-600 hover:text-black">
            Quick find
          </a>
          <a href="#" className="text-gray-600 hover:text-black">
            Pages
          </a>
        </nav>

        {/* Contact & Cart */}
        <div className="flex items-center space-x-4 pr-5">
          {/* <button className="bg-black text-white px-4 py-2 rounded-full text-xl">
                    Contact Us
                  </button> */}
          <div className="relative text-2xl pr-3 text-[#16A34A]">
            <button onClick={handelClickProfile}>
              <FaUser />
            </button>
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2">
              4
            </span>
          </div>
          <div className="relative text-3xl pr-3 text-[#16A34A]">
            <button onClick={handelClickCart}>
              <PiShoppingCartFill />
            </button>
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2">
              1
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;

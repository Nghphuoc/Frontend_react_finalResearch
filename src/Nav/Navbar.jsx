import React from "react";
import { FaOpencart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NavBar() {

    const navigate = useNavigate();
    
      function handelClickCart(){
        navigate("/#");
      }

  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 border-b">
                {/* Logo */}
                <div className="flex items-center">
                  <img src=""alt="Logo" className="mr-2" />
                  <span className="text-xl font-bold">
                    Tech<span className="text-green-500">Shop</span>
                  </span>
                </div>
      
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6 text-lg font-bold">
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
                <div className="flex items-center space-x-4">
                  <button className="bg-black text-white px-4 py-2 rounded-full">
                    Contact Us
                  </button>
                  <div className="relative text-3xl">
                    <button onClick={handelClickCart}>
                      <FaOpencart />
                    </button>
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2">
                      0
                    </span>
                  </div>
                </div>
              </div>
    </>
  );
}

export default NavBar;

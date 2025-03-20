import React, { useState } from "react";
import { FaUser, FaSearch, FaBars } from "react-icons/fa";
import { PiShoppingCartFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function handleClickCart() {
    navigate("/cart");
  }

  function handleClickProfile() {
    navigate("/userDetail");
  }

  function handleClickLogout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("Authorization");
    sessionStorage.removeItem("cartId");
    navigate("/home");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  }

  return (
    <div className="bg-gray-100 shadow-md border-b px-6 py-4 flex justify-between items-center ">
      {/* Logo */}
      <div className="text-3xl font-bold">
        Tech<span className="text-green-500">Shop</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 text-lg font-bold ">
        <a href="/" className="text-gray-600 hover:text-black">
          Home
        </a>
        <a href="/cart" className="text-gray-600 hover:text-black">
          Collections
        </a>
        <a href="/#" className="text-gray-600 hover:text-black">
          Watches
        </a>
        <a href="/#" className="text-gray-600 hover:text-black">
          Quick find
        </a>
        <a
          href="/home"
          className="text-gray-600 hover:text-black"
          onClick={handleClickLogout}
        >
          Pages
        </a>
      </nav>

      {/* Search Bar + Icons */}
      <div className="flex items-center space-x-4 ">
        {/* Search Input */}
        

        {/* User & Cart Icons */}
        <button
          onClick={handleClickProfile}
          className="text-2xl text-green-500"
        >
          <FaUser />
        </button>
        <button onClick={handleClickCart} className="text-3xl text-green-500">
          <PiShoppingCartFill />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col items-center md:hidden">
          <a href="/" className="py-2 text-gray-600 hover:text-black">
            Home
          </a>
          <a href="/cart" className="py-2 text-gray-600 hover:text-black">
            Collections
          </a>
          <a href="/uploadimg" className="py-2 text-gray-600 hover:text-black">
            Watches
          </a>
          <a href="/detail" className="py-2 text-gray-600 hover:text-black">
            Quick find
          </a>
          <a
            href="/home"
            className="py-2 text-gray-600 hover:text-black"
            onClick={handleClickLogout}
          >
            Pages
          </a>
          <form className="w-full mt-2" onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-2 text-gray-500"
              >
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NavBar;




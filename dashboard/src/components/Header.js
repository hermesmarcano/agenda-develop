import React, { useContext, useState } from "react";
import {
  FaBell,
  FaCog,
  FaUser,
  FaPaintBrush,
  FaXing,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { IoMdColorPalette } from "react-icons/io";
import { FiX, FiSun, FiMoon } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [colorDiv, setColorDiv] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  console.log("theme: " + theme);

  const handleThemeChange = (color) => {
    setTheme(color);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can also add logic to persist the user's preference using local storage or a state management library
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    localStorage.removeItem("ag_app_shop_token");
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 text-gray-500 shadow-lg py-4 px-6 flex justify-between items-center z-10 bg-gray-100`}
    >
      <div className="flex items-center">
        <h1 className={`text-xl font-bold text-gray-900`}>Dashboard</h1>
      </div>
      <div className="flex items-center">
        <button className={`mr-4 focus:outline-none`}>
          <FaBell className={`w-6 h-6 text-gray-400`} />
        </button>
        <div className="relative">
          <button
            className={`relative z-10 flex justify-center items-center border h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open user menu</span>
            <FaUser className={`w-6 h-6 text-gray-400`} />
          </button>
          {isMenuOpen && (
            <div
              className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 text-gray-800 bg-white ring-1 ring-black ring-opacity-5`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <Link
                to="/settings"
                className={`block px-4 py-2 text-sm items-center`}
                role="menuitem"
              >
                <FaCog
                  className={`inline-block w-4 h-4 mr-2 text-gray-700 hover:bg-gray-100`}
                />
                <span className={`text-gray-700 hover:bg-gray-100`}>
                  Settings
                </span>
              </Link>
              <button
                onClick={logout}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left`}
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center ml-2">
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-yellow-400"
            }`}
            onClick={toggleDarkMode}
            style={{ transition: "background-color 0.3s" }}
          >
            {isDarkMode ? (
              <FiMoon className="text-white text-xl" />
            ) : (
              <FiSun className="text-yellow-500 text-xl" />
            )}
          </button>

          {/* {colorDiv && (
            <>
              <div
                className={`fixed z-20 inset-0 bg-gray-900 bg-opacity-50`}
                onClick={() => setColorDiv(false)}
              ></div>
              <div className="fixed z-30 right-0 top-0 animate-scale-up-tr shadow-md rounded-lg bg-white p-4 space-y-2">
                <div className="flex flex-wrap justify-center items-center">
                  <button
                    className={`w-10 h-10 rounded-full bg-gray-800 text-white  transition-colors flex items-center justify-center relative mr-1`}
                  >
                    <IoMdColorPalette className="w-6 h-6" />
                    <span className="absolute inset-0.5 rounded-full bg-transparent border-2 border-white"></span>
                  </button>
                  <button
                    className={`w-10 h-10 rounded-full bg-gray-800 text-white hover:text-gray-800 hover:bg-gray-50 hover:shadow-inner transition-colors flex items-center justify-center relative mr-1`}
                  >
                    <IoMdColorPalette className="w-6 h-6" />
                  </button>
                  <button
                    className={`w-10 h-10 rounded-full bg-gray-800 text-white hover:text-gray-800 hover:bg-gray-50 hover:shadow-inner transition-colors flex items-center justify-center relative mr-1`}
                  >
                    <IoMdColorPalette className="w-6 h-6" />
                  </button>
                </div>
                <button
                  className={`absolute top-1 right-1 text-gray-500 hover:text-gray-800 hover:scale-150 transition-transform focus:outline-none`}
                  onClick={() => setColorDiv(false)}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </>
          )} */}
        </div>
      </div>
    </header>
  );
}

export default Header;

import React, { useContext, useEffect, useState } from "react";
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
import { NotificationContext } from "../context/NotificationContext";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [colorDiv, setColorDiv] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const { notifications, unreadCount, updateNotificationsSeen } =
    useContext(NotificationContext);

  const handleThemeChange = (color) => {
    setTheme(color);
    localStorage.setItem("currentTheme", color);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkLightMode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
    localStorage.setItem("currentTheme", theme);
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowMenu(false);
  };

  const logout = () => {
    localStorage.removeItem("ag_app_shop_token");
    navigate("/login");
  };

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    setIsMenuOpen(false);
    updateNotificationsSeen(); // Mark all notifications as read when menu is opened
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 shadow-lg py-4 px-6 flex justify-between items-center z-10 ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-500"
      }`}
    >
      <div className="flex items-center">
        <h1
          className={`text-xl font-bold ${
            isDarkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          Dashboard
        </h1>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <button
            className="mr-4 flex justify-center items-center shadow border h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={handleMenuToggle}
          >
            <FaBell className="w-6 h-6 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-5 transform translate-x-1/2 -translate-y-1/2 text-xs font-semibold bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 flex justify-center items-center overflow-y-auto bg-opacity-25"
                onClick={() => setShowMenu(false)}
              ></div>
              <div
                className={`absolute right-0 mt-2 w-64 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-lg z-10`}
              >
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className={`p-4  ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        } rounded-lg cursor-pointer`}
                      >
                        {notification.content}
                      </div>
                    ))
                  ) : (
                    <div className={`p-4 text-center text-gray-400`}>
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
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
            <>
              <div
                className="fixed inset-0 flex justify-center items-center overflow-y-auto bg-opacity-25"
                onClick={() => setIsMenuOpen(false)}
              ></div>
              <div
                className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-800"
                } ring-1 ring-black ring-opacity-5`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsMenuOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm items-center w-full text-left ${
                    isDarkMode
                      ? "text-gray-200 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  role="menuitem"
                >
                  <FaCog className={`inline-block w-4 h-4 mr-2`} />
                  <span
                    className={`${
                      isDarkMode
                        ? "text-gray-200 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Settings
                  </span>
                </button>
                <button
                  onClick={logout}
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode
                      ? "text-gray-200 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  } w-full text-left`}
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center ml-2">
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              !isDarkMode ? "bg-gray-700" : "bg-yellow-400"
            }`}
            onClick={toggleDarkLightMode}
            style={{ transition: "background-color 0.3s" }}
          >
            {isDarkMode ? (
              <FiSun className="text-yellow-500 text-xl" />
            ) : (
              <FiMoon className="text-white text-xl" />
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

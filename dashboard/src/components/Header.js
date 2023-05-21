import React, { useContext, useState } from "react";
import { FaBell, FaCog, FaUser, FaPaintBrush, FaXing } from "react-icons/fa";
import { IoMdColorPalette } from "react-icons/io";
import { FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [colorDiv, setColorDiv] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = (color) => {
    // setTheme(color);
    axios
      .patch(
        "http://localhost:4040/managers",
        { theme: color },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("ag_app_shop_token"),
          },
        }
      )
      .then((res) => {
        setTheme(color);
        console.log(res);
      });
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
      className={`fixed top-0 left-0 right-0 text-${theme}-500 shadow-lg py-4 px-6 flex justify-between items-center z-10`}
    >
      <div className="flex items-center">
        <h1 className={`text-xl font-bold text-${theme}-900`}>Dashboard</h1>
      </div>
      <div className="flex items-center">
        <button className={`mr-4 focus:outline-none`}>
          <FaBell className={`w-6 h-6 text-${theme}-400`} />
        </button>
        <div className="relative">
          <button
            className={`relative z-10 flex justify-center items-center border h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme}-500`}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open user menu</span>
            <FaUser className={`w-6 h-6 text-${theme}-400`} />
          </button>
          {isMenuOpen && (
            <div
              className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 text-${theme}-800 bg-white ring-1 ring-black ring-opacity-5`}
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
                  className={`inline-block w-4 h-4 mr-2 text-${theme}-700 hover:bg-${theme}-100`}
                />
                <span className={`text-${theme}-700 hover:bg-${theme}-100`}>
                  Settings
                </span>
              </Link>
              <button
                onClick={logout}
                className={`block px-4 py-2 text-sm text-${theme}-700 hover:bg-${theme}-100 w-full text-left`}
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className={`ml-4 focus:outline-none cursor-pointer`}
            onClick={() => setColorDiv(!colorDiv)}
          >
            <FaPaintBrush className={`w-6 h-6 text-${theme}-400`} />
          </button>
          {colorDiv && (
            <>
              <div
                className={`fixed z-20 inset-0 bg-gray-900 bg-opacity-50`}
                onClick={() => setColorDiv(false)}
              ></div>
              <div className="fixed z-30 right-0 top-0 animate-scale-up-tr shadow-md rounded-lg bg-white p-4 space-y-2">
                <div className="flex flex-wrap justify-center items-center">
                  {[
                    "gray",
                    "sky",
                    "orange",
                    "teal",
                    "yellow",
                    "amber",
                    "emerald",
                    "pink",
                    "rose",
                  ].map((color, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full bg-${color}-800 text-white hover:text-${color}-800 hover:bg-gray-50 hover:shadow-inner transition-colors flex items-center justify-center relative mr-1`}
                      onClick={() => handleThemeChange(color)}
                    >
                      <IoMdColorPalette className="w-6 h-6" />
                      {theme === color && (
                        <span className="absolute inset-0.5 rounded-full bg-transparent border-2 border-white"></span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  className={`absolute top-1 right-1 text-${theme}-500 hover:text-${theme}-800 hover:scale-150 transition-transform focus:outline-none`}
                  onClick={() => setColorDiv(false)}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

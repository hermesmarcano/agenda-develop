import React, { useState } from "react";
import { FaBell, FaCog, FaUser, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    localStorage.removeItem("ag_app_shop_token");
    navigate("/login");
  };
  return (
    <header className="fixed top-0 left-0 right-0 text-gray-500 shadow-lg py-4 px-6 flex justify-between items-center z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
      </div>
      <div className="flex items-center">
        <button className="mr-4 focus:outline-none">
          <FaBell className="w-6 h-6" />
        </button>
        <div className="relative">
          <button
            className="relative z-10 flex justify-center items-center border h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open user menu</span>
            <FaUser className="w-6 h-6" />
          </button>
          {isMenuOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <Link
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Your Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <FaCog className="inline-block w-4 h-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={logout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        <button className="ml-4 focus:outline-none">
          <FaBars className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}

export default Header;

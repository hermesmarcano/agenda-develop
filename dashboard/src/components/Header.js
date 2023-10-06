import React, { useContext, useEffect, useState } from "react";
import { FaBell, FaCog, FaUser } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import { DarkModeContext } from "../context/DarkModeContext";
import instance from "../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notifications, unreadCount, updateNotificationsSeen } =
    useContext(NotificationContext);

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const [websiteTitle, setWebsiteTitle] = useState('Dashboard');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    instance.get("admin")
      .then(response => {
        if (response.data?.admin?.websiteTitle) {
          setWebsiteTitle(response.data.admin.websiteTitle)
        }
        if (response.data?.admin?.logo) {
          setLogo(response.data.admin.logo)
        }
      })
  }, [])

  const toggleDarkLightMode = () => {
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
    updateNotificationsSeen();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 shadow-lg py-4 px-6 flex justify-between items-center z-10 ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-500"
        }`}
    >
      <div className="flex items-center">
        <h1
          className={`text-xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
        >
          {logo && <img src={logo} alt="logo" className="mr-2" />}{websiteTitle}
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
            <div
              className={`absolute right-0 mt-2 w-64 ${isDarkMode ? "bg-gray-700" : "bg-white"
                } rounded-lg shadow-lg z-10`}
            >
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-gray-300">
                  <div className="flex justify-end items-center">
                    <Link
                      to="/notifications"
                      className="text-blue-500 text-xs hover:underline"
                    >
                      {t('View All')}
                    </Link>
                  </div>
                </div>

                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`p-4 ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                        } rounded-lg cursor-pointer`}
                    >
                      {notification.content}
                    </div>
                  ))
                ) : (
                  <div className={`p-4 text-center text-gray-400`}>
                    {t('No notifications')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className={`relative z-10 flex justify-center items-center border h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            onClick={toggleMenu}
          >
            <span className="sr-only">{t('Open user menu')}</span>
            <FaUser className={`w-6 h-6 text-gray-400`} />
          </button>
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 flex justify-center items-center overflow-y-auto bg-opacity-25"
                onClick={() => setIsMenuOpen(false)}
              ></div>
              <div
                className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${isDarkMode
                  ? "bg-gray-700 text-gray-200"
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
                  className={`block px-4 py-2 text-sm items-center w-full text-left ${isDarkMode
                    ? "text-gray-200 hover:bg-gray-600"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  role="menuitem"
                >
                  <FaCog className={`inline-block w-4 h-4 mr-2`} />
                  <span
                    className={`${isDarkMode
                      ? "text-gray-200 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Settings
                  </span>
                </button>
                <button
                  onClick={logout}
                  className={`block px-4 py-2 text-sm ${isDarkMode
                    ? "text-gray-200 hover:bg-gray-600"
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
            className={`flex items-center justify-center w-10 h-10 rounded-full ${!isDarkMode ? "bg-gray-700" : "bg-yellow-400"
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
        </div>
      </div>
    </header>
  );
}

export default Header;

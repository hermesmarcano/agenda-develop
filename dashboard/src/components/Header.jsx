import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { FiMoon, FiSun } from "react-icons/fi";
import { Link } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import { FaAngleRight, FaBell, FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "../images/logo.svg";
import logoLight from "../images/logo light gray.svg";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const [activeLanguage, setActiveLanguage] = React.useState("es");
  const { notifications, unreadCount, updateNotificationsSeen } =
    useContext(NotificationContext);

  const changeLanguage = () => {
    activeLanguage === "en"
      ? i18n.changeLanguage("es")
      : i18n.changeLanguage("en");
    activeLanguage === "en" ? setActiveLanguage("es") : setActiveLanguage("en");
  };

  const toggleDarkLightMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    updateNotificationsSeen();
  };

  return (
    <header className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"} sticky top-0`}>
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center sm:justify-between sm:gap-4">
          <div className="relative hidden sm:block">
            <Link className="flex items-center text-teal-600" to="/">
              <span className="sr-only">{t("Home")}</span>
                <img
                  className="w-24"
                  src={!isDarkMode ? logo : logoLight}
                  alt="App logo"
                />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-between gap-8 sm:justify-end">
            <div className="flex gap-4">

              <button
                className={`block shrink-0 rounded-lg p-2.5 text-gray-600 shadow-sm hover:text-gray-700 ${
                  isDarkMode ? "bg-teal-600" : "bg-white"
                }`}
                onClick={() => changeLanguage()}
              >
                <span className="sr-only">{t("Language")}</span>
                {activeLanguage === "en" ? "ES" : "EN"}
              </button>

              <div className="relative">
                <button
                  className={`block shrink-0 rounded-lg p-2.5 text-gray-600 shadow-sm hover:text-gray-700 ${
                    isDarkMode ? "bg-teal-600" : "bg-white"
                  }`}
                  onClick={handleMenuToggle}
                >
                  <span className="sr-only">{t("Notifications")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>

                  {unreadCount > 0 && unreadCount < 11 && (
                    <span className="absolute top-2 right-3 transform translate-x-1/2 -translate-y-1/2 text-xs font-semibold bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white">
                      {unreadCount}
                    </span>
                  )}

                  {unreadCount > 11 && (
                    <span className="absolute top-2 right-3 transform translate-x-1/2 -translate-y-1/2 text-xs font-semibold bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white">
                      10
                    </span>
                  )}
                </button>

                {showMenu && (
                  <NotificationMenu
                    notifications={notifications}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>

              <button
                className={`block shrink-0 rounded-lg p-2.5 text-gray-600 shadow-sm hover:text-gray-700 ${
                  !isDarkMode ? "bg-gray-700" : "bg-yellow-400"
                }`}
                onClick={toggleDarkLightMode}
                style={{ transition: "background-color 0.3s" }}
              >
                <span className="sr-only">{t("Dark/Light")}</span>
                {isDarkMode ? (
                  <FiSun className="text-yellow-500 text-xl" />
                ) : (
                  <FiMoon className="text-white text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

function NotificationMenu({ notifications, isDarkMode }) {
  const { t } = useTranslation();
  function calculateTimeDifference(startDate) {
    const currentTime = new Date();
    const timeDifferenceMillis = currentTime - startDate;

    const minutesPassed = Math.floor(timeDifferenceMillis / (60 * 1000));

    if (minutesPassed < 60) {
      return (
        <>
          <span>{minutesPassed}</span>
          <span>m</span>
        </>
      );
    }

    const hoursPassed = Math.floor(minutesPassed / 60);

    if (hoursPassed < 24) {
      return (
        <>
          <span>{hoursPassed}</span>
          <span>h</span>
        </>
      );
    }

    const daysPassed = Math.floor(hoursPassed / 24);

    if (daysPassed < 7) {
      return (
        <>
          <span>{daysPassed}</span>
          <span>d</span>
        </>
      );
    }

    return "7 d";
  }

  return (
    <div
      className={`absolute right-0 mt-2 w-64 ${
        isDarkMode ? "bg-gray-700" : "bg-white"
      } rounded-lg shadow-lg z-10`}
    >
      <div className="max-h-64 overflow-y-auto no-scrollbar">
        <div
          className={`p-4 border-b border-gray-300 sticky top-0 z-10 ${
            isDarkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center">
            <Link
              to="/notifications"
              className="text-teal-600 text-xs flex items-center hover:underline"
            >
              {t("View all")} <FaAngleRight />
            </Link>
          </div>
        </div>

        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className={`p-4 ${
                isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
              } rounded-lg cursor-pointer`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="text-gray-600 flex items-center text-sm">
                    <FaBell size={20} className="mr-2" />
                    {notification.content}
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <FaClock className="text-xs text-gray-400 mr-1" />{" "}
                  <span className="flex items-center text-xxs text-gray-400">
                    {notification.createdAt &&
                      calculateTimeDifference(new Date(notification.createdAt))}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`p-4 text-center text-gray-400`}>
            {t("No notifications")}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { FiMoon, FiSun } from "react-icons/fi";
import { Link } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";
import { NotificationContext } from "../context/NotificationContext";
import { FaAngleRight, FaBell, FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeLanguage, setActiveLanguage] = React.useState("es");
  const [websiteTitle, setWebsiteTitle] = useState("Dashboard");
  const [logo, setLogo] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notifications, unreadCount, updateNotificationsSeen } =
    useContext(NotificationContext);

  const changeLanguage = () => {
    activeLanguage === "en"
      ? i18n.changeLanguage("es")
      : i18n.changeLanguage("en");
    activeLanguage === "en" ? setActiveLanguage("es") : setActiveLanguage("en");
    // i18n.changeLanguage(lang);
    // setActiveLanguage(lang);
  };

  const locales = {
    en: { title: "English", flag: "🇬🇧" },
    es: { title: "Español", flag: "🇪🇸" },
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkLightMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    instance.get("admin").then((response) => {
      if (response.data?.admin?.websiteTitle) {
        setWebsiteTitle(response.data.admin.websiteTitle);
      }
      if (response.data?.admin?.logo) {
        setLogo(response.data.admin.logo);
      }
    });
  }, []);

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    setIsMenuOpen(false);
    updateNotificationsSeen();
  };

  return (
    <header className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"} sticky top-0`}>
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center sm:justify-between sm:gap-4">
          <div className="relative hidden sm:block">
            <Link className="flex items-center text-teal-600" to="/">
              <span className="sr-only">{t("Home")}</span>
              {logo ? (
                <img
                  className="h-12 w-12 object-cover border-gray-400 bg-white"
                  src={logo}
                  alt="App logo"
                />
              ) : (
                <svg
                  className="h-8"
                  viewBox="0 0 28 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              <span className="ml-2">{websiteTitle}</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-between gap-8 sm:justify-end">
            <div className="flex gap-4">
              {/* <div>
                <div className="flex">
                  {Object.keys(locales).map((locale) => (
                    <button
                      key={locale}
                      onClick={() => changeLanguage(locale)}
                      className={`px-4 py-2 text-sm ${
                        locale === activeLanguage
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {locales[locale].flag}
                    </button>
                  ))}
                </div>
                <div>
                  {Object.keys(locales).map((locale) => (
                    <div
                      key={locale}
                      className={`${
                        locale === activeLanguage ? "block" : "hidden"
                      } text-gray-700`}
                    ></div>
                  ))}
                </div>
              </div> */}

              <button
                className={`block shrink-0 rounded-lg p-2.5 text-gray-600 shadow-sm hover:text-gray-700 ${
                  isDarkMode ? "bg-teal-600" : "bg-white"
                }`}
                onClick={() => changeLanguage()}
              >
                <span className="sr-only">{t("Language")}</span>
                {activeLanguage === "en" ? "ES" : "EN"}
              </button>

              {/* <button
                className={`block shrink-0 rounded-lg p-2.5 text-gray-600 shadow-sm hover:text-gray-700 ${
                  isDarkMode ? "bg-teal-600" : "bg-white"
                }`}
              >
                <span className="sr-only">{t("Messages")}</span>
                <svg
                  className="svg-icon"
                  viewBox="0 0 20 20"
                  style={{ width: "1.2em", height: "1.2em" }}
                >
                  <path
                    d="M17.657 2.982H2.342a.426.426 0 00-.425.426v10.21c0 .234.191.426.425.426h3.404v2.553c0 .397.48.547.725.302l2.889-2.854h8.298a.427.427 0 00.426-.426V3.408a.429.429 0 00-.427-.426m-.425 10.21H9.185a.428.428 0 00-.3.124l-2.289 2.262v-1.96a.427.427 0 00-.425-.426H2.767V3.833h14.465v9.359zM10 7.237a1.49 1.49 0 00-1.489 1.489A1.49 1.49 0 0010 10.215a1.49 1.49 0 000-2.978m0 2.127a.64.64 0 01-.638-.638.64.64 0 01.638-.638.64.64 0 01.638.638.64.64 0 01-.638.638m4.254-2.127a1.49 1.49 0 00-1.489 1.489c0 .821.668 1.489 1.489 1.489s1.489-.668 1.489-1.489a1.49 1.49 0 00-1.489-1.489m0 2.127a.64.64 0 01-.638-.638.64.64 0 011.277 0 .64.64 0 01-.639.638M5.746 7.237a1.49 1.49 0 00-1.489 1.489 1.49 1.49 0 001.489 1.489 1.49 1.49 0 001.489-1.489 1.492 1.492 0 00-1.489-1.489m0 2.127a.64.64 0 01-.638-.638.64.64 0 01.638-.638.64.64 0 01.638.638.64.64 0 01-.638.638"
                    style={{
                      fill: "none",
                      stroke: "rgb(55 65 81 / 1)",
                      strokeWidth: "1.05",
                    }}
                  ></path>
                </svg>
              </button> */}

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

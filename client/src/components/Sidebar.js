import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiSettings,
  FiMenu,
  FiX,
  FiShoppingBag,
  FiBook,
  FiFileText,
  FiArchive,
  FiRewind,
} from "react-icons/fi";

import { GiSwordsPower } from "react-icons/gi";
import { FaBookOpen } from "react-icons/fa";
import { RiToolsFill } from "react-icons/ri";
import { BiStore } from "react-icons/bi";
import { TfiLayoutMediaLeft } from "react-icons/tfi";
import { TfiLayoutMediaRight } from "react-icons/tfi";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [showHomeTooltip, setShowHomeTooltip] = useState(true);
  const [showHeroTooltip, setShowHeroTooltip] = useState(false);
  const [showShopsTooltip, setShowShopsTooltip] = useState(false);
  const [showArticlesTooltip, setShowArticlesTooltip] = useState(false);
  const [showSettingsTooltip, setShowSettingsTooltip] = useState(false);
  const [showServicesTooltip, setShowServicesTooltip] = useState(false);
  const [showSection1Tooltip, setShowSection1Tooltip] = useState(false);
  const [showSection2Tooltip, setShowSection2Tooltip] = useState(false);

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="md:flex md:flex-row md:h-screen">
      {/* Sidebar */}
      <nav
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block md:w-64 bg-gray-900 text-white px-4 pt-4 pb-8 overflow-y-auto`}
      >
        <div className="text-center mb-4">
          <Link to="/" className="text-2xl font-bold">
            Booking App
          </Link>
        </div>
        <ul className="mt-6">
          <li className="my-px">
            <Link
              to="/ag-admin/"
              onClick={() => handleClick("home")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "home"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FiHome className="mr-3 h-6 w-6" />
              <span className="flex-1">Home</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/ag-admin/hero"
              onClick={() => handleClick("hero")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "hero"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <GiSwordsPower className="mr-3 h-6 w-6" />
              <span className="flex-1">Hero Section</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/ag-admin/shops"
              onClick={() => handleClick("shops")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "shops"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <BiStore className="mr-3 h-6 w-6" />
              <span className="flex-1">Recommended Shops</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/ag-admin/services"
              onClick={() => handleClick("services")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "services"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <RiToolsFill className="mr-3 h-6 w-6" />
              <span className="flex-1">Recommended Services</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/ag-admin/articles"
              onClick={() => handleClick("articles")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "articles"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FaBookOpen className="mr-3 h-6 w-6" />
              <span className="flex-1">Articles</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/ag-admin/section1"
              onClick={() => handleClick("section1")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "section1"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <TfiLayoutMediaLeft className="mr-3 h-6 w-6" />
              <span className="flex-1">Section 1</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/ag-admin/section2"
              onClick={() => handleClick("section2")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "section2"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <TfiLayoutMediaRight className="mr-3 h-6 w-6" />
              <span className="flex-1">Section 2</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/ag-admin/settings"
              onClick={() => handleClick("settings")}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                activeLink === "settings"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FiSettings className="mr-3 h-6 w-6" />
              <span className="flex-1">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-between items-center px-4 py-2 z-20">
        <nav
          className={`${
            isSidebarOpen ? "hidden" : "block"
          } md:hidden fixed bottom-0 left-0 w-full bg-gray-900 text-white px-4 py-5 overflow-y-auto`}
        >
          <ul className="flex w-full justify-evenly">
            <li className="my-px">
              <Link
                to="/ag-admin/"
                onClick={() => {
                  handleClick("home");
                  setIsSidebarOpen(true);
                }}
                onMouseEnter={() => setShowHomeTooltip(true)}
                onMouseLeave={() => setShowHomeTooltip(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "home"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <FiHome className="h-6 w-6" />
                  {showHomeTooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      Home
                    </div>
                  )}
                </div>
              </Link>
            </li>
            <li className="my-px">
              <Link
                to="/ag-admin/hero"
                onClick={() => handleClick("hero")}
                onMouseEnter={() => setShowHeroTooltip(true)}
                onMouseLeave={() => setShowHeroTooltip(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "hero"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <GiSwordsPower className="h-6 w-6" />
                  {showHeroTooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      Hero
                    </div>
                  )}
                </div>
              </Link>
            </li>
            <li className="my-px">
              <Link
                to="/ag-admin/shops"
                onClick={() => handleClick("shops")}
                onMouseEnter={() => setShowShopsTooltip(true)}
                onMouseLeave={() => setShowShopsTooltip(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "shops"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <BiStore className="h-6 w-6" />
                  {showShopsTooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      Shops
                    </div>
                  )}
                </div>
              </Link>
            </li>
            <li className="my-px">
              <Link
                to="/ag-admin/services"
                onClick={() => handleClick("services")}
                onMouseEnter={() => setShowServicesTooltip(true)}
                onMouseLeave={() => setShowServicesTooltip(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "services"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <RiToolsFill className="h-6 w-6" />
                  {showServicesTooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      Services
                    </div>
                  )}
                </div>
              </Link>
            </li>
            <li className="my-px">
              <Link
                to="/ag-admin/articles"
                onClick={() => handleClick("articles")}
                onMouseEnter={() => setShowArticlesTooltip(true)}
                onMouseLeave={() => setShowArticlesTooltip(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "favorites"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <FaBookOpen className="h-6 w-6" />
                  {showArticlesTooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      Articles
                    </div>
                  )}
                </div>
              </Link>
            </li>
            <li className="my-px">
              <Link
                to="/ag-admin/section1"
                onClick={() => handleClick("section1")}
                onMouseEnter={() => setShowSection1Tooltip(true)}
                onMouseLeave={() => setShowSection1Tooltip(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "section1"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <TfiLayoutMediaLeft className="h-6 w-6" />
                  {showSection1Tooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      sec1
                    </div>
                  )}
                </div>
              </Link>
            </li>
            <li className="my-px">
              <Link
                to="/ag-admin/section2"
                onClick={() => handleClick("section2")}
                onMouseEnter={() => setShowSection2Tooltip(true)}
                onMouseLeave={() => setShowSection2Tooltip(false)}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "section2"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <TfiLayoutMediaRight className="h-6 w-6" />
                  {showSection2Tooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      sec2
                    </div>
                  )}
                </div>
              </Link>
            </li>
            <li className="my-px">
              <Link
                to="/ag-admin/settings"
                onMouseEnter={() => setShowSettingsTooltip(true)}
                onMouseLeave={() => setShowSettingsTooltip(false)}
                onClick={() => {
                  handleClick("settings");
                  setIsSidebarOpen(true);
                }}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeLink === "settings"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <FiSettings className="h-6 w-6" />
                  {showSettingsTooltip && (
                    <div className="bg-gray-800 text-white text-xs rounded-md px-1 py-0.5 absolute -left-2 bottom-8">
                      Settings
                    </div>
                  )}
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
export default Sidebar;

import React, { useState, useEffect, useContext } from "react";
import {
  FaBold,
  FaChevronLeft,
  FaChevronRight,
  FaCalendar,
  FaUsers,
  FaCogs,
  FaChartPie,
  FaUserTie,
  FaShoppingCart,
  FaStore,
} from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";
import instance from "../axiosConfig/axiosConfig";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Agenda");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tabs = [
    {
      name: "Agenda",
      icon1: <FaCalendar className="text-gray-400 h-7 w-7" />,
      icon2: <FaCalendar className="text-gray-400 h-6 w-6" />,
      link: "/",
    },
    {
      name: "Checkout",
      icon1: <GiPayMoney className="text-gray-400 h-7 w-7" />,
      icon2: <GiPayMoney className="text-gray-400 h-6 w-6" />,
      link: "/checkout-appointments",
    },
    {
      name: "Clients",
      icon1: <FaUsers className="text-gray-400 h-7 w-7" />,
      icon2: <FaUsers className="text-gray-400 h-6 w-6" />,
      link: "/clients",
    },
    {
      name: "Services",
      icon1: <FaCogs className="text-gray-400 h-7 w-7" />,
      icon2: <FaCogs className="text-gray-400 h-6 w-6" />,
      link: "/services",
    },
    {
      name: "Analytics",
      icon1: <FaChartPie className="text-gray-400 h-7 w-7" />,
      icon2: <FaChartPie className="text-gray-400 h-6 w-6" />,
      link: "/analytics",
    },
    {
      name: "Professionals",
      icon1: <FaUserTie className="text-gray-400 h-7 w-7" />,
      icon2: <FaUserTie className="text-gray-400 h-6 w-6" />,
      link: "/professionals",
    },
    {
      name: "Products",
      icon1: <FaShoppingCart className="text-gray-400 h-7 w-7" />,
      icon2: <FaShoppingCart className="text-gray-400 h-6 w-6" />,
      link: "/products",
    },
  ];

  const { shopId, setShopId } = useContext(SidebarContext);
  const [shopName, setShopName] = useState("");
  const token = localStorage.getItem("ag_app_shop_token");
  useEffect(() => {
    instance
      .get("managers/", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          localStorage.removeItem("ag_app_shop_token");
          navigate("/login");
        }

        return response.data;
      })
      .then((data) => {
        setShopName(data.shopName);
        setShopId(data._id);
      })

      .catch((errors) => console.log(errors));
  }, [shopId]);

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.link === location.pathname)?.name;
    if (activeTab) setActiveTab(activeTab);
  }, [location.pathname, tabs]);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 640;
      setIsSmallScreen(isSmall);

      if (isSmall && isSidebarOpen) {
        toggleSidebar(false);
      }
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, [isSidebarOpen, toggleSidebar]);

  const handleClick = (tabName, url) => {
    setActiveTab(tabName);
    navigate(url);
  };

  return (
    <div
      className={`h-[calc(100%-40px)] z-10 shadow-lg fixed left-0 w-56 ${isDarkMode ? "bg-gray-600" : "bg-teal-800"
        } overflow-y-auto transition-all duration-300 ${isSidebarOpen
          ? "translate-x-0 ease-out px-1"
          : "-translate-x-36 ease-in"
        }`}
    >
      <div className="flex items-center justify-center mt-8">
        {!isSidebarOpen && (
          <div className="w-full flex justify-end pe-6 pb-5 border-b-2">
            <FaStore className="text-gray-400 h-9 w-9" />
          </div>
        )}
        {isSidebarOpen && (
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-white">
              <FaStore className="text-gray-800 text-3xl" />
            </div>
            <span className="text-white text-lg ml-2 font-semibold">
              {shopName}
            </span>
          </div>
        )}
      </div>

      <nav className="mt-10">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`w-full flex items-center mt-4 py-2 px-6 ${isDarkMode
              ?
              activeTab === tab.name ? "bg-gray-700" : "bg-gray-900"
              :

              activeTab === tab.name ? "bg-teal-700" : "bg-teal-900"
              } ${isSidebarOpen && "rounded-lg"}`}
            onClick={() => {
              handleClick(tab.name, tab.link);
            }}
          >
            {!isSidebarOpen && (
              <div className="w-full flex justify-end pe-2">{tab.icon1}</div>
            )}
            {isSidebarOpen && (
              <>
                {tab.icon2}
                <span className="mx-3 text-white text-sm">{tab.name}</span>
              </>
            )}
          </button>
        ))}
      </nav>
      {!isSmallScreen && (
        <div className="absolute bottom-0 right-0 mb-8">
          <button
            className={`flex items-center mx-auto px-3 py-2 ${isDarkMode ? "bg-gray-700" : "bg-teal-700"} rounded-lg`}
            onClick={() => toggleSidebar(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <FaChevronLeft className="text-white h-6 w-6" />
            ) : (
              <FaChevronRight className="text-white h-6 w-6" />
            )}
            {isSidebarOpen && <span className="mx-3 text-white">Collapse</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

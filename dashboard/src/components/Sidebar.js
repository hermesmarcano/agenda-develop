import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import {
  FaBold,
  FaChevronLeft,
  FaChevronRight,
  FaCalendar,
  FaList,
  FaUsers,
  FaCogs,
  FaChartPie,
  FaUserTie,
  FaShoppingCart,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SidebarContext from "../context/SidebarContext";
// import logo from "./logo.png";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Agenda");

  const tabs = [
    {
      name: "Agenda",
      icon1: <FaCalendar className="text-gray-400 h-7 w-7" />,
      icon2: <FaCalendar className="text-gray-400 h-6 w-6" />,
      link: "/",
    },
    {
      name: "Appointments List",
      icon1: <FaList className="text-gray-400 h-7 w-7" />,
      icon2: <FaList className="text-gray-400 h-6 w-6" />,
      link: "/appointments",
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
      name: "Finance",
      icon1: <FaChartPie className="text-gray-400 h-7 w-7" />,
      icon2: <FaChartPie className="text-gray-400 h-6 w-6" />,
      link: "/finance",
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

  const { shopName, setShopName } = useContext(SidebarContext);

  useEffect(() => {
    fetch("http://localhost:4040/managers/", {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("ag_app_shop_token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          localStorage.removeItem("ag_app_shop_token");
          navigate("/login");
        }

        return response.json();
      })
      .then((data) => {
        console.log(data.shopName);
        setShopName(data.shopName);
      })

      .catch((errors) => console.log(errors));
  }, [shopName]);

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.link === location.pathname)?.name;
    if (activeTab) setActiveTab(activeTab);
  }, [location.pathname, tabs]);

  const handleClick = (tabName, url) => {
    setActiveTab(tabName);
    navigate(url);
  };

  return (
    <div
      className={`h-[calc(100%-40px)] z-10 fixed left-0 w-56 bg-gray-800 overflow-y-auto transition-all duration-300 ${
        isSidebarOpen
          ? "translate-x-0 ease-out px-1"
          : "-translate-x-36 ease-in"
      }`}
    >
      <div className="flex items-center justify-center mt-8">
        {!isSidebarOpen && (
          <div className="w-full flex justify-end pe-6 pb-5 border-b-2">
            <FaBold className="text-gray-400 h-9 w-9" />
          </div>
        )}
        {isSidebarOpen && (
          <span className="text-white text-lg border rounded-md border-white py-2 px-4 mx-2 font-semibold">
            {shopName}
          </span>
        )}
      </div>

      <nav className="mt-10">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`w-full flex items-center mt-4 py-2 px-6 ${
              activeTab === tab.name ? "bg-gray-700" : "bg-gray-900"
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
      <div className="absolute bottom-0 right-0 mb-8">
        <button
          className="flex items-center mx-auto px-3 py-2 bg-gray-700 rounded-lg"
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
    </div>
  );
};

export default Sidebar;

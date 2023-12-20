import React, { useState, useEffect, useContext } from "react";
import { TbReportMoney } from "react-icons/tb";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";
import instance from "../axiosConfig/axiosConfig";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineShoppingBag, HiOutlineUsers } from "react-icons/hi";
import {
  BsArrowBarLeft,
  BsArrowBarRight,
  BsGraphUpArrow,
  BsPersonGear,
} from "react-icons/bs";
import { AiOutlineSetting, AiOutlineTags } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const Side = ({ isSidebarOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Agenda");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const [myShopImg, setMyShopImg] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tabs = [
    {
      name: t("Agenda"),
      icon: <IoCalendarOutline size={20} className="mr-2" />,
      icon2: <IoCalendarOutline size={20} />,
      link: "/",
    },
    {
      name: t("Customers"),
      icon: <HiOutlineUsers size={20} className="mr-2" />,
      icon2: <HiOutlineUsers size={20} />,
      link: "/customers",
    },
    {
      name: t("Professionals"),
      icon: <BsPersonGear size={20} className="mr-2" />,
      icon2: <BsPersonGear size={20} />,
      link: "/professionals",
    },
    {
      name: t("Services"),
      icon: <AiOutlineTags size={20} className="mr-2" />,
      icon2: <AiOutlineTags size={20} />,
      link: "/services",
    },
    {
      name: t("Products"),
      icon: <HiOutlineShoppingBag size={20} className="mr-2" />,
      icon2: <HiOutlineShoppingBag size={20} />,
      link: "/products",
    },
    {
      name: t("Analytics"),
      icon: <BsGraphUpArrow size={20} className="mr-2" />,
      icon2: <BsGraphUpArrow size={20} />,
      link: "/analytics",
    },
    {
      name: t("Checkout"),
      icon: <TbReportMoney size={20} className="mr-2" />,
      icon2: <TbReportMoney size={20} />,
      link: "/checkout-appointments",
    },
    {
      name: t("Settings"),
      icon: <AiOutlineSetting size={20} className="mr-2" />,
      icon2: <AiOutlineSetting size={20} />,
      link: "/Settings",
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
        setMyShopImg(data.profileImg);
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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen, toggleSidebar]);

  const handleClick = (tabName, url) => {
    setActiveTab(tabName);
    navigate(url);
  };

  const logout = () => {
    localStorage.removeItem("ag_app_shop_token");
    navigate("/login");
  };

  return (
    <div
      className={`h-[calc(100%-72px)] z-10 shadow-lg fixed left-0 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } overflow-y-auto overflow-x-hidden transition-all duration-300 flex flex-col justify-between 
      ${isSidebarOpen ? "w-[190px]" : "w-16 ease-in"}
      `}
    >
      {isSidebarOpen ? (
        <>
          <div className="px-4 py-6">
            <span className="grid mx-auto h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
              {shopName}
            </span>

            <ul className="mt-6 space-y-1">
              {tabs.map((tab, index) => {
                return (
                  <>
                    <li key={index}>
                      <button
                        className="w-full text-left"
                        onClick={() => {
                          handleClick(tab.name, tab.link);
                        }}
                      >
                        <Link
                          to="/"
                          className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                            activeTab === tab.name
                              ? "bg-teal-600 text-white"
                              : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                          }`}
                        >
                          {tab.icon}
                          {tab.name}
                        </Link>
                      </button>
                    </li>
                    {index === 0 && <hr />}
                  </>
                );
              })}
            </ul>
          </div>
          <div className="inset-x-0 absolute bottom-0 border-t border-gray-100">
            <div className="w-full flex">
              <button
                onClick={logout}
                className="w-full flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-teal-100 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-75"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>

                <span className="ml-2">{t("Logout")}</span>
              </button>
              <button
                className="flex justify-center items-center rounded-lg text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-teal-100 hover:text-gray-700 w-[25%]"
                onClick={() => toggleSidebar(!isSidebarOpen)}
              >
                {isSidebarOpen ? <BsArrowBarLeft /> : <BsArrowBarRight />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-between items-center">
            <div className="flex items-center justify-center p-2">
              <span className="grid place-content-center rounded-lg bg-gray-100 text-xs text-gray-600 p-1">
                <img className="object-cover" src={myShopImg} alt="Shop logo" />
              </span>
            </div>

            <div className="border-t border-gray-100">
              <div className="px-2">
                <div className="py-4">
                  <button
                    className="w-full text-left"
                    onClick={() => {
                      handleClick(tabs[0].name, tabs[0].link);
                    }}
                  >
                    <Link
                      to="/"
                      className={`group relative flex justify-center rounded px-2 py-1.5 ${
                        activeTab === tabs[0].name
                          ? "bg-teal-600 text-white"
                          : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                      }`}
                    >
                      {tabs[0].icon2}
                    </Link>
                  </button>
                </div>

                <ul className="space-y-1 border-t border-gray-100 pt-4">
                  {tabs.map((tab, index) => {
                    return (
                      index !== 0 && (
                        <li key={index}>
                          <button
                            className="w-full text-left"
                            onClick={() => {
                              handleClick(tab.name, tab.link);
                            }}
                          >
                            <Link
                              to="/customers"
                              className={`group relative flex justify-center rounded px-2 py-1.5 ${
                                activeTab === tab.name
                                  ? "bg-teal-600 text-white"
                                  : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                              }`}
                            >
                              {tab.icon2}
                            </Link>
                          </button>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-auto inset-x-0 border-t border-gray-100 p-2">
            <button
              className="group relative flex w-full min-h-[32px] justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-teal-100 hover:text-gray-700"
              onClick={() => toggleSidebar(!isSidebarOpen)}
            >
              {isSidebarOpen ? <BsArrowBarLeft /> : <BsArrowBarRight />}
              <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                {t("Expand")}
              </span>
            </button>
            <button
              onClick={logout}
              className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-teal-100 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>

              <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                {t("Logout")}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Side;

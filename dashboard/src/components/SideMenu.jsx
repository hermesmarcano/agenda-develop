import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSetting, AiOutlineTags } from "react-icons/ai";
import { BsGraphUpArrow, BsPersonGear, BsArrowBarRight, BsArrowBarLeft } from "react-icons/bs";
import { HiOutlineShoppingBag, HiOutlineUsers } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";
import instance from "../axiosConfig/axiosConfig";

const SideMenu = () => {
  const navigate = useNavigate();
  const { shopId, setShopId } = useContext(SidebarContext);
  const { isSidebarOpen } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [expanded, setExpanded] = useState(false);
  const [selectedTag, setSelectedTag] = useState("agenda");
  const [shopName, setShopName] = useState("");
  const [myShopImg, setMyShopImg] = useState("");
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
        setMyShopImg(data.profileImg);
        setShopName(data.shopName);
        setShopId(data._id);
      })

      .catch((errors) => console.log(errors));
  }, [shopId]);

  const logout = () => {
    localStorage.removeItem("ag_app_shop_token");
    navigate("/login");
  };

  const handleExpansion = () => {
    setExpanded(!expanded);
  }

  return (
    <div
    className={`flex h-[100%] overflow-y-auto flex-col justify-between border-e ${
    expanded
      ? "w-56 overflow-x-hidden"
      : "w-16 overflow-x-hidden"
  } ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    } transition-all duration-300`}
  >
      {expanded ? (
        <>
          <div className="px-4 py-6">
            <span
              className="grid mx-auto h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"
            >
              {shopName}
            </span>

            <ul className="mt-6 space-y-1">
              <li>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("agenda")}
                >
                  <Link
                    to="/"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      selectedTag === "agenda"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <IoCalendarOutline size={20} className="mr-2" />
                    Agenda
                  </Link>
                </button>
              </li>
              <hr />

              <li>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("customers")}
                >
                  <Link
                    to="/customers"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      selectedTag === "customers"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <HiOutlineUsers size={20} className="mr-2" />
                    Customers
                  </Link>
                </button>
              </li>

              <li>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("professionals")}
                >
                  <Link
                    to="/professionals"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      selectedTag === "professionals"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <BsPersonGear size={20} className="mr-2" />
                    Professionals
                  </Link>
                </button>
              </li>

              <li>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("services")}
                >
                  <Link
                    to="/services"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      selectedTag === "services"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <AiOutlineTags size={20} className="mr-2" />
                    Services
                  </Link>
                </button>
              </li>

              <li>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("products")}
                >
                  <Link
                    to="/products"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      selectedTag === "products"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <HiOutlineShoppingBag size={20} className="mr-2" />
                    Products
                  </Link>
                </button>
              </li>

              <li>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("analytics")}
                >
                  <Link
                    to="/analytics"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      selectedTag === "analytics"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <BsGraphUpArrow size={20} className="mr-2" />
                    Analytics
                  </Link>
                </button>
              </li>

              <li>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("settings")}
                >
                  <Link
                    to="/settings"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      selectedTag === "settings"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <AiOutlineSetting size={20} className="mr-2" />
                    Settings
                  </Link>
                </button>
              </li>

              
            </ul>
          </div>
          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 mb-1">
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

                  <span className="ml-2">Logout</span>
                </button>
                <button className="flex justify-center items-center rounded-lg text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-teal-100 hover:text-gray-700 w-[25%]"
                  onClick={handleExpansion}
                >
                  {expanded ? <BsArrowBarLeft /> : <BsArrowBarRight />}
                </button>
              </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-center p-2">
              <span
                className="grid place-content-center rounded-lg bg-gray-100 text-xs text-gray-600 p-1"
                onClick={() => setExpanded(true)}
              >
                <img
              className="object-cover border-gray-400 bg-white mr-2 mb-2 md:mb-0 md:mr-3"
              src={myShopImg}
              alt="Shop logo"
            />
              </span>
            </div>

            <div className="border-t border-gray-100">
              <div className="px-2">
                <div className="py-4">
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("agenda")}
                >
                  <Link
                    to="/"
                    className={`group relative flex justify-center rounded px-2 py-1.5 ${
                      selectedTag === "agenda"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                  >
                    <IoCalendarOutline size={20} color="#555" />

                    <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                      Agenda
                    </span>
                  </Link>
                  </button>
                </div>

                <ul className="space-y-1 border-t border-gray-100 pt-4">
                  <li>
                  <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("customers")}
                >
                  <Link
                    to="/customers"
                      className={`group relative flex justify-center rounded px-2 py-1.5 ${
                      selectedTag === "customers"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                    >
                      <HiOutlineUsers size={20} color="#555" />
                      <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                        Customers
                      </span>
                    </Link>
                    </button>
                  </li>

                  <li>
                  <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("professionals")}
                >
                  <Link
                    to="/professionals"
                      className={`group relative flex justify-center rounded px-2 py-1.5 ${
                      selectedTag === "professionals"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                    >
                      <BsPersonGear size={20} color="#555" />

                      <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                        Professionals
                      </span>
                    </Link>
                    </button>
                  </li>

                  <li>
                  <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("services")}
                >
                  <Link
                    to="/services"
                      className={`group relative flex justify-center rounded px-2 py-1.5 ${
                      selectedTag === "services"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                    >
                      <AiOutlineTags size={20} color="#555" />

                      <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                        Services
                      </span>
                    </Link>
                    </button>
                  </li>

                  <li>
                  <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("products")}
                >
                  <Link
                    to="/products"
                      className={`group relative flex justify-center rounded px-2 py-1.5 ${
                      selectedTag === "products"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                    >
                      <HiOutlineShoppingBag size={20} color="#555" />

                      <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                        Products
                      </span>
                    </Link>
                    </button>
                  </li>

                  <li>
                  <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("analytics")}
                >
                  <Link
                    to="/analytics"
                      className={`group relative flex justify-center rounded px-2 py-1.5 ${
                      selectedTag === "analytics"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                    >
                      <BsGraphUpArrow size={20} color="#555" />

                      <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                        Analytics
                      </span>
                    </Link>
                    </button>
                  </li>

                  <li>
                  <button
                  className="w-full text-left"
                  onClick={() => setSelectedTag("settings")}
                >
                  <Link
                    to="/settings"
                      className={`group relative flex justify-center rounded px-2 py-1.5 ${
                      selectedTag === "settings"
                        ? "bg-teal-600 text-white"
                        : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                    }`}
                    >
                      <AiOutlineSetting size={20} color="#555" />

                      <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                        Settings
                      </span>
                    </Link>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="inset-x-0 bottom-0 border-t border-gray-100 p-2">
              <button className="group relative flex w-full min-h-[32px] justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-teal-100 hover:text-gray-700"
                  onClick={handleExpansion}
                >
                  {expanded ? <BsArrowBarLeft /> : <BsArrowBarRight />}
                  <span className="absolute start-full z-30 top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                  Expand
                </span>
                </button>
              <button
                type="submit"
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
                  Logout
                </span>
              </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SideMenu;

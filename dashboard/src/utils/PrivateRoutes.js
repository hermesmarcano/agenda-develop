import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Side from "../components/Side.jsx";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";
import instance from "../axiosConfig/axiosConfig.js";
import { FaSpinner } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const PrivateRoutes = () => {
  const token = localStorage.getItem("ag_app_shop_token");
  const isAuthenticated = !!token;
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation()

  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      instance
        .get("managers/id", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response.data?.subscription?.planEndDate);
          setLoading(false)
          setSubscriptionEndDate(response.data?.subscription?.planEndDate);
        });
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if(loading) {
    return (
      <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center space-x-2">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <span className="mt-2">{t('Loading...')}</span>
          </div>
        </div>
    )
  }

  if (subscriptionEndDate && new Date(subscriptionEndDate.toString()).getTime() > new Date().getTime()) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100%-82px)]">
          <Side
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <div
            className={`bg-gray-200 ${
              isSidebarOpen ? "ml-[190px]" : "ml-16"
            } flex-1 overflow-auto
            ${
              isDarkMode
                ? "bg-gray-600 text-gray-200"
                : "bg-gray-100 text-gray-600"
            }
            `}
          >
            <Outlet />
          </div>
        </div>
      </>
    );
  } else {
    return <Navigate to="/subscribe" />;
  }
};
export default PrivateRoutes;

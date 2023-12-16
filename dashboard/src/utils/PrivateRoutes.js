import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Side from "../components/Side.jsx";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";
import instance from "../axiosConfig/axiosConfig.js";

const PrivateRoutes = () => {
  const token = localStorage.getItem("ag_app_shop_token");
  const isAuthenticated = !!token;
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      instance
        .get("managers/id", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setSubscriptionId(response.data?.subscription?._id);
        });
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (subscriptionId === null) {
    return <Navigate to="/payment-success" />;
  }

  if (subscriptionId) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100%-72px)]">
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

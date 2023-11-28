import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Side from "../components/Side.jsx";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("ag_app_shop_token");
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const { isDarkMode } = useContext(DarkModeContext);

  return isAuthenticated ? (
    <>
      <Header />
      <div className="flex h-[calc(100%-72px)]">
        <Side isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
  ) : (
    <Navigate to="/login" />
  );
};
export default PrivateRoutes;

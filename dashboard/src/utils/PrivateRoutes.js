import { Outlet, Navigate } from "react-router-dom";
// import Header from "../components/Header";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar";
import SideMenu from "../components/SideMenu.jsx";
import Side from "../components/Side.jsx"
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
      {/* <div className="flex mt-[72px] h-[calc(100%-50px)]"> */}
      <div className="flex h-[calc(100%-72px)]">
        <Side isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {/* <SideMenu/> */}
        <div
          className={`bg-gray-200 ${isSidebarOpen ? "ml-[190px]" : "ml-16"
            } flex-1 overflow-auto
          ${isDarkMode
              ? "bg-gray-600 text-gray-200"
              : "bg-gray-100 text-gray-600"
            }
          `}
        >
          {/* <div
          className={`bg-gray-200
         flex-1
          ${isDarkMode
              ? "bg-gray-600 text-gray-200"
              : "bg-gray-100 text-gray-600"
            }
          `}
        > */}
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;

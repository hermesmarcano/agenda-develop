import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import SidebarContext from "../context/SidebarContext";

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("ag_app_shop_token");
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  return isAuthenticated ? (
    <>
      <Header />
      <div className="flex mt-[65px] h-[calc(100%-50px)]">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`bg-gray-200 ${
            isSidebarOpen ? "ml-[224.102px]" : "ml-[80px]"
          } flex-1 overflow-auto bg-gray-100`}
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

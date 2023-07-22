import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import SidebarContext from "../context/SidebarContext";
import { AlertContext } from "../context/AlertContext";
import Alert from "../components/Alert";

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("ag_app_shop_token");
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const {
    alertOn,
    setAlertOn,
    alertMsg,
    setAlertMsg,
    alertMsgType,
    setAlertMsgType,
  } = useContext(AlertContext);

  return isAuthenticated ? (
    <>
      {alertOn && (
        <Alert type={alertMsgType} message={alertMsg} setBooked={setAlertOn} />
      )}
      <Header />
      <div className="flex mt-[72px] h-[calc(100%-50px)]">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`bg-gray-200 ${
            isSidebarOpen ? "ml-[224.102px]" : "ml-[80px]"
          } flex-1 overflow-auto`}
        >
          <Outlet />
        </div>
        {/* <div
          className={`bg-gray-800 text-cyan-600 ${
            isSidebarOpen ? "ml-[224.102px]" : "ml-[80px]"
          } flex-1 overflow-auto`}
        >
          <Outlet />
        </div> */}
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;

import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SideMenu from "../components/SideMenu.jsx";
import { useContext } from "react";
import Alert from "../components/Alert";
import { AlertContext } from "../context/AlertContext";
import { DarkModeContext } from "../context/DarkModeContext";

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("ag_app_shop_token");
  const {
    alertOn,
    setAlertOn,
    alertMsg,
    alertMsgType,
  } = useContext(AlertContext);
  const { isDarkMode } = useContext(DarkModeContext);

  return isAuthenticated ? (
    <>
      {alertOn && (
        <Alert type={alertMsgType} message={alertMsg} setBooked={setAlertOn} />
      )}
      <Header />
      <div className="flex h-[calc(100%-64px)]">
        <SideMenu/>
        
       
        <div
          className={`bg-gray-200
         flex-1
          ${isDarkMode
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

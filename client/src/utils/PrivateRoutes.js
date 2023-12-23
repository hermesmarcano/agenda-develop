import { Outlet, Navigate } from "react-router-dom";
import Helmet from 'react-helmet'
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("ag_app_admin_token");

  return isAuthenticated ? (
    <>
      <Helmet>
      <title>Icuts - admin</title>
        <link rel="icon" type="image/png" href="logo.svg" />
      </Helmet>
      <Header />
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex flex-col flex-1 w-full overflow-x-hidden mb-20">
          <main className="h-full overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/ag-admin/login" />
  );
};

export default PrivateRoutes;

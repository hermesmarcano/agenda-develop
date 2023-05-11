import { Outlet, Navigate } from "react-router-dom";
// import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("adminToken");

  return isAuthenticated ? (
    <>
      <Header />
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex flex-col flex-1 w-full overflow-x-hidden">
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

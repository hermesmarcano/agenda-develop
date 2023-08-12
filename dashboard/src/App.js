import "./App.css";
import { useState, useContext } from "react";
import Agenda from "./pages/Agenda";
import Clients from "./pages/Clients";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import SidebarContext from "./context/SidebarContext";
import Professionals from "./pages/Professionals";
import Register from "./pages/Register";
import AppointmentsList from "./pages/AppointmentsList";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import PrivateRoutes from "./utils/PrivateRoutes";
import DateTimeContext from "./context/DateTimeContext";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import CheckEmail from "./pages/CheckEmail";
import ViewModeContext from "./context/ViewModeContext";
import ProfessionalIdContext from "./context/ProfessionalIdContext";
import Checkout from "./pages/Checkout";
import PendingAppointments from "./pages/PendingAppointments";
import { AlertContextWrapper } from "./context/AlertContext";
import { NotificationContextWrapper } from "./context/NotificationContext";
import { DarkModeContextWrapper } from "./context/DarkModeContext";

function App() {
  const [isSidebarOpen, toggleSidebar] = useState(true);
  const [shopId, setShopId] = useState("");
  const [shopName, setShopName] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");
  const [professionalId, setProfessionalId] = useState("");

  return (
    <div className="h-screen overflow-hidden">
      <NotificationContextWrapper>
        <AlertContextWrapper>
          <DarkModeContextWrapper>
            <ViewModeContext.Provider
              value={{
                viewMode: viewMode,
                setViewMode: setViewMode,
              }}
            >
              <ProfessionalIdContext.Provider
                value={{
                  professionalId: professionalId,
                  setProfessionalId: setProfessionalId,
                }}
              >
                <DateTimeContext.Provider
                  value={{
                    dateTime: dateTime,
                    setDateTime: setDateTime,
                  }}
                >
                  <SidebarContext.Provider
                    value={{
                      isSidebarOpen: isSidebarOpen,
                      toggleSidebar: toggleSidebar,
                      shopId: shopId,
                      setShopId: setShopId,
                      shopName: shopName,
                      setShopName: setShopName,
                    }}
                  >
                    <HashRouter>
                      <Routes>
                        <Route element={<PrivateRoutes />}>
                          <Route path="/" exact element={<Agenda />} />
                          <Route path="/agenda" exact element={<Agenda />} />
                          <Route path="/clients" element={<Clients />} />
                          <Route
                            path="/appointments"
                            element={<AppointmentsList />}
                          />
                          <Route
                            path="/professionals"
                            element={<Professionals />}
                          />
                          <Route path="/products" element={<Products />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route
                            path="/checkout-appointments"
                            element={<PendingAppointments />}
                          />
                          <Route
                            path="/checkout"
                            exact
                            element={<Checkout />}
                          />
                        </Route>
                        <Route path="/register" exact element={<Register />} />
                        <Route path="/login" exact element={<Login />} />
                        <Route
                          path="/forgot-password"
                          exact
                          element={<ForgotPassword />}
                        />
                        <Route
                          path="/check-email"
                          exact
                          element={<CheckEmail />}
                        />
                        <Route
                          path="/reset-password"
                          exact
                          element={<PasswordReset />}
                        />
                        <Route
                          path="/reset-password/:token"
                          exact
                          element={<PasswordReset />}
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </HashRouter>
                  </SidebarContext.Provider>
                </DateTimeContext.Provider>
              </ProfessionalIdContext.Provider>
            </ViewModeContext.Provider>
          </DarkModeContextWrapper>
        </AlertContextWrapper>
      </NotificationContextWrapper>
    </div>
  );
}

export default App;

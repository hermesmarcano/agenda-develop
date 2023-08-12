import "./App.css";
import Agenda from "./pages/Agenda";
import Clients from "./pages/Clients";
import Login from "./pages/Login";
import { HashRouter, Route, Routes } from "react-router-dom";
import Professionals from "./pages/Professionals";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import PrivateRoutes from "./utils/PrivateRoutes";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import CheckEmail from "./pages/CheckEmail";
import Checkout from "./pages/Checkout";
import PendingAppointments from "./pages/PendingAppointments";
import { SidebarContextWrapper } from "./context/SidebarContext";
import { ViewModeContextWrapper } from "./context/ViewModeContext";
import { ProfessionalIdContextWrapper } from "./context/ProfessionalIdContext";
import { DateTimeContextWrapper } from "./context/DateTimeContext";
import { AlertContextWrapper } from "./context/AlertContext";
import { NotificationContextWrapper } from "./context/NotificationContext";
import { DarkModeContextWrapper } from "./context/DarkModeContext";

function App() {
  return (
    <div className="h-screen overflow-hidden">
      <NotificationContextWrapper>
        <AlertContextWrapper>
          <DarkModeContextWrapper>
            <ViewModeContextWrapper>
              <ProfessionalIdContextWrapper>
                <DateTimeContextWrapper>
                  <SidebarContextWrapper>
                    <HashRouter>
                      <Routes>
                        <Route element={<PrivateRoutes />}>
                          <Route path="/" exact element={<Agenda />} />
                          <Route path="/agenda" exact element={<Agenda />} />
                          <Route path="/clients" element={<Clients />} />
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
                  </SidebarContextWrapper>
                </DateTimeContextWrapper>
              </ProfessionalIdContextWrapper>
            </ViewModeContextWrapper>
          </DarkModeContextWrapper>
        </AlertContextWrapper>
      </NotificationContextWrapper>
    </div>
  );
}

export default App;

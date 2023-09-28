import "./App.css";
import { HashRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import Agenda from "./pages/agenda/Agenda";
import Customers from "./pages/customers/Customers";
import Login from "./pages/login/Login";
import Professionals from "./pages/professionals/Professionals";
import Register from "./pages/register/Register";
import Products from "./pages/products/Products";
import Services from "./pages/services/Services";
import Analytics from "./pages/analytics/Analytics";
import NotFound from "./pages/notFound/NotFound";
import Settings from "./pages/settings/Settings";
import PrivateRoutes from "./utils/PrivateRoutes";
import ForgotPassword from "./pages/forgetPassword/ForgotPassword";
import PasswordReset from "./pages/passwordReset/PasswordReset";
import CheckEmail from "./pages/checkEmail/CheckEmail";
import Checkout from "./pages/checkout/Checkout";
import PendingAppointments from "./pages/pendingAppointments/PendingAppointments";
import { SidebarContextWrapper } from "./context/SidebarContext";
import { ViewModeContextWrapper } from "./context/ViewModeContext";
import { ProfessionalIdContextWrapper } from "./context/ProfessionalIdContext";
import { DateTimeContextWrapper } from "./context/DateTimeContext";
import { AlertContextWrapper } from "./context/AlertContext";
import { NotificationContextWrapper } from "./context/NotificationContext";
import { DarkModeContextWrapper } from "./context/DarkModeContext";
import Notification from "./pages/notification/Notification";
import { ReactNotifications } from "react-notifications-component";
import { ShopNameContextWrapper } from "./context/ShopNameContext";

function App() {
  return (
    <div className="h-screen overflow-hidden">
      <NotificationContextWrapper>
        <AlertContextWrapper>
          <ShopNameContextWrapper>
          <DarkModeContextWrapper>
            <ViewModeContextWrapper>
              <ProfessionalIdContextWrapper>
                <DateTimeContextWrapper>
                  <SidebarContextWrapper>
                    <BrowserRouter>
                    <ReactNotifications />
                      <Routes>
                        <Route element={<PrivateRoutes />}>
                          <Route path="/" exact element={<Agenda />} />
                          <Route path="/agenda" exact element={<Agenda />} />
                          <Route path="/customers" element={<Customers />} />
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
                          <Route
                            path="/notifications"
                            exact
                            element={<Notification />}
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
                    </BrowserRouter>
                  </SidebarContextWrapper>
                </DateTimeContextWrapper>
              </ProfessionalIdContextWrapper>
            </ViewModeContextWrapper>
          </DarkModeContextWrapper>
          </ShopNameContextWrapper>
        </AlertContextWrapper>
      </NotificationContextWrapper>
    </div>
  );
}

export default App;

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
import Finance from "./pages/Finance";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import PrivateRoutes from "./utils/PrivateRoutes";
import DateTimeContext from "./context/DateTimeContext";
import ThemeContext from "./context/ThemeContext";
import axios from "axios";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import CheckEmail from "./pages/CheckEmail";

function App() {
  const [isSidebarOpen, toggleSidebar] = useState(true);
  const [shopName, setShopName] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [theme, setTheme] = useState("gray");
  axios
    .get("http://localhost:4040/managers/id", {
      headers: {
        Authorization: localStorage.getItem("ag_app_shop_token"),
      },
    })
    .then((res) => {
      console.log("theme: ", res.data.theme);
      setTheme(res.data.theme);
    });

  return (
    <div className="h-screen overflow-hidden">
      <ThemeContext.Provider
        value={{
          theme: theme,
          setTheme: setTheme,
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
                  <Route path="/appointments" element={<AppointmentsList />} />
                  <Route path="/professionals" element={<Professionals />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/register" exact element={<Register />} />
                <Route path="/login" exact element={<Login />} />
                <Route
                  path="/forgot-password"
                  exact
                  element={<ForgotPassword />}
                />
                <Route path="/check-email" exact element={<CheckEmail />} />
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
      </ThemeContext.Provider>
    </div>
  );
}

export default App;

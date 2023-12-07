import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import NotFound from "./pages/notFound/NotFound";
import Home from "./pages/home/Home";
import ShopSelection from "./pages/shopSelection/ShopSelection";
import { HeroContextWrapper } from "./context/HeroContext";
import { ShopsContextWrapper } from "./context/ShopsContext";
import { ArticlesContextWrapper } from "./context/ArticlesContext";
import { Section1ContextWrapper } from "./context/Section1Context";
import { Section2ContextWrapper } from "./context/Section2Context";
import { ServicesContextWrapper } from "./context/ServicesContext";
import { WebsiteTitleContextWrapper } from "./context/WebsiteTitleContext";
import { LogoContextWrapper } from "./context/LogoContext";
import PrivateRoutes from "./utils/PrivateRoutes";
import DashboardHome from "./pages/admin/dashboard/DashboardHome";
import DashboardHero from "./pages/admin/dashboard/DashboardHero";
import DashboardShops from "./pages/admin/dashboard/DashboardShops";
import DashboardServices from "./pages/admin/dashboard/DashboardServices";
import DashboardArticles from "./pages/admin/dashboard/DashboardArticles";
import DashboardSettings from "./pages/admin/dashboard/DashboardSettings";
import DashboardSectionOne from "./pages/admin/dashboard/DashboardSectionOne";
import DashboardSectionTwo from "./pages/admin/dashboard/DashboardSectionTwo";
import Login from "./pages/admin/login/Login";
import ArticleView from "./pages/articles/ArticleView";
import BookingWizard from "./pages/bookingWizard/BookingWizard";
import Checkout from "./pages/checkout/Checkout";
import Shop from "./pages/shop/Shop";
import BookingCompleted from "./pages/bookingCompleted/BookingCompleted";
import { useState } from "react";
import { useEffect } from "react";
import instance from "./axiosConfig/axiosConfig";
import DashboardSubscription from "./pages/admin/dashboard/DashboardSubscription";

function App() {
  const [logo, setLogo] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");

      if (response.data.admin.logo) {
        setLogo((prev) => response.data.admin.logo);
        setTitle((prev) => response.data.admin.websiteTitle);
        if (
          response.data.admin.logo === null ||
          response.data.admin.logo === ""
        ) {
          setLogo("https://via.placeholder.com/50");
          setTitle("Agenda");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <link rel="icon" type="image/png" href={logo} />
      </Helmet>
      <LogoContextWrapper>
        <WebsiteTitleContextWrapper>
          <HeroContextWrapper>
            <ShopsContextWrapper>
              <ArticlesContextWrapper>
                <Section1ContextWrapper>
                  <Section2ContextWrapper>
                    <ServicesContextWrapper>
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route
                            path="/article/:id"
                            element={<ArticleView />}
                          />
                          <Route path="/shops" element={<ShopSelection />} />
                          <Route path="/shops/:id" element={<Shop />} />
                          <Route
                            path="/shops/:id/wizard"
                            exact
                            element={<BookingWizard />}
                          />
                          <Route
                            path="/shops/:id/checkout"
                            exact
                            element={<Checkout />}
                          />
                          <Route
                            path="/shops/:id/booking-completed"
                            exact
                            element={<BookingCompleted />}
                          />
                          <Route element={<PrivateRoutes />}>
                            <Route
                              path="/ag-admin"
                              exact
                              element={<DashboardHome />}
                            />
                            <Route
                              path="/ag-admin/hero"
                              exact
                              element={<DashboardHero />}
                            />
                            <Route
                              path="/ag-admin/shops"
                              exact
                              element={<DashboardShops />}
                            />
                            <Route
                              path="/ag-admin/services"
                              exact
                              element={<DashboardServices />}
                            />
                            <Route
                              path="/ag-admin/articles"
                              exact
                              element={<DashboardArticles />}
                            />
                            <Route
                              path="/ag-admin/settings"
                              exact
                              element={<DashboardSettings />}
                            />
                            <Route
                              path="/ag-admin/section1"
                              exact
                              element={<DashboardSectionOne />}
                            />
                            <Route
                              path="/ag-admin/section2"
                              exact
                              element={<DashboardSectionTwo />}
                            />
                            <Route
                              path="/ag-admin/subscription"
                              exact
                              element={<DashboardSubscription />}
                            />
                          </Route>
                          <Route
                            path="/ag-admin/login"
                            exact
                            element={<Login />}
                          />

                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </ServicesContextWrapper>
                  </Section2ContextWrapper>
                </Section1ContextWrapper>
              </ArticlesContextWrapper>
            </ShopsContextWrapper>
          </HeroContextWrapper>
        </WebsiteTitleContextWrapper>
      </LogoContextWrapper>
    </div>
  );
}

export default App;

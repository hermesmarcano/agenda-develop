import { BrowserRouter, Routes, Route } from "react-router-dom";
import Booking from "./pages/booking";
import BookingDate from "./pages/bookingDate";
import BookingHour from "./pages/bookingHour";
import SignIn from "./pages/signIn";
import BookingService from "./pages/bookingService";
import BookingProfessional from "./pages/bookingProfessional";
import NotFound from "./pages/notFound";
import Home from "./pages/home";
import BookingSummary from "./pages/bookingSummary";
import ShopSelection from "./pages/Shops";
import Register from "./pages/register";
import BookingCheckout from "./pages/bookingCheckout";
import BookingCompleted from "./pages/bookingCompleted";
import { HeroContextWrapper } from "./context/HeroContext";
import { ShopsContextWrapper } from "./context/ShopsContext";
import { ArticlesContextWrapper } from "./context/ArticlesContext";
import { Section1ContextWrapper } from "./context/Section1Context";
import { Section2ContextWrapper } from "./context/Section2Context";
import { ServicesContextWrapper } from "./context/ServicesContext";
import { WebsiteTitleContextWrapper } from "./context/WebsiteTitleContext";
import { LogoContextWrapper } from "./context/LogoContext";
import PrivateRoutes from "./utils/PrivateRoutes";
import DashboardHome from "./pages/DashboardHome";
import DashboardHero from "./pages/DashboardHero";
import DashboardShops from "./pages/DashboardShops";
import DashboardServices from "./pages/DashboardServices";
import DashboardArticles from "./pages/DashboardArticles";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardSection1 from "./pages/DashboardSection1";
import DashboardSection2 from "./pages/DashboardSection2";
import AdminLogin from "./pages/AdminLogin";
import BuyProduct from "./pages/BuyProduct";
import ArticleView from "./pages/ArticleView";

function App() {
  return (
    <div>
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
                          <Route path="/shops/:id" element={<Booking />} />
                          <Route
                            path="/shops/:id/buy-product"
                            element={<BuyProduct />}
                          />
                          <Route
                            path="/shops/:id/booking-service"
                            element={<BookingService />}
                          />
                          <Route
                            path="/shops/:id/booking-professional"
                            element={<BookingProfessional />}
                          />
                          <Route
                            path="/shops/:id/booking-date"
                            element={<BookingDate />}
                          />
                          <Route
                            path="/shops/:id/booking-hour"
                            element={<BookingHour />}
                          />
                          <Route
                            path="/shops/:id/booking-summary"
                            element={<BookingSummary />}
                          />
                          <Route
                            path="/shops/:id/signin"
                            element={<SignIn />}
                          />
                          <Route
                            path="/shops/:id/register"
                            element={<Register />}
                          />
                          <Route
                            path="/shops/:id/booking-checkout"
                            element={<BookingCheckout />}
                          />
                          <Route
                            path="/shops/:id/booking-completed"
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
                              element={<DashboardSection1 />}
                            />
                            <Route
                              path="/ag-admin/section2"
                              exact
                              element={<DashboardSection2 />}
                            />
                          </Route>
                          <Route
                            path="/ag-admin/login"
                            exact
                            element={<AdminLogin />}
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

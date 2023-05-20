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
import { useEffect, useState } from "react";
import heroContext from "./context/HeroContext";
import shopsContext from "./context/ShopsContext";
import articlesContext from "./context/ArticlesContext";
import section1Context from "./context/Section1Context";
import section2Context from "./context/Section2Context";
import servicesContext from "./context/ServicesContext";
import websiteTitleContext from "./context/WebsiteTitleContext";
import logoContext from "./context/LogoContext";
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
import axios from "axios";
import BuyProduct from "./pages/BuyProduct";
import ArticleView from "./pages/ArticleView";

function App() {
  const [heroData, setHeroData] = useState({
    heroText: "Find The Right Shop for Your Need",
    heroColor: "white",
    heroBgColor: "gray-800",
    heroStyle: "hero",
    sliderDataImgs: [
      "https://via.placeholder.com/800x300",
      "https://via.placeholder.com/800x300",
      "https://via.placeholder.com/800x300",
    ],
  });

  const [shopsData, setShopsData] = useState([
    {
      _id: 1,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 2,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 3,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 4,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 5,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 6,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
  ]);

  const [articlesData, setArticlesData] = useState([
    {
      _id: 1,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
    },
    {
      _id: 2,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
    },
    {
      _id: 3,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
    },
    {
      _id: 4,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
    },
  ]);

  const [section1Data, setSection1Data] = useState({
    title: "Lorem Ipsum",
    image: "https://via.placeholder.com/600x400",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consequat lorem id congue dignissim. Sed vitae diam euismod, bibendum tortor eu, ultrices velit. Nullam in eros sit amet nisi luctus laoreet. Curabitur varius pharetra ex, ac mattis nibh commodo et. Integer laoreet mauris at convallis lacinia. Donec posuere augue a lacinia faucibus. Suspendisse potenti. Aenean semper velit velit, nec fringilla ex interdum eu. Proin ullamcorper, enim ac egestas euismod, augue justo tristique justo, non posuere libero enim non orci. Sed ut magna aliquam, volutpat tellus id, rhoncus tellus. In vulputate quis elit ut dapibus. Cras mollis erat vel justo auctor, vel interdum tellus dignissim. In at turpis pharetra, malesuada diam vel, elementum elit. Integer sollicitudin augue nec sapien luctus, eget vestibulum sem dictum. Fusce rutrum nisl id turpis maximus congue. Sed vel augue vitae nibh gravida lobortis vel at ipsum.",
  });

  const [section2Data, setSection2Data] = useState({
    title: "Lorem Ipsum",
    image: "https://via.placeholder.com/600x400",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consequat lorem id congue dignissim. Sed vitae diam euismod, bibendum tortor eu, ultrices velit. Nullam in eros sit amet nisi luctus laoreet. Curabitur varius pharetra ex, ac mattis nibh commodo et. Integer laoreet mauris at convallis lacinia. Donec posuere augue a lacinia faucibus. Suspendisse potenti. Aenean semper velit velit, nec fringilla ex interdum eu. Proin ullamcorper, enim ac egestas euismod, augue justo tristique justo, non posuere libero enim non orci. Sed ut magna aliquam, volutpat tellus id, rhoncus tellus. In vulputate quis elit ut dapibus. Cras mollis erat vel justo auctor, vel interdum tellus dignissim. In at turpis pharetra, malesuada diam vel, elementum elit. Integer sollicitudin augue nec sapien luctus, eget vestibulum sem dictum. Fusce rutrum nisl id turpis maximus congue. Sed vel augue vitae nibh gravida lobortis vel at ipsum.",
  });

  const [servicesData, setServicesData] = useState([
    {
      _id: 1,
      title: "Service 1",
      image: "https://via.placeholder.com/500x300",
    },
    {
      _id: 2,
      title: "Service 1",
      image: "https://via.placeholder.com/500x300",
    },
    {
      _id: 3,
      title: "Service 1",
      image: "https://via.placeholder.com/500x300",
    },
  ]);

  const [websiteTitle, setWebsiteTitle] = useState("My Website");

  const [logo, setLogo] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("ag_app_admin_token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get("http://localhost:4040/admin", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data.admin);

      if (response.data.admin.heroData) {
        setHeroData(response.data.admin.heroData);
      }

      if (response.data.admin.shopsData) {
        setShopsData(response.data.admin.shopsData);
      }

      if (response.data.admin.articlesData) {
        setArticlesData(response.data.admin.articlesData);
      }

      if (response.data.admin.servicesData) {
        setServicesData(response.data.admin.servicesData);
      }

      if (response.data.admin.section1Data) {
        setSection1Data(response.data.admin.section1Data);
      }

      if (response.data.admin.section2Data) {
        setSection2Data(response.data.admin.section2Data);
      }

      if (response.data.admin.websiteTitle) {
        setWebsiteTitle(response.data.admin.websiteTitle);
      }

      if (response.data.admin.logo) {
        setLogo(response.data.admin.logo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <logoContext.Provider
        value={{
          logo: logo,
          setLogo: setLogo,
        }}
      >
        <websiteTitleContext.Provider
          value={{
            websiteTitle: websiteTitle,
            setWebsiteTitle: setWebsiteTitle,
          }}
        >
          <heroContext.Provider
            value={{
              heroData: heroData,
              setHeroData: setHeroData,
            }}
          >
            <shopsContext.Provider
              value={{
                shopsData: shopsData,
                setShopsData: setShopsData,
              }}
            >
              <articlesContext.Provider
                value={{
                  articlesData: articlesData,
                  setArticlesData: setArticlesData,
                }}
              >
                <section1Context.Provider
                  value={{
                    section1Data: section1Data,
                    setSection1Data: setSection1Data,
                  }}
                >
                  <section2Context.Provider
                    value={{
                      section2Data: section2Data,
                      setSection2Data: setSection2Data,
                    }}
                  >
                    <servicesContext.Provider
                      value={{
                        servicesData: servicesData,
                        setServicesData: setServicesData,
                      }}
                    >
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
                    </servicesContext.Provider>
                  </section2Context.Provider>
                </section1Context.Provider>
              </articlesContext.Provider>
            </shopsContext.Provider>
          </heroContext.Provider>
        </websiteTitleContext.Provider>
      </logoContext.Provider>
    </div>
  );
}

export default App;

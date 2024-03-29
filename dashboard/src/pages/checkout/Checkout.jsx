import React, { useContext, useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCreditCard,
  FaCheckCircle,
  FaUser,
  FaTimes,
  FaSpinner,
  FaPercent,
  FaClock,
} from "react-icons/fa";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiBasket } from "react-icons/bi";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { CgTrashEmpty } from "react-icons/cg";
import { RiServiceFill } from "react-icons/ri";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Calculator from "./components/Calculator";
import CreditPayment from "./components/CreditPayment";
import PayLater from "./components/PayLater";
import { SidebarContext } from "../../context/SidebarContext";
import { DateTimeContext } from "../../context/DateTimeContext";
import { ProfessionalIdContext } from "../../context/ProfessionalIdContext";
import instance from "../../axiosConfig/axiosConfig";
import { DarkModeContext } from "../../context/DarkModeContext";
import Drawer from "../../components/Drawer";
import UpdateCustomer from "../customers/components/UpdateCustomer";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const StepIndicator = ({ currentStep, totalSteps }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div className="flex items-center mb-4 justify-center">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`relative w-4 h-4 mx-1 rounded-full ${
            index + 1 === currentStep ? "bg-teal-600" : "bg-gray-300"
          }`}
        >
          {index + 1 === currentStep && (
            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white"></div>
          )}
        </div>
      ))}
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { dateTime } = useContext(DateTimeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const { shopId } = useContext(SidebarContext);
  const { professionalId } = useContext(ProfessionalIdContext);
  const [loading, setLoading] = React.useState(true);
  const [servicesData, setServicesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(
    JSON.parse(localStorage.getItem("ag_app_booking_info"))
  );
  const [currentStep, setCurrentStep] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState(false);
  const [creditMode, setCreditMode] = useState(false);
  const [payLaterMode, setPayLaterMode] = useState(false);
  const [extraServices, setExtraServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [subTotalPrice, setSubTotalPrice] = useState(
    bookingInfo?.amount ? bookingInfo?.amount : 0
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [change, setChange] = useState(0);
  const [prevPaidAmount, setPrevPaidAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("$");
  const [paymentId, setPaymentId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerModelState, setCustomerModelState] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ag_app_booking_info")) {
      setLoading(true);

      const appointmentId = JSON.parse(
        localStorage.getItem("ag_app_booking_info")
      ).appointmentId;

      const fetchPayments = instance
        .get(`payments?appt=${appointmentId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response);
          const payment = response.data.payment;
          return payment ? payment : null;
        })
        .catch((error) => {
          console.error(error);
          return null;
        });

      const fetchCustomers = instance.get(`customers/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      });

      const fetchServices = instance.get(`services/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      });

      const fetchProducts = instance.get(`products/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      });

      Promise.all([fetchPayments, fetchCustomers, fetchServices, fetchProducts])
        .then(
          ([
            paymentsResponse,
            customersResponse,
            servicesResponse,
            productsResponse,
          ]) => {
            const payment = paymentsResponse !== null ? paymentsResponse : null;
            console.log(payment);
            if (payment) {
              setPrevPaidAmount(payment.amount);
              setPaymentId(payment._id);
            }

            if (customersResponse) {
              setClientsData(customersResponse.data);
            }

            if (servicesResponse) {
              setServicesData([...servicesResponse.data.services].reverse());
              if (extraServices.length === 0) {
                let servicesArr = servicesResponse.data.services.filter(
                  (serv) => bookingInfo?.service.includes(serv._id)
                );
                setExtraServices(servicesArr);
              }
            }

            if (productsResponse) {
              setProductsData([...productsResponse.data.products].reverse());
              if (products.length === 0) {
                let productsArr = productsResponse.data?.products?.filter(
                  (prod) => bookingInfo?.product?.includes(prod._id)
                );
                setProducts(productsArr);
              }
            }
          }
        )
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("ag_app_booking_info")) {
      const servicesPrice = extraServices.reduce(
        (total, s) => total + s.price,
        0
      );
      const productsPrice = products.reduce((total, p) => total + p.price, 0);
      setSubTotalPrice(servicesPrice + productsPrice);
    }
  }, [extraServices, products]);

  useEffect(() => {
    if (localStorage.getItem("ag_app_booking_info")) {
      if (prevPaidAmount > 0) {
        if (discountType === "$") {
          setTotalPrice(subTotalPrice - discount - prevPaidAmount);
        } else {
          setTotalPrice(
            subTotalPrice -
              prevPaidAmount -
              ((subTotalPrice - prevPaidAmount) * discount) / 100
          );
        }
      } else {
        if (discountType === "$") {
          setTotalPrice(subTotalPrice - discount);
        } else {
          setTotalPrice(subTotalPrice - (subTotalPrice * discount) / 100);
        }
      }
    }
  }, [discount, discountType, subTotalPrice, prevPaidAmount]);

  if (!localStorage.getItem("ag_app_booking_info")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-8 border border-gray-300 rounded-md shadow-lg">
          <div className="flex items-center mb-4">
            <AiOutlineExclamationCircle className="mr-2 text-red-500 text-2xl" />
            <h1 className="text-lg font-medium">No selected appointment</h1>
          </div>
          <p className="mb-4">
            {t("Please go back and choose an appointment to checkout.")}
          </p>
          <button
            className="flex items-center px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700"
            onClick={() => navigate("/checkout-appointments")}
          >
            <FiArrowLeft className="mr-2" />
            {t("Go back")}
          </button>
        </div>
      </div>
    );
  }

  const handleCancelCheckout = () => {
    // Handle cancel checkout logic here
    localStorage.removeItem("ag_app_booking_info");
    navigate("/checkout-appointments");
  };

  const handleAddCustomerDetails = () => {
    setCustomerId(bookingInfo.customer);
    setCustomerModelState(true);
  };

  const handleAddExtraService = (service) => {
    setExtraServices((prevExtraServices) => [...prevExtraServices, service]);
  };

  const handleAddProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const handleChoosePaymentMethod = (method) => {
    let updatedBookingInfo = {};
    if (products.length !== 0) {
      updatedBookingInfo = {
        ...bookingInfo,
        amount: totalPrice,
        service: extraServices.map((extraService) => extraService._id),
        product: products.map((pro) => pro._id),
        prevPaid: prevPaidAmount,
        paymentId: paymentId,
      };
    } else {
      updatedBookingInfo = {
        ...bookingInfo,
        amount: totalPrice,
        service: extraServices.map((extraService) => extraService._id),
        product: [],
        prevPaid: prevPaidAmount,
        paymentId: paymentId,
      };
    }
    localStorage.setItem(
      "ag_app_booking_info",
      JSON.stringify(updatedBookingInfo)
    );
    setBookingInfo(updatedBookingInfo);
    setPaymentMethod(method);
    setCurrentStep(4);
  };

  const handleConfirmPayment = () => {
    // Perform payment confirmation logic here
    setPaymentConfirmed(true);
    setCurrentStep(5);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRemoveService = (index) => {
    setExtraServices((prevExtraServices) =>
      prevExtraServices.filter((_, i) => i !== index)
    );
  };

  const handleRemoveProduct = (index) => {
    setProducts((prevProducts) => prevProducts?.filter((_, i) => i !== index));
  };

  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setDiscount(value);
    } else {
      setDiscount(0);
    }
  };

  const handleDiscountTypeChange = () => {
    setDiscountType((prevDiscountType) =>
      prevDiscountType === "$" ? "%" : "$"
    );
  };

  const handleCheckoutComplete = () => {
    localStorage.removeItem("ag_app_booking_info");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="mt-2">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  function formatDate(date, language) {
    const dateFormats = {
      en: { hour: "2-digit", minute: "numeric", hourCycle: "h23" },
      es: { hour: "2-digit", minute: "numeric", hourCycle: "h23" },
    };

    return new Intl.DateTimeFormat(language, dateFormats[language]).format(
      date
    );
  }
  const reservationDate = new Date(bookingInfo.dateTime);
  const date = new Intl.DateTimeFormat(getCurrentLanguage(), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(reservationDate);
  const time = formatDate(reservationDate, getCurrentLanguage());

  return (
    <>
      <Drawer
        modelState={customerModelState}
        setModelState={() => setCustomerModelState(!customerModelState)}
        title={"Update Customer"}
        children={
          <UpdateCustomer
            setModelState={setCustomerModelState}
            customerId={customerId}
          />
        }
      />
      <div className="container mx-auto p-4 pb-8">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-3/4 lg:pr-4">
            <div
              className={`rounded shadow-lg p-8 mb-4 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">{t("Checkout Process")}</h2>
                <div className="flex items-center space-x-4">
                  <button
                    className="mb-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow flex items-center space-x-2"
                    onClick={handleCancelCheckout}
                  >
                    <FaTimes />
                    <span>{t("Cancel")}</span>
                  </button>
                </div>
              </div>
              <StepIndicator currentStep={currentStep} totalSteps={5} />
              {/* {currentStep === 1 && (
              <CustomerDetailsForm
                onAddCustomerDetails={handleAddCustomerDetails}
              />
            )} */}

              {currentStep === 1 && (
                <>
                  <h2 className="text-xl font-bold mb-4">{t("Services")}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* <button
                    className="flex flex-col items-center justify-center bg-gray-200 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300"
                    onClick={() => setCurrentStep(1)}
                  >
                    <BsArrowLeft size={24} />
                    <span>Go Back</span>
                  </button> */}
                    {servicesData.map((service, index) => (
                      <button
                        key={index}
                        className={`flex flex-col items-center justify-center p-4 rounded transition-all duration-300 ${
                          isDarkMode
                            ? extraServices.find(
                                (eservice) => eservice._id === service._id
                              )
                              ? "bg-teal-600 text-gray-200"
                              : "bg-gray-700 text-white hover:bg-gray-600 hover:text-gray-200"
                            : extraServices.find(
                                (eservice) => eservice._id === service._id
                              )
                            ? "bg-teal-600 text-gray-200"
                            : "bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white"
                        }`}
                        onClick={() => handleAddExtraService(service)}
                      >
                        <RiServiceFill size={24} />
                        <span>{service.name}</span>
                        <span>$ {service.price}</span>
                      </button>
                    ))}
                    <button
                      className={`flex flex-col min-h-[104px] items-center justify-center p-4 rounded transition-all duration-300
                    ${
                      isDarkMode
                        ? `bg-gray-700 text-gray-200
                    ${
                      extraServices.length > 0 &&
                      "hover:bg-gray-600 hover:text-white"
                    }
                   `
                        : `bg-gray-200 text-gray-800
                      ${
                        extraServices.length > 0 &&
                        "hover:bg-teal-600 hover:text-white"
                      }
                     `
                    }`}
                      onClick={() => setCurrentStep(2)}
                      disabled={extraServices.length === 0}
                    >
                      <BsArrowRight size={24} />
                      <span>{t("Proceed")}</span>
                    </button>
                  </div>
                  {extraServices.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {t("Selected Services")}
                      </h3>
                      {extraServices
                        .reduce((uniqueServices, service) => {
                          const existingService = uniqueServices.find(
                            (s) => s._id === service._id
                          );

                          if (existingService) {
                            existingService.count += 1;
                          } else {
                            uniqueServices.push({ ...service, count: 1 });
                          }

                          return uniqueServices;
                        }, [])
                        .map((service, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } p-4 rounded mb-4`}
                          >
                            <div>
                              <p>
                                {service.name}{" "}
                                {service.count > 1 ? `x${service.count}` : ""}
                              </p>
                            </div>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleRemoveService(index, service._id)
                              }
                            >
                              <CgTrashEmpty />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    {t("Product Selection")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      className={`flex flex-col min-h-[104px] items-center justify-center p-4 rounded transition-all duration-300
                    ${
                      isDarkMode
                        ? `bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white`
                        : `bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white`
                    }`}
                      onClick={() => setCurrentStep(1)}
                    >
                      <BsArrowLeft size={24} />
                      <span>{t("Go Back")}</span>
                    </button>
                    {productsData.map((product, index) => (
                      <button
                        key={index}
                        className={`flex flex-col items-center justify-center p-4 rounded transition-all duration-300 ${
                          isDarkMode
                            ? products.find(
                                (eproduct) => eproduct._id === product._id
                              )
                              ? "bg-teal-600 text-gray-200"
                              : "bg-gray-700 text-white hover:bg-gray-600 hover:text-gray-200"
                            : products.find(
                                (eproduct) => eproduct._id === product._id
                              )
                            ? "bg-teal-600 text-gray-200"
                            : "bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white"
                        }`}
                        onClick={() => handleAddProduct(product)}
                      >
                        <BiBasket size={24} />
                        <span>{product.name}</span>
                        <span>$ {product.price}</span>
                      </button>
                    ))}
                    <button
                      className={`flex flex-col min-h-[104px] items-center justify-center p-4 rounded transition-all duration-300
                    ${
                      isDarkMode
                        ? `bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white`
                        : `bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white`
                    }`}
                      onClick={() => setCurrentStep(3)}
                    >
                      <BsArrowRight size={24} />
                      <span>{t("Proceed")}</span>
                    </button>
                  </div>

                  {products.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {t("Selected Products")}
                      </h3>
                      {products
                        .reduce((uniqueProducts, product) => {
                          const existingProduct = uniqueProducts.find(
                            (p) => p._id === product._id
                          );

                          if (existingProduct) {
                            existingProduct.count += 1;
                          } else {
                            uniqueProducts.push({ ...product, count: 1 });
                          }

                          return uniqueProducts;
                        }, [])
                        .map((product, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } p-4 rounded mb-4`}
                          >
                            <div>
                              <p>
                                {product.name}{" "}
                                {product.count > 1 ? `x${product.count}` : ""}
                              </p>
                            </div>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleRemoveProduct(index, product._id)
                              }
                            >
                              <CgTrashEmpty />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    {t("Payment Method")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      className={`flex flex-col items-center justify-center min-h-[104px] ${
                        isDarkMode
                          ? "bg-gray-700 text-white hover:bg-gray-600 hover:text-gray-200"
                          : "bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white"
                      } p-4 rounded transition-all duration-300`}
                      onClick={() => setCurrentStep(2)}
                    >
                      <BsArrowLeft size={24} />
                      <span>{t("Go Back")}</span>
                    </button>
                    <button
                      className={`flex flex-col items-center justify-center min-h-[104px] rounded p-4 transition-all duration-300 
                    ${
                      isDarkMode
                        ? paymentMethod === "cash"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600 hover:text-gray-200"
                        : paymentMethod === "cash"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white"
                    }`}
                      onClick={() => handleChoosePaymentMethod("cash")}
                    >
                      <FaDollarSign size={24} />
                      <span>{t("Cash")}</span>
                    </button>
                    <button
                      className={`flex flex-col items-center justify-center min-h-[104px] rounded p-4 transition-all duration-300 ${
                        isDarkMode
                          ? paymentMethod === "credit"
                            ? "bg-teal-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 hover:text-gray-200"
                          : paymentMethod === "credit"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white"
                      }`}
                      onClick={() => handleChoosePaymentMethod("credit")}
                    >
                      <FaCreditCard size={24} />
                      <span>{t("Credit")}</span>
                    </button>
                    {/* New "Pay later" button */}
                    <button
                      className={`flex flex-col items-center justify-center min-h-[104px] rounded p-4 transition-all duration-300 ${
                        isDarkMode
                          ? paymentMethod === "payLater"
                            ? "bg-teal-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600 hover:text-gray-200"
                          : paymentMethod === "payLater"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-teal-600 hover:text-white"
                      }`}
                      onClick={() => handleChoosePaymentMethod("payLater")}
                    >
                      <FaClock size={24} />
                      <span>{t("Pay later")}</span>
                    </button>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    {t("Payment Confirmation")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      className={`${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-teal-600 text-gray-800"
                      } min-h-[104px] px-4 py-2 rounded flex items-center justify-center`}
                      onClick={handlePreviousStep}
                    >
                      <IoMdArrowRoundBack className="mr-2" />
                      {t("Go Back")}
                    </button>
                    <button
                      className={`${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-teal-600 text-gray-800"
                      } min-h-[104px] px-4 py-2 rounded flex items-center justify-center`}
                      // onClick={handleConfirmPayment}
                      onClick={() => {
                        if (paymentMethod === "cash") {
                          setCalculatorMode(true);
                        } else if (paymentMethod === "credit") {
                          setCreditMode(true);
                        } else if (paymentMethod === "payLater") {
                          setPayLaterMode(true);
                        }
                      }}
                    >
                      <HiOutlineClipboardCheck className="mr-2" />
                      {t("Confirm Payment")}
                    </button>
                  </div>
                </>
              )}

              <Calculator
                isOpen={calculatorMode}
                handlePopupClose={() => setCalculatorMode(false)}
                totalPrice={totalPrice}
                change={change}
                setAmountPaid={setAmountPaid}
                setChange={setChange}
                handleConfirmPayment={handleConfirmPayment}
                bookingInfo={bookingInfo}
                clients={clientsData}
                dateTime={dateTime}
              />

              <CreditPayment
                isOpen={creditMode}
                handlePopupClose={() => setCreditMode(false)}
                totalPrice={totalPrice}
                setAmountPaid={setAmountPaid}
                setChange={setChange}
                handleConfirmPayment={handleConfirmPayment}
                bookingInfo={bookingInfo}
                clients={clientsData}
                dateTime={dateTime}
              />

              <PayLater
                isOpen={payLaterMode}
                handlePopupClose={() => setPayLaterMode(false)}
                totalPrice={totalPrice}
                setAmountPaid={setAmountPaid}
                setChange={setChange}
                handleConfirmPayment={handleConfirmPayment}
                bookingInfo={bookingInfo}
              />

              {currentStep === 5 && (
                <>
                  <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">
                      {t("Appointment Confirmation")}
                    </h2>
                    <div className="flex items-center mb-4">
                      <FaCheckCircle
                        className="text-green-500 mr-2"
                        size={24}
                      />
                      <h3 className="text-lg font-semibold">
                        {t("Appointment Status")}
                      </h3>
                    </div>
                    <p>{t("Appointment has been scheduled successfully.")}</p>
                    <button
                      className={`mt-4 px-4 py-2 ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-teal-600 text-gray-800"
                      } rounded`}
                      onClick={handleCheckoutComplete}
                    >
                      {t("Return to Home")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/4">
            <div
              className={` ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded shadow-lg p-8`}
            >
              <h2 className="text-xl font-bold mb-4">{t("Payment Summary")}</h2>
              <div className="mb-4">
                {currentStep < 5 && (
                  <button
                    className={`${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-teal-600 text-gray-800"
                    } text-sm flex justify-center items-center px-4 py-2 rounded w-full mb-4`}
                    onClick={handleAddCustomerDetails}
                  >
                    <FaUser className="mr-2" />
                    {t("Customer Details")}
                  </button>
                )}
                <h3 className="font-semibold mb-2">
                  {t("Appointment Details")}
                </h3>
                <div className="flex items-center mb-2 text-sm">
                  <FiCalendar className="mr-2" size={16} />
                  <p>
                    {t("Date")}: {date}
                  </p>
                </div>
                <div className="flex items-center text-sm">
                  <FiClock className="mr-2" size={16} />
                  <p>
                    {t("Time")}: {time}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">{t("Current Services")}</h3>
                {extraServices
                  .reduce((uniqueServices, service) => {
                    const existingService = uniqueServices.find(
                      (s) => s._id === service._id
                    );

                    if (existingService) {
                      existingService.count += 1;
                    } else {
                      uniqueServices.push({ ...service, count: 1 });
                    }

                    return uniqueServices;
                  }, [])
                  .map((service, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <RiServiceFill className="mr-2" size={16} />
                      <p>
                        {service.name}{" "}
                        {service.count > 1 ? `x${service.count}` : ""}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">{t("Products")}</h3>
                {products
                  .reduce((uniqueProducts, product) => {
                    const existingProduct = uniqueProducts.find(
                      (p) => p._id === product._id
                    );

                    if (existingProduct) {
                      existingProduct.count += 1;
                    } else {
                      uniqueProducts.push({ ...product, count: 1 });
                    }

                    return uniqueProducts;
                  }, [])
                  .map((product, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <BiBasket className="mr-2" size={16} />
                      <p>
                        {product.name}{" "}
                        {product.count > 1 ? `x${product.count}` : ""}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mb-4">
                <hr className="border-gray-300 my-2" />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold">{t("Subtotal")}:</h3>
                  <p className="text-sm">${Number(subTotalPrice).toFixed(2)}</p>
                </div>

                {prevPaidAmount > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold">
                      {t("Previous Payment")}:
                    </h3>
                    <p className="text-sm">
                      - ${Number(prevPaidAmount).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 italic mb-2">
                    {t("Discount")}
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="flex items-center w-28 h-8 rounded-md bg-gray-300">
                      <button
                        className={`w-14 ${
                          discountType === "%"
                            ? "text-gray-700 shadow-md bg-white"
                            : "text-gray-500 shadow-inner"
                        } flex justify-center items-center h-full rounded-md transition-transform`}
                        onClick={handleDiscountTypeChange}
                      >
                        <FaPercent className="text-gray-600" />
                      </button>
                      <button
                        className={`w-14 ${
                          discountType === "$"
                            ? "text-gray-700 shadow-md bg-white"
                            : "text-gray-500 shadow-inner"
                        } flex justify-center items-center h-full rounded-md transition-transform`}
                        onClick={handleDiscountTypeChange}
                      >
                        <FaDollarSign className="text-gray-600" />
                      </button>
                    </div>
                    <input
                      type="number"
                      className="appearance-none w-14 ml-2 py-2 pl-4 border border-gray-300 rounded-md text-sm text-gray-700 leading-tight focus:outline-none"
                      value={discount}
                      onChange={handleDiscountChange}
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold">
                    {t("Total Price")}:
                  </h3>
                  <p className="text-sm">${Number(totalPrice).toFixed(2)}</p>
                </div>

                <hr className="border-gray-300 my-2" />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold">
                    {t("Amount Paid")}:
                  </h3>
                  <p className="text-sm">${Number(amountPaid).toFixed(2)}</p>
                </div>
                <hr className="border-gray-300 my-2" />
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{t("Change")}:</h3>
                  <p className="text-sm">${Number(change).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

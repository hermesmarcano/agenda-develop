import React, { useContext, useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCreditCard,
  FaCheckCircle,
  FaUser,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiBasket } from "react-icons/bi";
import { FiCalendar, FiClock } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { CgTrashEmpty } from "react-icons/cg";
import { RiServiceFill } from "react-icons/ri";
import Calculator from "../components/Calculator";
import { useNavigate } from "react-router-dom";
import DateTimeContext from "../context/DateTimeContext";
import SidebarContext from "../context/SidebarContext";
import axios from "axios";
import ProfessionalIdContext from "../context/ProfessionalIdContext";
import CreditPayment from "../components/CreditPayment";

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center mb-4 justify-center">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`relative w-4 h-4 mx-1 rounded-full ${
            index + 1 === currentStep ? "bg-gray-800" : "bg-gray-300"
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
  const { dateTime } = useContext(DateTimeContext);
  const token = localStorage.getItem("ag_app_shop_token");
  const { shopName } = useContext(SidebarContext);
  const { professionalId } = useContext(ProfessionalIdContext);
  const [loading, setLoading] = React.useState(true);
  const [servicesData, setServicesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(
    JSON.parse(localStorage.getItem("ag_app_booking_info"))
  );
  console.log(bookingInfo);
  const [currentStep, setCurrentStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    birthday: "",
  });
  const [extraServices, setExtraServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState(false);
  const [creditMode, setCreditMode] = useState(false);
  const [totalPrice, setTotalPrice] = useState(bookingInfo.amount);
  const [amountPaid, setAmountPaid] = useState(0);
  const [change, setChange] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:4040/customers/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setClientsData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [shopName]);

  useEffect(() => {
    axios
      .get(`http://localhost:4040/services/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setServicesData([...response.data.services].reverse());
        if (extraServices.length === 0) {
          bookingInfo?.service?.map((ser) => {
            response.data.services.map((service) => {
              if (ser === service._id) {
                setExtraServices([...extraServices, service]);
              }
            });
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:4040/products/shopname?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProductsData([...response.data.products].reverse());
        if (products.length === 0) {
          bookingInfo?.product?.map((pro) => {
            response.data.products.map((product) => {
              if (pro === product._id) {
                setExtraServices([...products, product]);
              }
            });
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCancelCheckout = () => {
    // Handle cancel checkout logic here
    console.log("Checkout canceled");
    localStorage.removeItem("ag_app_booking_info");
    navigate("/");
  };

  const handleAddCustomerDetails = (details) => {
    setCustomerDetails(details);
    // setCurrentStep(2);
  };

  const handleAddExtraService = (service) => {
    const serviceAlreadyExists = extraServices.some(
      (item) => item._id === service._id
    );

    if (!serviceAlreadyExists) {
      setExtraServices([...extraServices, service]);
      setTotalPrice(totalPrice + service.price);
    }
  };

  const handleAddProduct = (product) => {
    const productAlreadyExists = products.some(
      (item) => item._id === product._id
    );

    if (!productAlreadyExists) {
      setProducts([...products, product]);
      setTotalPrice(totalPrice + product.price);
    }
  };

  const handleChoosePaymentMethod = (method) => {
    setBookingInfo({
      ...bookingInfo,
      amount: totalPrice,
      service: extraServices.map((extraService) => extraService._id),
      product: products.map((pro) => pro._id),
    });
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

  const handleRemoveService = (index, id) => {
    setExtraServices(extraServices.filter((_, i) => i !== index));
    const removedService = servicesData.find((service) => service._id === id);
    setTotalPrice(totalPrice - removedService.price);
  };

  const handleRemoveProduct = (index, id) => {
    setProducts(products.filter((_, i) => i !== index));
    const removedProduct = productsData.find((product) => product._id === id);
    setTotalPrice(totalPrice - removedProduct.price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="mt-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-3/4 lg:pr-4">
          <div className="bg-white rounded shadow-lg p-8 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Checkout Process</h2>
              <div className="flex items-center space-x-4">
                <button
                  className="mb-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow flex items-center space-x-2"
                  onClick={handleCancelCheckout}
                >
                  <FaTimes />
                  <span>Cancel</span>
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
                <h2 className="text-xl font-bold mb-4">Services</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* <button
                    className="flex flex-col items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300"
                    onClick={() => setCurrentStep(1)}
                  >
                    <BsArrowLeft size={24} />
                    <span>Go Back</span>
                  </button> */}
                  {servicesData.map((service, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300 ${
                        extraServices.includes(service.name)
                          ? "bg-gray-800 text-white"
                          : ""
                      }`}
                      onClick={() => handleAddExtraService(service)}
                    >
                      <RiServiceFill size={24} />
                      <span>{service.name}</span>
                      <span>$ {service.price}</span>
                    </button>
                  ))}
                  <button
                    className="flex flex-col min-h-[104px] items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300"
                    onClick={() => setCurrentStep(2)}
                  >
                    <BsArrowRight size={24} />
                    <span>Proceed</span>
                  </button>
                </div>
                {extraServices.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Selected Services
                    </h3>
                    {extraServices.map((service, index) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between bg-gray-200 p-4 rounded mb-4"
                      >
                        <div>
                          <p>{service.name}</p>
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
                <h2 className="text-xl font-bold mb-4">Product Selection</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    className="flex flex-col min-h-[104px] items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300"
                    onClick={() => setCurrentStep(1)}
                  >
                    <BsArrowLeft size={24} />
                    <span>Go Back</span>
                  </button>
                  {productsData.map((product, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300 ${
                        products.includes(product.name)
                          ? "bg-gray-800 text-white"
                          : ""
                      }`}
                      onClick={() => handleAddProduct(product)}
                    >
                      <BiBasket size={24} />
                      <span>{product.name}</span>
                      <span>$ {product.price}</span>
                    </button>
                  ))}
                  <button
                    className="flex flex-col min-h-[104px] items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300"
                    onClick={() => setCurrentStep(3)}
                  >
                    <BsArrowRight size={24} />
                    <span>Proceed</span>
                  </button>
                </div>
                {products.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Selected Products
                    </h3>
                    {products.map((product, index) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between bg-gray-200 p-4 rounded mb-4"
                      >
                        <div>
                          <p>{product.name}</p>
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
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    className="flex flex-col items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300"
                    onClick={() => setCurrentStep(2)}
                  >
                    <BsArrowLeft size={24} />
                    <span>Go Back</span>
                  </button>
                  <button
                    className={`flex flex-col items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300 ${
                      paymentMethod === "cash" ? "bg-gray-800 text-white" : ""
                    }`}
                    onClick={() => handleChoosePaymentMethod("cash")}
                  >
                    <FaDollarSign size={24} />
                    <span>Cash</span>
                  </button>
                  <button
                    className={`flex flex-col items-center justify-center bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-800 hover:text-white transition-all duration-300 ${
                      paymentMethod === "credit" ? "bg-gray-800 text-white" : ""
                    }`}
                    onClick={() => handleChoosePaymentMethod("credit")}
                  >
                    <FaCreditCard size={24} />
                    <span>Credit</span>
                  </button>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h2 className="text-xl font-bold mb-4">Payment Confirmation</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    className="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center"
                    onClick={handlePreviousStep}
                  >
                    <IoMdArrowRoundBack className="mr-2" />
                    Go Back
                  </button>
                  <button
                    className="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center"
                    // onClick={handleConfirmPayment}
                    onClick={() => {
                      paymentMethod === "cash"
                        ? setCalculatorMode(true)
                        : setCreditMode(true);
                    }}
                  >
                    <HiOutlineClipboardCheck className="mr-2" />
                    Confirm Payment
                  </button>
                </div>
              </>
            )}

            <Calculator
              isOpen={calculatorMode}
              handlePopupClose={() => setCalculatorMode(false)}
              totalPrice={totalPrice}
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

            {currentStep === 5 && (
              <>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Appointment Confirmation
                  </h2>
                  <div className="flex items-center mb-4">
                    <FaCheckCircle className="text-green-500 mr-2" size={24} />
                    <h3 className="text-lg font-semibold">
                      Appointment Status
                    </h3>
                  </div>
                  <p>Appointment has been scheduled successfully.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                    onClick={() => navigate("/")}
                  >
                    Return to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
            <div className="mb-4">
              {currentStep < 5 && (
                <button
                  className="bg-gray-800 text-sm hover:bg-gray-600 flex justify-center items-center text-white px-4 py-2 rounded w-full mb-4"
                  onClick={handleAddCustomerDetails}
                >
                  <FaUser className="mr-2" />
                  Customer Details
                </button>
              )}
              <h3 className="font-semibold mb-2">Appointment Details</h3>
              <div className="flex items-center mb-2 text-sm">
                <FiCalendar className="text-gray-800 mr-2" size={16} />
                <p>Date: June 30, 2023</p>
              </div>
              <div className="flex items-center text-sm">
                <FiClock className="text-gray-800 mr-2" size={16} />
                <p>Time: 10:00 AM - 11:30 AM</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Current Services</h3>
              {extraServices.map((service, index) => (
                <div key={index} className="flex items-center mb-2">
                  <RiServiceFill className="text-gray-800 mr-2" size={16} />
                  <p>{service.name}</p>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Products</h3>
              {products.map((product, index) => (
                <div key={index} className="flex items-center mb-2">
                  <BiBasket className="text-gray-800 mr-2" size={16} />
                  <p>{product.name}</p>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <hr className="border-gray-300 my-2" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold">Total Price:</h3>
                <p className="text-sm">${totalPrice}</p>
              </div>
              <hr className="border-gray-300 my-2" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold">Amount Paid:</h3>
                <p className="text-sm">${Number(amountPaid).toFixed(2)}</p>
              </div>
              <hr className="border-gray-300 my-2" />
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Change:</h3>
                <p className="text-sm">${Number(change).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

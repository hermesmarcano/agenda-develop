import React from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import ServicesSelection from "./components/ServicesSelection";
import ProductsSelection from "./components/ProductsSelection";
import ProfessionalSelection from "./components/ProfessionalSelection";
import DateSelection from "./components/DateSelection";
import HourSelection from "./components/HourSelection";
import StepIndicator from "./components/StepIndicatior";
import BookingSummary from "./components/BookingSummary";
import WizardHeader from "./components/WizardHeader";
import WizardFooter from "./components/WizardFooter";
import instance from "../../axiosConfig/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import SignIn from "../../components/SignIn";
import CustomPopup from "../../components/CustomPopup";
import CustomerAuth from "../../components/CustomerAuth";

function BookingWizard() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [bookingInfo, setBookingInfo] = React.useState([]);
  const [shopId, setShopId] = React.useState("");
  const [signInPopup, setSignInPopup] = React.useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [hasSelectedService, setHasSelectedService] = React.useState(false);
  const [hasSelectedProfessional, setHasSelectedProfessional] =
    React.useState(false);
  const [hasSelectedDate, setHasSelectedDate] = React.useState(false);
  const [hasSelectedHour, setHasSelectedHour] = React.useState(false);

  React.useEffect(() => {
    instance.get(`/managers/shop?urlSlug=${params.id}`).then((response) => {
      console.log(response.data);
      setShopId(response.data._id);
    });
  }, []);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const proceedCheckout = () => {
    const professional = JSON.parse(
      localStorage.getItem(`professional_${params.id}`)
    );
    const services = JSON.parse(localStorage.getItem(`services_${params.id}`));
    const servicesId = [];
    const servicesNames = [];
    services.map((service) => {
      servicesId.push(service["_id"]);
    });
    services.map((service) => {
      servicesNames.push(service.name);
    });
    const products = JSON.parse(localStorage.getItem(`products_${params.id}`));
    console.log("products: ", products);
    const productsId = [];
    const productsNames = [];
    if (products) {
      products.map((product) => {
        productsId.push(product["_id"]);
      });
      products.map((product) => {
        productsNames.push(product.name);
      });
    }
    const d = new Date(localStorage.getItem(`dateTime_${params.id}`));
    const date = new Intl.DateTimeFormat(["ban", "id"]).format(d);
    const time = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).format(d);
    let total = 0;

    const sum = services.reduce((acc, service) => {
      return acc + service.price;
    }, 0);
    total = sum;
    if (products) {
      const sum2 = products.reduce((acc, product) => {
        return acc + product.price;
      }, sum);
      console.log("sum2: ", sum2);
      total = sum2;
    }

    let duration = services.reduce(
      (totalDuration, s) => totalDuration + s.duration,
      0
    );

    localStorage.setItem(
      "bookingInfo",
      JSON.stringify({
        managerId: shopId,
        customer: "",
        professional: professional._id,
        service: servicesId,
        duration: duration,
        product: productsId,
        dateTime: d,
        amount: total,
      })
    );
    console.log({
      managerId: shopId,
      customer: "",
      professional: professional._id,
      service: servicesId,
      duration: duration,
      product: productsId,
      dateTime: d,
      amount: total,
    });
    localStorage.setItem(
      "bookingDetails",
      JSON.stringify({
        customer: "",
        professional: professional.name,
        service: servicesNames,
        product: productsNames,
        dateTime: d,
        amount: total,
      })
    );
    if (localStorage.getItem("ag_app_customer_token")) {
      navigate(`/shops/${params.id}/checkout`);
    } else {
      setSignInPopup(true);
    }
  };
  

  const confirmBooking = async () => {
    const professional = JSON.parse(
      localStorage.getItem(`professional_${params.id}`)
    );
    const services = JSON.parse(localStorage.getItem(`services_${params.id}`));
    
    const servicesId = [];

    services.map((service) => {
      servicesId.push(service["_id"]);
    });

    const products = JSON.parse(localStorage.getItem(`products_${params.id}`));

    console.log("products: ", products);

    const productsId = [];

    if (products) {
      products.map((product) => {
        productsId.push(product["_id"]);
      });
    }

    const d = new Date(localStorage.getItem(`dateTime_${params.id}`));
   
    let duration = services.reduce(
      (totalDuration, s) => totalDuration + s.duration,
      0
    );

    let bookingInfo = {
        managerId: shopId,
        customer: "",
        professional: professional._id,
        service: servicesId,
        duration: duration,
        product: productsId,
        dateTime: d,
      }
    console.log({
      managerId: shopId,
      customer: "",
      professional: professional._id,
      service: servicesId,
      duration: duration,
      product: productsId,
      dateTime: d,
    });
    
    if (localStorage.getItem("ag_app_customer_token")) {
      instance
      .get(`/customers/id`, {
        headers: {
          Authorization: localStorage.getItem("ag_app_customer_token"),
        },
      })
      .then((response) => {
        const customer = response.data;
        bookingInfo = {
            ...bookingInfo,
            customer: customer._id,
            dateTime: new Date(bookingInfo.dateTime),
          }
        console.log(bookingInfo);
        createAppointment(bookingInfo);
      })
      .catch((error) => {
        console.error(error);
      });

      const createAppointment = (bookingInfo) => {
        
        instance
          .post("/appointments", bookingInfo, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log(response.data);
            navigate(`/shops/${params.id}/booking-completed`);
          })
          .catch((error) => {
            console.error(error.message);
          });
      };

    } else {
      setSignInPopup(true);
    }

  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      {/* <SignIn isOpen={signInPopup} onClose={() => setSignInPopup(false)} /> */}
      <CustomPopup
        isOpen={signInPopup}
        onClose={() => setSignInPopup(false)}
        children={<CustomerAuth shopId={shopId} setSignInPopup={setSignInPopup}/>}
      />
      <div className="mb-auto">
        <WizardHeader />
      </div>
      <StepIndicator currentStep={currentStep} />
      <div className="w-full sm:w-[700px] p-6 rounded-lg shadow-lg bg-white">
        {/* Step Content */}
        <div className="w-full">
          {currentStep === 1 && (
            <div className="transition-opacity opacity-100 min-h-[588px] relative">
              <ServicesSelection
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
                paramsId={params.id}
                setHasSelectedService={setHasSelectedService}
              />
              <div className="absolute -bottom-3 left-0 w-full flex justify-between">
                <div className="mt-4 flex justify-start">
                  <button
                    className={`text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={() => navigate(`/shops/${params.id}`)}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> Back to Shop
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedService
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800"
                    } transform transition-transform ${
                      !hasSelectedService
                        ? ""
                        : "hover:scale-105 hover:shadow-xl"
                    } py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedService}
                  >
                    <span className="flex items-center">
                      Next <FiArrowRight className="ml-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="transition-opacity opacity-100 min-h-[588px] relative">
              <ProfessionalSelection
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
                paramsId={params.id}
                setHasSelectedProfessional={setHasSelectedProfessional}
              />
              <div className="absolute -bottom-3 left-0 w-full flex justify-between">
                <div className="mt-4 flex justify-start">
                  <button
                    className={`text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> Prev
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedProfessional
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800"
                    } transform transition-transform ${
                      !hasSelectedProfessional
                        ? ""
                        : "hover:scale-105 hover:shadow-xl"
                    } py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedProfessional}
                  >
                    <span className="flex items-center">
                      Next <FiArrowRight className="ml-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="transition-opacity opacity-100 min-h-[588px] relative">
              <DateSelection
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
                paramsId={params.id}
                setHasSelectedDate={setHasSelectedDate}
              />
              <div className="absolute -bottom-3 left-0 w-full flex justify-between">
                <div className="mt-4 flex justify-start">
                  <button
                    className={`text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> Prev
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedDate
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800"
                    } transform transition-transform ${
                      !hasSelectedDate ? "" : "hover:scale-105 hover:shadow-xl"
                    } py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedDate}
                  >
                    <span className="flex items-center">
                      Next <FiArrowRight className="ml-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="transition-opacity opacity-100 min-h-[588px] relative">
              <HourSelection
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
                paramsId={params.id}
                setHasSelectedHour={setHasSelectedHour}
              />
              <div className="absolute -bottom-3 left-0 w-full flex justify-between">
                <div className="mt-4 flex justify-start">
                  <button
                    className={`text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> Prev
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedHour
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800"
                    } transform transition-transform ${
                      !hasSelectedHour ? "" : "hover:scale-105 hover:shadow-xl"
                    } py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedHour}
                  >
                    <span className="flex items-center">
                      Next <FiArrowRight className="ml-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="transition-opacity opacity-100 min-h-[588px] relative">
              <ProductsSelection
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
                paramsId={params.id}
              />
              <div className="absolute -bottom-3 left-0 w-full flex justify-between">
                <div className="mt-4 flex justify-start">
                  <button
                    className={`text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> Prev
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedHour}
                  >
                    <span className="flex items-center">
                      Next <FiArrowRight className="ml-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="transition-opacity opacity-100 min-h-[588px] relative">
              <BookingSummary
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
                paramsId={params.id}
              />

              <div className="absolute -bottom-3 left-0 w-full flex justify-between">
                <div className="mt-4 flex justify-start">
                  <button
                    className={`text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-teal-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> Prev
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="btn btn-primary js-btn-next"
                    type="button"
                    title="Next"
                    onClick={handleNext}
                  >
                    {/* <button
                      onClick={proceedCheckout}
                      className="flex items-center text-white bg-gradient-to-r from-green-600 to-green-700 hover:bg-green-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md"
                    >
                      Proceed to Checkout <FaShoppingCart className="ml-2" />
                    </button> */}
                    <button
                      onClick={confirmBooking}
                      className="flex items-center text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:bg-teal-700 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md"
                    >
                      Confirm Booking <FaCheckCircle className="ml-2" />
                    </button>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <WizardFooter />
      </div>
    </div>
  );
}

export default BookingWizard;

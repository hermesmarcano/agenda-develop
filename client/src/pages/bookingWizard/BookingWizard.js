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
import CustomPopup from "../../components/CustomPopup";
import CustomerAuth from "../../components/CustomerAuth";
import { useTranslation } from "react-i18next";

function BookingWizard() {
  const { t } = useTranslation();
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
                    className={`text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={() => navigate(`/shops/${params.id}`)}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> {t('Back to Shop')}
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedService
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800"
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
                      {t('Next')} <FiArrowRight className="ml-2" />
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
                    className={`text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> {t("Prev")}
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedProfessional
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800"
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
                      {t('Next')} <FiArrowRight className="ml-2" />
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
                    className={`text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> {t('Prev')}
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedDate
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800"
                    } transform transition-transform ${
                      !hasSelectedDate ? "" : "hover:scale-105 hover:shadow-xl"
                    } py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedDate}
                  >
                    <span className="flex items-center">
                      {t('Next')} <FiArrowRight className="ml-2" />
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
                    className={`text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> {t('Prev')}
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white ${
                      !hasSelectedHour
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800"
                    } transform transition-transform ${
                      !hasSelectedHour ? "" : "hover:scale-105 hover:shadow-xl"
                    } py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedHour}
                  >
                    <span className="flex items-center">
                      {t('Next')} <FiArrowRight className="ml-2" />
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
                    className={`text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> {t('Prev')}
                    </span>
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className={`text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Next"
                    onClick={handleNext}
                    disabled={!hasSelectedHour}
                  >
                    <span className="flex items-center">
                      {t('Next')} <FiArrowRight className="ml-2" />
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
                    className={`text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md`}
                    type="button"
                    title="Previous"
                    onClick={handlePrevious}
                  >
                    <span className="flex items-center">
                      <FiArrowLeft className="mr-2" /> {t('Prev')}
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

                    <button
                      onClick={confirmBooking}
                      className="flex items-center text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:bg-sky-800 transform transition-transform hover:scale-105 hover:shadow-xl py-3 px-6 rounded-md"
                    >
                      {t('Confirm Booking')} <FaCheckCircle className="ml-2" />
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

import React, { useContext } from "react";
import { FiX } from "react-icons/fi";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { DarkModeContext } from "../../../context/DarkModeContext";

const PayLater = ({
  isOpen,
  handlePopupClose,
  totalPrice,
  setAmountPaid,
  setChange,
  handleConfirmPayment,
  bookingInfo,
}) => {
  const token = localStorage.getItem("ag_app_shop_token");
  const { isDarkMode } = useContext(DarkModeContext);

  const handleConfirm = () => {
    const confirmAppointmentLaterPayment = () => {
      instance
        .patch(
          `appointments/${bookingInfo.appointmentId}`,
          {
            service: bookingInfo.service,
            product: bookingInfo.product,
            status: "in-debt",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        .then((response) => {
          setAmountPaid(totalPrice);
          setChange(0);

          handleConfirmPayment();
          handlePopupClose();
        })
        .catch((error) => {
          console.error(error.message);
          // Handle errors
        });
    };

    confirmAppointmentLaterPayment();
  };

  const handleCancel = () => {
    handlePopupClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-20 inset-0 flex justify-center items-center overflow-y-auto bg-black bg-opacity-25">
          <div
            className={`w-96 my-auto mx-auto rounded-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <form onSubmit={handleConfirm}>
              <div
                className={`rounded-md shadow-md p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <PaymentWaiting />
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={` ${
                      isDarkMode ? "text-gray-100" : "text-gray-700"
                    } font-semibold`}
                  >
                    Amount:
                  </span>
                  <span className="text-green-500 font-semibold">
                    {totalPrice} USD
                  </span>
                </div>
                <button
                  type="submit"
                  className={`w-full mt-4 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  } text-white py-2 px-4 rounded-md font-semibold text-sm`}
                >
                  Confirm Paying Later
                </button>
                <button
                  className={`w-full mt-2 ${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-500 hover:bg-gray-600"
                  } text-white py-2 px-4 rounded-md flex items-center justify-center font-semibold text-sm`}
                  onClick={handleCancel}
                >
                  <FiX className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PayLater;

const PaymentWaiting = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  return (
    <div className="flex justify-center items-center">
      <div
        className={`flex flex-col items-center justify-between mb-6 ${
          isDarkMode ? "text-gray-300" : "text-black"
        }`}
      >
        {isConfirmed ? (
          <>
            <h1
              className={`text-xl font-semibold ${
                isDarkMode ? "text-green-300" : "text-green-500"
              }`}
            >
              Payment Confirmed
            </h1>
            <FaCheckCircle
              className={`text-4xl mr-4 ${
                isDarkMode ? "text-green-300" : "text-green-500"
              }`}
            />
          </>
        ) : (
          <>
            <FaClock
              className={`text-4xl mr-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            />
            <h1
              className={`text-xl font-semibold ${
                isDarkMode ? "text-gray-300" : "text-black"
              }`}
            >
              Paying Later
            </h1>
          </>
        )}
      </div>
    </div>
  );
};

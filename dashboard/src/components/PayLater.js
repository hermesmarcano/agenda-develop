import React from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { FaCheckCircle, FaClock } from "react-icons/fa";

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

  const handleConfirm = () => {
    let data = {
      managerId: bookingInfo.managerId,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      product: bookingInfo.product,
      dateTime: new Date(),
      amount: bookingInfo.amount,
      method: "paylater",
    };

    let patchData = {
      managerId: bookingInfo.managerId,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      product: bookingInfo.product,
      dateTime: new Date(),
      amount: bookingInfo.amount + bookingInfo.prevPaid,
      method: "paylater",
      updatedAt: new Date(),
    };

    const confirmAppointmentLaterPayment = () => {
      axios
        .patch(
          `http://localhost:4040/appointments/${bookingInfo.appointmentId}`,
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
          <div className="w-96 my-auto mx-auto bg-white rounded-md">
            <form onSubmit={handleConfirm}>
              <div className="bg-white rounded-md shadow-md p-6">
                <PaymentWaiting />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-700 font-semibold">Amount:</span>
                  <span className="text-green-500 font-semibold">
                    {totalPrice} USD
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-semibold text-sm"
                >
                  Confirm Paying Later
                </button>
                <button
                  className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center font-semibold text-sm"
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
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center justify-between mb-6">
        {isConfirmed ? (
          <>
            <h1 className="text-xl font-semibold">Payment Confirmed</h1>
            <FaCheckCircle className="text-4xl text-green-500 mr-4" />
          </>
        ) : (
          <>
            <FaClock className="text-4xl text-gray-800 mr-4" />
            <h1 className="text-xl font-semibold">Paying Later</h1>
          </>
        )}
      </div>
    </div>
  );
};

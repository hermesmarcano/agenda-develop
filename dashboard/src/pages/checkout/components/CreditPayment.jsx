import { FaCreditCard } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import instance from "../../../axiosConfig/axiosConfig";
import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useTranslation } from "react-i18next";

const CreditPayment = ({
  isOpen,
  handlePopupClose,
  totalPrice,
  setAmountPaid,
  setChange,
  handleConfirmPayment,
  bookingInfo,
  clients,
  dateTime,
}) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("ag_app_shop_token");
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  const handleConfirm = () => {
    let data = {
      managerId: bookingInfo.managerId,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      product: bookingInfo.product,
      dateTime: new Date(),
      amount: bookingInfo.amount,
      method: "credit",
    };

    let patchData = {
      managerId: bookingInfo.managerId,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      product: bookingInfo.product,
      dateTime: new Date(),
      amount: bookingInfo.amount + bookingInfo.prevPaid,
      method: "credit",
      updatedAt: new Date(),
    };

    let paymentId = "";

    const updatePayment = () => {
      instance
        .patch(`payments/${bookingInfo.paymentId}`, JSON.stringify(patchData), {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          const cuurentClient = clients.find(
            (client) => client._id === bookingInfo.customer
          );
          const updatedClientPayments =
            Number(cuurentClient.payments) +
            Number(bookingInfo.amount) +
            Number(bookingInfo.prevPaid);
          instance
            .patch(
              `customers/${bookingInfo.customer}`,
              JSON.stringify({ payments: updatedClientPayments }),
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            )
            .then((response) => {
              confirmAppointmentPayment();
            })
            .catch((error) => {
              console.log(error);
              deletePayment();
            });
        })
        .catch((error) => {
          console.error(error.message);
        });
    };

    const makePayment = () => {
      instance
        .post("payments", JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          paymentId = response.data.payment._id;
          const cuurentClient = clients.find(
            (client) => client._id === bookingInfo.customer
          );
          const updatedClientPayments =
            Number(cuurentClient.payments) + Number(bookingInfo.amount);
          instance
            .patch(
              `customers/${bookingInfo.customer}`,
              JSON.stringify({
              payments: updatedClientPayments,
              lastTimeAppointmentStatus: 'Confirmed'
            }),
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            )
            .then(() => {
              linkPaymentToAppointment();
            })
            .catch((error) => {
              console.error(error.message);
              deletePayment();
            });
        })
        .catch((error) => {
          console.error(error.message);
        });
    };

    const deletePayment = () => {
      instance
        .delete(`payments/${bookingInfo.paymentId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          navigate("/checkout-appointments");
        })
        .catch((error) => {
          console.error(error.message);
        });
    };

    const linkPaymentToAppointment = () => {
      instance
        .patch(
          `payments/${paymentId}`,
          JSON.stringify({ appointment: bookingInfo.appointmentId }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        .then((response) => {
          confirmAppointmentPayment();
        })
        .catch((error) => {
          console.error(error.message);
          deletePayment();
        });
    };

    const confirmAppointmentPayment = () => {
      instance
        .patch(
          `appointments/${bookingInfo.appointmentId}`,
          JSON.stringify({
            service: bookingInfo.service,
            product: bookingInfo.product,
            status: "confirmed",
          }),
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
          deletePayment();
        });
    };


    if (bookingInfo.checkoutType === "updating") {
      if (bookingInfo.paymentId) {
        updatePayment();
      } else {
        makePayment();
      }
    } else {
      makePayment();
    }
  };

  const handleCancel = () => {
    handlePopupClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-20 inset-0 flex justify-center items-center overflow-y-auto bg-black bg-opacity-25">
          <div
            className={`w-96 my-auto mx-auto rounded-md ${isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div
              className={`rounded-md shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
            >
              <PaymentWaiting />
              <div className="flex justify-between items-center mt-4">
                <span
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-700"
                    }`}
                >
                  {t('Amount to Pay')}:
                </span>
                <span className="text-green-500 font-semibold">
                  {totalPrice} {t('USD')}
                </span>
              </div>
              <button
                onClick={handleConfirm}
                className={`w-full mt-4 ${isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-sky-800 hover:bg-sky-700"
                  } text-white py-2 px-4 rounded-md font-semibold text-sm`}
              >
                {/* Pay Now */}
                {t('Confirm Payment')}
              </button>
              <button
                className={`w-full mt-2 ${isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-500 hover:bg-gray-600"
                  } text-white py-2 px-4 rounded-md flex items-center justify-center font-semibold text-sm`}
                onClick={handleCancel}
              >
                <FiX className="h-5 w-5 mr-2" />
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreditPayment;

const PaymentWaiting = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`flex justify-center items-center rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-200"
        }`}
    >
      <div
        className={`max-w-sm rounded overflow-hidden shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
          } p-8`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaCreditCard
              className={`text-4xl ${isDarkMode ? "text-gray-200" : "text-sky-800"
                } mr-4`}
            />
            <h1
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
            >
              Credit Card Payment
            </h1>
          </div>
          <div
            className={`w-6 h-6 rounded-full ${isDarkMode ? "bg-gray-600" : "bg-sky-800"
              } animate-pulse`}
          />
        </div>
        <div
          className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"
            } p-6 rounded-lg`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`w-12 h-8 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                } rounded`}
            />
            <div className="ml-4">
              <div
                className={`w-24 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  } rounded mb-2`}
              />
              <div
                className={`w-16 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  } rounded`}
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div
              className={`w-24 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                } rounded mr-4`}
            />
            <div className="flex-1">
              <div
                className={`w-20 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  } rounded mb-2`}
              />
              <div
                className={`w-36 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  } rounded`}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div
              className={`w-32 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                } rounded mr-4`}
            />
            <div className="flex-1">
              <div
                className={`w-56 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  } rounded mb-2`}
              />
              <div
                className={`w-48 h-4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  } rounded`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

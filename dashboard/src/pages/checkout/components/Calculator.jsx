import React, { useContext, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { BsBackspace } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import instance from "../../../axiosConfig/axiosConfig";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useTranslation } from "react-i18next";

const Calculator = ({
  isOpen,
  handlePopupClose,
  totalPrice,
  change = { change },
  setAmountPaid,
  setChange,
  handleConfirmPayment,
  bookingInfo,
  clients,
  dateTime,
}) => {
  const { t } = useTranslation();
  const [amountReceived, setAmountReceived] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  const [unSfficientAmountMsg, setUnSufficientAmountMsg] = useState(false);
  const token = localStorage.getItem("ag_app_shop_token");

  const handleInputChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9.]/g, "");
    setAmountReceived(numericValue);
  };

  const handleConfirm = () => {
    if (amountReceived >= totalPrice) {
      let data = {
        managerId: bookingInfo.managerId,
        customer: bookingInfo.customer,
        professional: bookingInfo.professional,
        service: bookingInfo.service,
        product: bookingInfo.product,
        dateTime: new Date(),
        amount: bookingInfo.amount,
        method: "cash",
      };

      let patchData = {
        managerId: bookingInfo.managerId,
        customer: bookingInfo.customer,
        professional: bookingInfo.professional,
        service: bookingInfo.service,
        product: bookingInfo.product,
        dateTime: new Date(),
        amount: bookingInfo.amount + bookingInfo.prevPaid,
        method: "cash",
        updatedAt: new Date(),
      };


      let paymentId = "";

      const updatePayment = () => {
        instance
          .patch(
            `payments/${bookingInfo.paymentId}`,
            JSON.stringify(patchData),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          )
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
                JSON.stringify({ payments: updatedClientPayments }),
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                }
              )
              .then((response) => {
                linkPaymentToAppointment();
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
            setAmountPaid(amountReceived);
            setChange(amountReceived - totalPrice);
            setUnSufficientAmountMsg(false);

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
    } else {
      setUnSufficientAmountMsg(true);
    }
  };

  const handleButtonClick = (value) => {
    setAmountReceived((prevAmount) => {
      return prevAmount + value;
    });
  };

  const handleClear = () => {
    const amountBack = amountReceived.slice(0, amountReceived.length - 1);
    setAmountReceived(amountBack);
  };

  const handleCancel = () => {
    setAmountReceived("");
    setUnSufficientAmountMsg(false);
    handlePopupClose();
  };

  const handleCalculateChange = () => {
    const received = parseFloat(amountReceived);
    const total = parseFloat(totalPrice);
    if (received >= total) {
      const changeAmount = received - total;
      setChange(changeAmount.toFixed(2));
    } else {
      setChange(0);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex z-20 justify-center items-center overflow-y-auto bg-black bg-opacity-25`}
        >
          <div
            className={`bg-${isDarkMode ? "gray-800" : "white"
              } rounded-lg p-4 w-full sm:max-w-sm`}
          >
            <div className="flex items-center mb-4">
              <span
                className={`inline-flex h-10 items-center px-3 rounded-l-md border-2 border-r-0 border-gray-300 bg-gray-50 text-gray-500`}
              >
                $
              </span>
              <input
                type="text"
                placeholder={t("Enter amount received")}
                className={`flex-1 border-2 h-10 border-gray-300 rounded-r-md p-2 shadow-sm focus:outline-none focus:border-blue-500 ${isDarkMode ? "bg-gray-500" : "bg-gray-50"
                  }`}
                value={amountReceived}
                onChange={handleInputChange}
              />
            </div>

            <div
              className={`flex items-center mb-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"
                } rounded-md`}
            >
              <span
                className={`inline-flex h-10 items-center px-3 rounded-l-md border-2 border-r-0 border-gray-300 bg-gray-50 text-gray-500`}
              >
                $
              </span>
              <input
                type="text"
                className="flex-1 border-2 h-10 border-gray-300 rounded-r-md p-2 shadow-sm focus:outline-none focus:border-blue-500"
                value={totalPrice}
                disabled
              />
            </div>

            <div className="flex justify-end">
              <button
                className={`${isDarkMode
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-green-500 hover:bg-green-600"
                  } text-white mr-2 mb-2 py-2 px-4 rounded-md flex items-center font-semibold text-sm`}
                onClick={handleCalculateChange}
              >
                {t('Calculate Change')}
              </button>
            </div>

            {change > 0 && (
              <div className="mb-4">
                <p
                  className={`text-${isDarkMode ? "gray-300" : "gray-700"
                    } font-semibold`}
                >
                  {t('Change')}: ${change}
                </p>
              </div>
            )}

            {/* Calculator UI */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."].map((value) => (
                <button
                  key={value}
                  className={`${isDarkMode
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    } text-gray-700 py-2 px-2 rounded-md text-sm`}
                  onClick={() => handleButtonClick(value)}
                >
                  {value}
                </button>
              ))}
              <button
                className={`${isDarkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  } flex justify-center items-center text-gray-700 py-2 px-4 rounded-md text-sm`}
                onClick={handleClear}
              >
                <BsBackspace />
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className={`${isDarkMode
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-gray-500 hover:bg-gray-600"
                  } text-white mr-2 py-2 px-4 rounded-md flex items-center font-semibold text-sm`}
                onClick={handleCancel}
              >
                <FiX className="mr-2" />
                {t('Cancel')}
              </button>
              <button
                className={`${amountReceived - totalPrice < 0
                  ? "bg-red-400"
                  : isDarkMode
                    ? "bg-green-700"
                    : "bg-green-500 hover:bg-green-600"
                  } text-white py-2 px-4 rounded-md flex items-center font-semibold text-sm`}
                onClick={handleConfirm}
                disabled={amountReceived - totalPrice < 0}
              >
                <FiCheck className="mr-2" />
                {t('Confirm Payment')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calculator;

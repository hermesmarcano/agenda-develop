import React, { useState } from "react";
import { TiTimes } from "react-icons/ti";
import { FiCheck } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { BsBackspace } from "react-icons/bs";
import axios from "axios";

const Calculator = ({
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
  const [amountReceived, setAmountReceived] = useState("");

  const [unSfficientAmountMsg, setUnSufficientAmountMsg] = useState(false);
  const token = localStorage.getItem("ag_app_shop_token");

  const handleInputChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9.]/g, "");
    setAmountReceived(numericValue);
  };

  const handleConfirm = () => {
    console.log(amountReceived);
    console.log(totalPrice);
    if (amountReceived >= totalPrice) {
      let data = {
        managerId: bookingInfo.managerId,
        customer: bookingInfo.customer,
        professional: bookingInfo.professional,
        service: bookingInfo.service,
        dateTime: new Date(),
        amount: bookingInfo.amount,
        method: "cash",
      };

      if (bookingInfo.product) {
        data.product = bookingInfo.product;
      }

      console.log(data);
      let paymentId = "";

      const makePaymentWithCustomer = () => {
        axios
          .post(
            "http://localhost:4040/customers/",
            {
              name: bookingInfo.name,
              phone: bookingInfo.phone,
              managerId: bookingInfo.managerId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          )
          .then((response) => {
            const { customer } = response.data;
            data.customer = customer._id;
            makePayment();
          })
          .catch((error) => {
            console.error(error.message);
          });
      };

      const makePayment = () => {
        axios
          .post("http://localhost:4040/payments", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data);
            paymentId = response.data.payment._id;
            const cuurentClient = clients.find(
              (client) => client._id === bookingInfo.customer
            );
            const updatedClientPayments =
              Number(cuurentClient.payments) + Number(bookingInfo.amount);
            console.log("updatedClientPayments: ", updatedClientPayments);
            console.log("customer id: ", bookingInfo.customer);
            axios
              .patch(
                `http://localhost:4040/customers/${bookingInfo.customer}`,
                JSON.stringify({ payments: updatedClientPayments }),
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                }
              )
              .then((response) => {
                console.log(response.data);
                createAppointment();
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.error(error.message);
          });
      };

      const createAppointment = () => {
        let apptData = {
          customer: bookingInfo.customer,
          professional: bookingInfo.professional,
          service: bookingInfo.service,
          duration: bookingInfo.duration,
          dateTime: new Date(dateTime),
          managerId: bookingInfo.managerId,
        };

        if (bookingInfo.product) {
          apptData.product = bookingInfo.product;
        }
        axios
          .post("http://localhost:4040/appointments", apptData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data);
            linkPaymentToAppointment(response.data.appointment._id);
          })
          .catch((error) => {
            console.error(error.message);
            // Handle errors
          });
      };

      const linkPaymentToAppointment = (appointmentId) => {
        axios
          .patch(
            `http://localhost:4040/payments/${paymentId}`,
            { appointment: appointmentId },
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

            handlePopupClose();
            handleConfirmPayment();
          })
          .catch((error) => {
            console.error(error.message);
          });
      };

      if (bookingInfo.addCustomerClicked) {
        makePaymentWithCustomer();
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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-10 flex justify-center items-center overflow-y-auto">
          <div className="bg-white rounded-lg p-4 w-full sm:max-w-sm">
            <div className="flex items-center mb-4">
              <span className="inline-flex h-10 items-center px-3 rounded-l-md border-2 border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                $
              </span>
              <input
                type="text"
                placeholder="Enter amount received"
                className="flex-1 border-2 h-10 border-gray-300 rounded-r-md p-2 shadow-sm focus:outline-none focus:border-blue-500"
                value={amountReceived}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center mb-4 bg-gray-300 rounded-md">
              <span className="inline-flex h-10 items-center px-3 rounded-l-md border-2 border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                $
              </span>
              <input
                type="text"
                className="flex-1 border-2 h-10 border-gray-300 rounded-r-md p-2 shadow-sm focus:outline-none focus:border-blue-500"
                value={totalPrice}
                disabled
              />
            </div>

            {/* Calculator UI */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."].map((value) => (
                <button
                  key={value}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-2 rounded-md text-sm"
                  onClick={() => handleButtonClick(value)}
                >
                  {value}
                </button>
              ))}
              <button
                className="bg-gray-200 flex justify-center items-center hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm"
                onClick={handleClear}
              >
                <BsBackspace />
              </button>
            </div>

            {unSfficientAmountMsg && (
              <div>
                <p className="text-red-500 text-xs italic">
                  Unsufficient Amount
                </p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white mr-2 py-2 px-4 rounded-md flex items-center font-semibold text-sm"
                onClick={handleCancel}
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center font-semibold text-sm"
                onClick={handleConfirm}
              >
                <FiCheck className="mr-2" />
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calculator;

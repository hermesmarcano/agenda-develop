import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FiX } from "react-icons/fi";
import axios from "axios";

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
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem("ag_app_shop_token");

  //   const handleConfirm = () => {
  //     console.log(totalPrice);
  //     setAmountPaid(totalPrice);
  //     setChange(0);
  //     handlePopupClose();
  //     handleConfirmPayment();
  //   };

  const handleConfirm = () => {
    let data = {
      shopName: bookingInfo.shopName,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      dateTime: new Date(),
      amount: bookingInfo.amount,
    };
    console.log(data);
    if (bookingInfo.addCustomerClicked) {
      axios
        .post(
          "http://localhost:4040/customers/",
          {
            name: bookingInfo.name,
            phone: bookingInfo.phone,
            shopName: bookingInfo.shopName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("ag_app_shop_token"),
            },
          }
        )
        .then((response) => {
          const { customer } = response.data;
          data.customer = customer._id;
          axios
            .post("http://localhost:4040/payments", data, {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
            .then((response) => {
              console.log(response.data);
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
                      Authorization: localStorage.getItem("ag_app_shop_token"),
                    },
                  }
                )
                .then((response) => {
                  console.log(response.data);
                  axios
                    .post(
                      "http://localhost:4040/appointments",
                      {
                        customer: bookingInfo.customer,
                        professional: bookingInfo.professional,
                        service: bookingInfo.service,
                        duration: bookingInfo.duration,
                        dateTime: new Date(dateTime),
                        shopName: bookingInfo.shopName,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: token,
                        },
                      }
                    )
                    .then((response) => {
                      console.log(response.data);
                      setAmountPaid(totalPrice);
                      setChange(0);
                      handlePopupClose();
                      handleConfirmPayment();
                    })
                    .catch((error) => {
                      console.error(error.message);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.error(error.message);
            });
        });
    } else {
      axios
        .post("http://localhost:4040/payments", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response.data);
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
                  Authorization: localStorage.getItem("ag_app_shop_token"),
                },
              }
            )
            .then((response) => {
              console.log(response.data);
              axios
                .post(
                  "http://localhost:4040/appointments",
                  {
                    customer: bookingInfo.customer,
                    professional: bookingInfo.professional,
                    service: bookingInfo.service,
                    duration: bookingInfo.duration,
                    dateTime: new Date(dateTime),
                    shopName: bookingInfo.shopName,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token,
                    },
                  }
                )
                .then((response) => {
                  console.log(response.data);
                  setAmountPaid(totalPrice);
                  setChange(0);
                  handlePopupClose();
                  handleConfirmPayment();
                })
                .catch((error) => {
                  console.error(error.message);
                  // Handle errors
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission or show a loading indicator.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log(error);
      // Handle error
    } else {
      console.log(paymentMethod);
      // Payment method created successfully
      // Send the payment method ID to your server for further processing
      handleConfirm();
    }
  };

  const handleCancel = () => {
    handlePopupClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center overflow-y-auto bg-black bg-opacity-25">
          <div className="w-96 my-auto mx-auto bg-white rounded-md">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-md shadow-md p-6">
                <label className="block text-gray-700 font-semibold">
                  Card details
                </label>
                <CardElement className="mt-2 p-2 border border-gray-300 rounded-md" />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-700 font-semibold">
                    Amount to Pay:
                  </span>
                  <span className="text-blue-500 font-semibold">
                    {totalPrice} USD
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-sm"
                >
                  Pay Now
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

export default CreditPayment;

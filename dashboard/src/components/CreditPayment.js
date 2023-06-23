// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaCreditCard } from "react-icons/fa";
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
  // const stripe = useStripe();
  // const elements = useElements();
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
      managerId: bookingInfo.managerId,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      dateTime: new Date(),
      amount: bookingInfo.amount,
      method: "credit",
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
          setAmountPaid(totalPrice);
          setChange(0);
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
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (!stripe || !elements) {
  //     // Stripe.js has not yet loaded.
  //     // Make sure to disable form submission or show a loading indicator.
  //     return;
  //   }

  //   const cardElement = elements.getElement(CardElement);

  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: cardElement,
  //   });

  //   if (error) {
  //     console.log(error);
  //     // Handle error
  //   } else {
  //     console.log(paymentMethod);
  //     // Payment method created successfully
  //     // Send the payment method ID to your server for further processing
  //     handleConfirm();
  //   }
  // };

  const handleCancel = () => {
    handlePopupClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center overflow-y-auto bg-black bg-opacity-25">
          <div className="w-96 my-auto mx-auto bg-white rounded-md">
            <form onSubmit={handleConfirm}>
              <div className="bg-white rounded-md shadow-md p-6">
                {/* <label className="block text-gray-700 font-semibold">
                  Card details
                </label> */}
                {/* <CardElement className="mt-2 p-2 border border-gray-300 rounded-md" /> */}
                <PaymentWaiting />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-700 font-semibold">
                    Amount to Pay:
                  </span>
                  <span className="text-green-500 font-semibold">
                    {totalPrice} USD
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-semibold text-sm"
                >
                  {/* Pay Now */}
                  Confirm Payment
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

const PaymentWaiting = () => {
  return (
    <div className="flex justify-center items-center bg-gray-200">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaCreditCard className="text-4xl text-gray-800 mr-4" />
            <h1 className="text-xl font-semibold">Credit Card Payment</h1>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-800 animate-pulse" />
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-8 bg-gray-300 rounded" />
            <div className="ml-4">
              <div className="w-24 h-4 bg-gray-300 rounded mb-2" />
              <div className="w-16 h-4 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-24 h-4 bg-gray-300 rounded mr-4" />
            <div className="flex-1">
              <div className="w-20 h-4 bg-gray-300 rounded mb-2" />
              <div className="w-36 h-4 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-32 h-4 bg-gray-300 rounded mr-4" />
            <div className="flex-1">
              <div className="w-56 h-4 bg-gray-300 rounded mb-2" />
              <div className="w-48 h-4 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

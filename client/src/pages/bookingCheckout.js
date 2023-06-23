import React, { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCcVisa,
  FaCcMastercard,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";
import instance from "../axiosConfig/axiosConfig";

const stripePromise = loadStripe("your_publishable_key_here");

function BookingCheckout() {
  const navigate = useNavigate();
  const params = useParams();
  const [customerCurrentPayments, setCustomerCurrentPayments] = useState(0);
  const [paymentOption, setPaymentOption] = useState("payOnCounter");
  const [cardErrorMessage, setCardErrorMessage] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [bookingInfo, setBookingInfo] = useState(
    JSON.parse(localStorage.getItem("bookingInfo"))
  );
  const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));

  useEffect(() => {
    instance
      .get(`/customers/id`, {
        headers: {
          Authorization: localStorage.getItem("ag_app_customer_token"),
        },
      })
      .then((response) => {
        const customer = response.data;
        setCustomerCurrentPayments(customer.payments);
        setBookingInfo({
          ...bookingInfo,
          customer: customer._id,
          dateTime: new Date(bookingInfo.dateTime),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let data = {
      managerId: bookingInfo.managerId,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      dateTime: new Date(),
      amount: bookingInfo.amount,
      method: paymentMethod,
    };

    if (bookingInfo.product) {
      data.product = bookingInfo.product;
    }

    console.log(data);
    let paymentId = "";

    const makePaymentWithCustomer = () => {
      instance
        .post(
          "/customers/",
          {
            name: bookingInfo.name,
            phone: bookingInfo.phone,
            managerId: bookingInfo.managerId,
          },
          {
            headers: {
              "Content-Type": "application/json",
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
      instance
        .post("/payments", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response.data);
          paymentId = response.data.payment._id;
          let updatedClientPayments = Number(bookingInfo.amount);
          instance
            .get(`/customers/id`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("ag_app_customer_token"),
              },
            })
            .then((response) => {
              console.log(response.data);
              updatedClientPayments += Number(response.data.payments);
            });

          console.log("updatedClientPayments: ", updatedClientPayments);
          console.log("customer id: ", bookingInfo.customer);
          instance
            .patch(
              `/customers/${bookingInfo.customer}`,
              JSON.stringify({ payments: updatedClientPayments }),
              {
                headers: {
                  "Content-Type": "application/json",
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
        dateTime: bookingInfo.dateTime,
        managerId: bookingInfo.managerId,
      };
      if (bookingInfo.product) {
        apptData.product = bookingInfo.product;
      }
      instance
        .post("/appointments", apptData, {
          headers: {
            "Content-Type": "application/json",
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
      instance
        .patch(
          `/payments/${paymentId}`,
          { appointment: appointmentId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          navigate(`/shops/${params.id}/booking-completed`);
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

  const handleCardChange = (event) => {
    if (event.error) {
      setCardErrorMessage(event.error.message);
    } else {
      setCardErrorMessage(null);
    }
  };

  return (
    <div className="container mx-auto px-8 py-4">
      <div className="md:flex md:items-start md:justify-center">
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-8">Booking Checkout</h1>
          <form onSubmit={handleSubmit}>
            <div className="shadow-md bg-white rounded-md p-8">
              <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold">Payment Method</h2>
              </div>
              <div className="flex justify-center space-x-4 mb-4">
                <div
                  className={`cursor-pointer ${
                    paymentMethod === "cash" ? "ring-2 ring-indigo-700" : ""
                  }`}
                  onClick={() => {
                    setPaymentMethod("cash");
                  }}
                >
                  <div className="flex flex-col mx-2 px-8 py-8 w-40 justify-center shadow-md rounded-md items-center">
                    <div className="mr-2 text-indigo-500">
                      <FaMoneyBillWave size={30} />
                    </div>
                    <div className="text-lg">Cash</div>
                  </div>
                </div>
                <div
                  className={`cursor-pointer ${
                    paymentMethod === "credit" ? "ring-2 ring-indigo-700" : ""
                  }`}
                  onClick={() => {
                    setPaymentMethod("credit");
                  }}
                >
                  <div className="flex flex-col mx-2 px-8 py-8 w-40 justify-center shadow-md rounded-md items-center">
                    <div className="mr-2 text-indigo-500">
                      <FaCreditCard size={30} />
                    </div>
                    <div className="text-lg">Credit Card</div>
                  </div>
                </div>
              </div>
              {paymentOption === "stripe" && (
                <div className="mb-4">
                  <label htmlFor="cardElement">Credit Card Information</label>
                  <div className="border border-gray-300 p-4 rounded-md">
                    <CardElement id="cardElement" onChange={handleCardChange} />
                  </div>
                  {cardErrorMessage && (
                    <div className="text-red-500 text-sm mt-2">
                      {cardErrorMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full my-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete Booking
            </button>
          </form>
        </div>
        <div className="md:w-1/3 md:pl-8">
          <div className="shadow-md bg-white rounded-md p-4">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-lg">Services:</span>
                <div className="flex flex-wrap items-center">
                  {bookingDetails.service.map((service, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-600 text-sm px-2 py-1 rounded-full mr-2 mb-2"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Professional:</span>
                <span className="text-sm">{bookingDetails.professional}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg">Products:</span>
                <div className="flex flex-wrap items-center">
                  {bookingDetails.product.map((product, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-600 text-sm px-2 py-1 rounded-full mr-2 mb-2"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Date and Time:</span>
                <span className="text-sm">
                  {new Date(bookingDetails.dateTime).toLocaleString()}
                </span>
              </div>
              {/* Add more booking details as needed */}
            </div>
            <div className="flex items-center justify-end mt-8">
              <span className="font-bold">Total Price:</span>
              <span className="ml-2">${bookingDetails.amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <BookingCheckout />
    </Elements>
  );
}

export default PaymentPage;

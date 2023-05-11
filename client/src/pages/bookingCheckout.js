import React, { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";
// import twilio from "twilio";

const stripePromise = loadStripe("your_publishable_key_here");

function BookingCheckout() {
  const navigate = useNavigate();
  const params = useParams();
  const [paymentOption, setPaymentOption] = useState("payOnCounter");
  const [cardErrorMessage, setCardErrorMessage] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  // const [amount, setAmount] = useState(0);
  //   const [twilioPhone, setTwilioPhone] = useState();
  //   const [recipientPhone, setRecipientPhone] = useState();
  //   const [messageBody, setMessageBody] = useState("");

  //   const sendSMS = () => {
  //     const accountSid = "your_account_sid";
  //     const authToken = "your_auth_token";

  //     const client = twilio(accountSid, authToken);
  //     client.messages
  //       .create({
  //         body: messageBody,
  //         from: twilioPhone, // Twilio phone number
  //         to: recipientPhone, // recipient phone number
  //       })
  //       .then((message) => console.log(message.sid))
  //       .catch((error) => console.error(error));
  //   };

  const [bookingInfo, setBookingInfo] = useState(
    JSON.parse(localStorage.getItem("bookingInfo"))
  );

  const handlePaymentOptionChange = (event) => {
    setPaymentOption(event.target.value);
  };

  useEffect(() => {
    // const customerId = localStorage.getItem("customerId");
    instance
      .get(`/customers/id`, {
        headers: { Authorization: localStorage.getItem("customerToken") },
      })
      .then((response) => {
        const customer = response.data;
        console.log(response.data);
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
    const {
      shopName,
      customer,
      service,
      professional,
      product,
      amount,
      dateTime,
    } = bookingInfo;
    let paymentObj = {};
    let appointmentObj = {};
    if (product) {
      paymentObj = {
        shopName,
        customer,
        service,
        professional,
        product,
        amount,
        dateTime: new Date(),
      };
      appointmentObj = {
        shopName,
        customer,
        service,
        professional,
        product,
        dateTime: new Date(bookingInfo.dateTime),
      };
    } else {
      paymentObj = {
        shopName,
        customer,
        service,
        professional,
        amount,
        dateTime: new Date(),
      };
      appointmentObj = {
        shopName,
        customer,
        service,
        professional,
        product,
        dateTime: new Date(bookingInfo.dateTime),
      };
    }
    if (paymentOption === "stripe") {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        setCardErrorMessage(error.message);
      } else {
        const paymentIntent = await instance.post(`/create-payment-intent`, {
          amount: amount,
          currency: "usd",
          paymentMethod: paymentMethod.id,
        });

        const { error: paymentIntentError } = await stripe.confirmCardPayment(
          paymentIntent.data.client_secret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (paymentIntentError) {
          console.error(paymentIntentError);
          setCardErrorMessage(paymentIntentError.message);
        } else {
          // Handle successful payment here
          localStorage.setItem("payment", "stripe");
          //   setTwilioPhone('+123 456 7890');
          //   setRecipientPhone('+123 456 7890');
          //   setMessageBody("");
          //   sendSMS();
          navigate(`/shops/${params.id}/booking-completed`);
        }
      }
    } else {
      // Handle payOnCounter option here
      console.log("payment obj: " + JSON.stringify(paymentObj));
      console.log("appointment obj: " + JSON.stringify(appointmentObj));
      instance
        .post(`/payments/`, JSON.stringify(paymentObj), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log(response);
          instance
            .post(`/appointments/`, JSON.stringify(appointmentObj), {
              headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
              console.log(response);
              localStorage.setItem("payment", "on Counter");
              //   setTwilioPhone('+123 456 7890');
              //   setRecipientPhone('+123 456 7890');
              //   setMessageBody("");
              //   sendSMS();
              navigate(`/shops/${params.id}/booking-completed`);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
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
    <div className="container mx-auto mt-8">
      <div className="md:flex md:items-center md:justify-center">
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">Booking Checkout</h1>
          <form onSubmit={handleSubmit}>
            <div className="shadow-md bg-white rounded-md p-8">
              <div className="flex items-center mb-8">
                <h2 className="text-lg font-bold">Payment Method</h2>
                <div className="ml-4 flex items-center">
                  <img
                    className="h-6 w-6 mr-2"
                    src="https://img.icons8.com/color/452/visa.png"
                    alt="Visa"
                  />
                  <img
                    className="h-6 w-6"
                    src="https://img.icons8.com/color/452/mastercard.png"
                    alt="Mastercard"
                  />
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <label htmlFor="payOnCounter" className="mr-4">
                  <input
                    type="radio"
                    id="payOnCounter"
                    name="paymentOption"
                    value="payOnCounter"
                    className="mr-2"
                    checked={paymentOption === "payOnCounter"}
                    onChange={handlePaymentOptionChange}
                  />
                  Pay on Counter
                </label>
                <label htmlFor="stripe">
                  <input
                    type="radio"
                    id="stripe"
                    name="paymentOption"
                    value="stripe"
                    className="mr-2"
                    checked={paymentOption === "stripe"}
                    onChange={handlePaymentOptionChange}
                    disabled
                  />
                  Credit Card Payment
                </label>
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

//   export default BookingCheckout;

function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <BookingCheckout />
    </Elements>
  );
}

export default PaymentPage;

import React, { useEffect, useState } from "react";
import { IoCard, IoCash } from "react-icons/io5";
import CheckoutHeader from "./components/CheckoutHeader";
import CheckoutFooter from "./components/CheckoutFooter";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaMoneyBillAlt,
  FaCalendarAlt,
  FaUserAlt,
  FaUsers,
  FaShoppingBag,
} from "react-icons/fa";
import instance from "../../axiosConfig/axiosConfig";

const Checkout = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [customerCurrentPayments, setCustomerCurrentPayments] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [cardErrorMessage, setCardErrorMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const [bookingInfo, setBookingInfo] = useState(
    JSON.parse(localStorage.getItem("bookingInfo"))
  );
  const token = localStorage.getItem("ag_app_customer_token");
  const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));

  useEffect(() => {
    instance
      .get(`/customers/id`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const customer = response.data;
        setCustomerCurrentPayments(customer.payments);
        setCustomerName(customer.name);
        setBookingInfo({
          ...bookingInfo,
          customer: customer._id,
          dateTime: new Date(bookingInfo.dateTime),
        });
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const confirmPayment = async () => {
    let data = {
      managerId: bookingInfo.managerId,
      customer: bookingInfo.customer,
      professional: bookingInfo.professional,
      service: bookingInfo.service,
      dateTime: new Date(),
      amount: bookingInfo.amount,
      method: bookingInfo.method,
    };

    console.log(data);

    if (bookingInfo.product) {
      data.product = bookingInfo.product;
    }

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
    <div className="bg-gray-200 h-screen">
      <CheckoutHeader />
      <div className="grid grid-cols-1 sm:grid-cols-3 h-[calc(100%-97px)]">
        <main className="py-4 px-8 h-full col-span-2 flex justify-center items-center">
          <PaymentChoice
            setBookingInfo={setBookingInfo}
            bookingInfo={bookingInfo}
            confirmPayment={confirmPayment}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </main>
        <div className="py-4 px-8 bg-white col-span-1">
          <div className="md-whiteframe-2dp">
            <PaymentSummary
              customer={customerName}
              bookingInfo={bookingDetails}
              paymentMethod={paymentMethod}
              confirmPayment={confirmPayment}
            />
          </div>
        </div>
      </div>

      <CheckoutFooter />
    </div>
  );
};

export default Checkout;

const PaymentChoice = ({
  setBookingInfo,
  bookingInfo,
  confirmPayment,
  paymentMethod,
  setPaymentMethod,
}) => {
  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setBookingInfo({
      ...bookingInfo,
      method: method,
    });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-6">Choose Payment Method</h2>
        <div className="flex justify-center items-center space-x-8">
          <div
            className={`cursor-pointer w-40 lg:w-72 h-40 flex flex-col justify-center items-center p-6 ${
              paymentMethod === "credit"
                ? "bg-blue-100 border-blue-500 border-2"
                : "bg-white border-gray-200 border"
            } rounded-lg transition-transform hover:scale-105`}
            onClick={() => handlePaymentSelect("credit")}
          >
            <IoCard className="text-blue-500 text-5xl" />
            <p className="mt-3 text-lg font-semibold">Credit Card</p>
          </div>
          <div
            className={`cursor-pointer w-40 lg:w-72 h-40 flex flex-col justify-center items-center p-6 ${
              paymentMethod === "cash"
                ? "bg-green-100 border-green-500 border-2"
                : "bg-white border-gray-200 border"
            } rounded-lg transition-transform hover:scale-105`}
            onClick={() => handlePaymentSelect("cash")}
          >
            <IoCash className="text-green-500 text-5xl" />
            <p className="mt-3 text-lg font-semibold">Cash</p>
          </div>
        </div>
        {paymentMethod && (
          <button
            onClick={confirmPayment}
            className="mt-8 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
          >
            Confirm Payment
          </button>
        )}
      </div>
    </div>
  );
};

const SkillTag = ({ text }) => (
  <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
    {text}
  </span>
);

const PaymentSummary = ({
  customer,
  bookingInfo,
  paymentMethod,
  confirmPayment,
}) => {
  const formattedDate = new Date(bookingInfo.dateTime).toLocaleDateString();
  const formattedTime = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    hour12: true,
  }).format(new Date(bookingInfo.dateTime));

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Payment Summary</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-4">
            <FaUserAlt className="mr-2" />
            <span className="text-gray-600">Customer:</span>
          </div>
          <div className="flex items-center mb-4">
            <FaUserAlt className="mr-2" />
            <span className="text-gray-600">Professional:</span>
          </div>
          <div className="flex items-center mb-4">
            <FaUsers className="mr-2" />
            <span className="text-gray-600">Services:</span>
          </div>
          <div className="flex items-center mb-4">
            <FaShoppingBag className="mr-2" />
            <span className="text-gray-600">Products:</span>
          </div>
          <div className="flex items-center mb-4">
            <FaMoneyBillAlt className="mr-2" />
            <span className="text-gray-600">Amount:</span>
          </div>
        </div>
        <div>
          <div className="mb-4">{customer}</div>
          <div className="mb-4">{bookingInfo.professional}</div>
          <div className="mb-4 flex flex-wrap">
            {bookingInfo.service.map((service, index) => (
              <SkillTag key={index} text={service} />
            ))}
          </div>
          <div className="mb-4 flex-wrap">
            {bookingInfo?.product.map((product, index) => (
              <SkillTag key={index} text={product} />
            ))}
          </div>
          <div className="mb-4">$ {bookingInfo.amount}</div>
        </div>
        <div>
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="mr-2" />
            <span className="text-gray-600">Date & Time:</span>
          </div>
          <div className="mb-4">
            {formattedDate} at {formattedTime}
          </div>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

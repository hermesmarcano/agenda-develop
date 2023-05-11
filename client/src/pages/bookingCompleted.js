import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";

function BookingCompleted() {
  const navigate = useNavigate();
  const [reservedPersonName, setReservedPersonName] = useState("John Doe");
  const paymentMethod = localStorage.getItem("payment");

  useEffect(() => {
    instance
      .get(`/customers/id`, {
        headers: { Authorization: localStorage.getItem("customerToken") },
      })
      .then((response) => {
        const customer = response.data;
        console.log(response.data);
        setReservedPersonName(`${customer.name}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDoneClick = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>

            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Booking is Completed
            </h2>
          </div>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              Your booking has been confirmed.{" "}
              {reservedPersonName && `Reserved under ${reservedPersonName}.`}{" "}
              Payment was made with {paymentMethod}.
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={handleDoneClick}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingCompleted;

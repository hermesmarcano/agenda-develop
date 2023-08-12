import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
  RiCalendarEventFill,
  RiTimeFill,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { SidebarContext } from "../context/SidebarContext";
import { DarkModeContext } from "../context/DarkModeContext";

const PendingAppointments = () => {
  const { shopId } = useContext(SidebarContext);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const fetchAppointmentData = () =>
    axios
      .get(`http://localhost:4040/appointments?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const registeredAppointments = response.data.appointments
          .filter(
            (appt) =>
              !appt.blocking &&
              (appt.status === "pending" || appt.status === "updating")
          )
          .reverse();
        setPendingAppointments(registeredAppointments);
        setCurrentAppointments(
          registeredAppointments.slice(firstIndex, lastIndex)
        );
      })
      .catch((error) => {
        console.log(error);
      });

  // const currentAppointments = pendingAppointments.slice(firstIndex, lastIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedAppointment(null); // Reset selected appointment on page change

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setCurrentAppointments(pendingAppointments.slice(startIndex, endIndex));
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCheckout = () => {
    // Perform checkout logic here
    selectedAppointment.status === "pending"
      ? localStorage.setItem(
          "ag_app_booking_info",
          JSON.stringify({
            customer: selectedAppointment.customer._id,
            professional: selectedAppointment.professional._id,
            service: selectedAppointment.service.map((s) => s._id),
            duration: selectedAppointment.service.reduce(
              (totalDuration, s) => totalDuration + s.duration,
              0
            ),
            dateTime: new Date(selectedAppointment.dateTime),
            amount: selectedAppointment.service.reduce(
              (totalPrice, s) => totalPrice + s.price,
              0
            ),
            appointmentId: selectedAppointment._id,
            managerId: shopId,
            checkoutType: "registering",
          })
        )
      : localStorage.setItem(
          "ag_app_booking_info",
          JSON.stringify({
            customer: selectedAppointment.customer._id,
            professional: selectedAppointment.professional._id,
            service: selectedAppointment.service.map((s) => s._id),
            product: selectedAppointment.product.map((p) => p._id),
            duration: selectedAppointment.service.reduce(
              (totalDuration, s) => totalDuration + s.duration,
              0
            ),
            dateTime: new Date(selectedAppointment.dateTime),
            amount:
              selectedAppointment.service.reduce(
                (totalPrice, s) => totalPrice + s.price,
                0
              ) +
              selectedAppointment.product.reduce(
                (totalPrice, p) => totalPrice + p.price,
                0
              ),
            appointmentId: selectedAppointment._id,
            managerId: shopId,
            checkoutType: "updating",
          })
        );
    navigate("/checkout");
  };

  return (
    // In the return statement
    <div className="p-4 flex flex-col lg:flex-row">
      <div className="lg:w-3/4 pr-5">
        <h1 className="text-xl font-bold mb-6">Pending Appointments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className={`rounded-lg shadow-md ${
                selectedAppointment &&
                selectedAppointment._id === appointment._id
                  ? "ring-2 ring-gray-800"
                  : ""
              } 
              cursor-pointer transition-colors duration-300 hover:bg-gray-100`}
              onClick={() => handleAppointmentSelect(appointment)}
            >
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 rounded-lg items-center p-4 ${
                  isDarkMode
                    ? "bg-gray-500 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-2">
                    {appointment.status === "pending" ? (
                      <RiCheckboxBlankCircleLine className="text-red-500 text-2xl" />
                    ) : (
                      <RiCheckboxBlankCircleLine className="text-yellow-500 text-2xl" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {appointment.customer.name}
                    </h2>
                    <div className="flex items-center text-gray-700">
                      <RiCalendarEventFill className="mr-1" />
                      <p className="text-sm">
                        {new Intl.DateTimeFormat(["ban", "id"]).format(
                          new Date(appointment.dateTime)
                        )}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <RiTimeFill className="mr-1" />
                      <p className="text-sm">
                        {new Intl.DateTimeFormat("en", {
                          timeStyle: "short",
                        }).format(new Date(appointment.dateTime))}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold flex justify-end items-center">
                  $
                  {appointment?.product?.length > 0
                    ? (
                        appointment.service.reduce(
                          (totalPrice, s) => totalPrice + s.price,
                          0
                        ) +
                        appointment.product.reduce(
                          (totalPrice, p) => totalPrice + p.price,
                          0
                        )
                      ).toFixed(2)
                    : appointment.service
                        .reduce((totalPrice, s) => totalPrice + s.price, 0)
                        .toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        {pendingAppointments.length > itemsPerPage && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={pendingAppointments.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <div className="lg:w-1/4 pb-3">
        {selectedAppointment ? (
          <div className="mt-4 h-full">
            <div
              className={`h-full p-4 rounded-lg shadow-md flex flex-col ${
                isDarkMode
                  ? "bg-gray-500 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">
                {selectedAppointment.customer.name}
              </h2>
              <p className="text-gray-700 mb-4">
                Professional: {selectedAppointment.professional.name}
              </p>
              <div className="flex flex-col mb-4">
                <p className="text-sm text-gray-700 mb-1">Services:</p>
                {selectedAppointment.service.map((service, index) => (
                  <p
                    key={index}
                    className="text-gray-800 flex items-center flex-wrap text-sm"
                  >
                    <RiCheckboxCircleLine className="text-gray-800 mr-1" />
                    {service.name} (
                    <span className="flex items-center">
                      {service.duration} min <FiClock className="ml-1" />
                    </span>
                    )
                  </p>
                ))}
              </div>
              {selectedAppointment?.product?.length > 0 && (
                <div className="flex flex-col mb-4">
                  <p className="text-sm text-gray-600 mb-1">products:</p>
                  {selectedAppointment.product.map((product, index) => (
                    <p
                      key={index}
                      className="text-gray-800 flex items-center flex-wrap text-sm"
                    >
                      <RiCheckboxCircleLine className="text-gray-800 mr-1" />
                      {product.name}
                    </p>
                  ))}
                </div>
              )}
              <p className="text-gray-800 mb-4">
                <RiMoneyDollarCircleLine className="text-green-500 mr-1" />
                Price: $
                {selectedAppointment?.product?.length > 0
                  ? (
                      selectedAppointment.service.reduce(
                        (totalPrice, s) => totalPrice + s.price,
                        0
                      ) +
                      selectedAppointment.product.reduce(
                        (totalPrice, p) => totalPrice + p.price,
                        0
                      )
                    ).toFixed(2)
                  : selectedAppointment.service
                      .reduce((totalPrice, s) => totalPrice + s.price, 0)
                      .toFixed(2)}
              </p>
              <button
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md mt-auto"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 items-center justify-center h-full">
            <div
              className={`p-4 rounded-lg shadow-md h-full flex flex-col justify-center text-center items-center  ${
                isDarkMode
                  ? "bg-gray-500 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <RiCheckboxBlankCircleLine className="text-gray-800 text-5xl mb-4" />
              <h2 className="text-gray-800 text-3xl font-semibold mb-2">
                No selected appointment
              </h2>
              <p className="text-gray-700 text-lg">
                Please choose an appointment to proceed.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700"
                onClick={() => navigate("/")}
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingAppointments;

function Pagination({ itemsPerPage, totalItems, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { isDarkMode } = useContext(DarkModeContext);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageButtons = () => {
    const visiblePageButtons = [];
    const maxVisibleButtons = 4; // Maximum number of visible buttons

    let start = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let end = Math.min(start + maxVisibleButtons - 1, totalPages);

    if (end - start < maxVisibleButtons - 1) {
      start = Math.max(1, end - maxVisibleButtons + 1);
    }

    for (let page = start; page <= end; page++) {
      visiblePageButtons.push(
        <button
          key={page}
          className={`mx-2 h-[40px] px-4 py-2 rounded-md ${
            currentPage === page
              ? `
              ${
                isDarkMode
                  ? "bg-gray-400 text-gray-800"
                  : "bg-gray-800 text-white"
              }
              `
              : `${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500 hover:text-gray-800"
                    : "bg-gray-300 hover:bg-gray-800 hover:text-white"
                }`
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      );
    }

    return visiblePageButtons;
  };

  return (
    <div className="mt-6">
      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center">
          <button
            className={`mr-2 h-[40px] my-1 px-4 py-2 rounded-md ${
              currentPage === 1
                ? `
              cursor-not-allowed
              ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}
              `
                : `${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500 hover:text-gray-800"
                      : "bg-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>

          {currentPage > 3 && (
            <button
              className={`mx-2 h-[40px] my-1 px-4 py-2 rounded-md 
            ${
              isDarkMode
                ? "bg-gray-600 hover:bg-gray-500 hover:text-gray-800"
                : "bg-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
          )}

          {currentPage > 4 && (
            <button
              className={`mx-2 h-[40px] my-1 px-4 py-2 rounded-md 
          ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`}
              disabled={true}
            >
              ...
            </button>
          )}

          {renderPageButtons()}

          {currentPage < totalPages - 3 && (
            <button
              className={`mx-2 h-[40px] my-1 px-4 py-2 rounded-md 
            ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`}
              disabled={true}
            >
              ...
            </button>
          )}

          {currentPage < totalPages - 2 && (
            <button
              className={`mx-2 h-[40px] my-1 px-4 py-2 rounded-md 
              ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500 hover:text-gray-800"
                  : "bg-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            className={`ml-2 h-[40px] my-1 px-4 py-2 rounded-md  ${
              currentPage === totalPages
                ? `
                cursor-not-allowed
                ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}
                `
                : `${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500 hover:text-gray-800"
                      : "bg-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </nav>
      )}
    </div>
  );
}

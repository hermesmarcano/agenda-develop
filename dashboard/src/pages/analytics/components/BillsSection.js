import { MdAttachMoney, MdShoppingCart } from "react-icons/md";
import Pagination from "../../../components/Pagination";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SidebarContext } from "../../../context/SidebarContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import apiProvider from "../../../axiosConfig/axiosConfig";

const BillsSection = () => {
  const { shopId } = useContext(SidebarContext);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const fetchAppointmentData = () =>
    apiProvider
      .get(`appointments?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const registeredAppointments = response.data.appointments
          .filter((appt) => !appt.blocking && appt.status === "in-debt")
          .reverse();
        setPendingAppointments(registeredAppointments);
        setCurrentAppointments(
          registeredAppointments.slice(firstIndex, lastIndex)
        );
      })
      .catch((error) => {
        console.log(error);
      });

  const handleCheckout = (selectedAppointment) => {
    // Perform checkout logic here
    localStorage.setItem(
      "ag_app_booking_info",
      JSON.stringify({
        customer: selectedAppointment.customer._id,
        professional: selectedAppointment.professional._id,
        service: selectedAppointment.service.map((s) => s._id),
        product: selectedAppointment?.product?.map((p) => p._id),
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
          selectedAppointment?.product?.reduce(
            (totalPrice, p) => totalPrice + p.price,
            0
          ),
        appointmentId: selectedAppointment._id,
        managerId: shopId,
        checkoutType: "in-debt",
      })
    );

    navigate("/checkout");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setCurrentAppointments(pendingAppointments.slice(startIndex, endIndex));
  };

  return (
    <>
      <div
        className={`shadow-md rounded-md p-6 
    ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
      >
        <h2 className="text-lg font-bold mb-4">Pending In Debt Checkouts</h2>
        <div className="grid grid-cols-1 gap-2">
          {currentAppointments.length === 0 ? (
            <p className="text-gray-500">No In Debt checkouts.</p>
          ) : (
            currentAppointments.map((checkout) => (
              <div
                key={checkout._id}
                className={`flex flex-wrap items-center justify-between rounded-lg p-4 ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <MdShoppingCart size={24} className="mr-2 text-blue-500" />
                  <div>
                    <div className="font-bold">{checkout.customer.name}</div>
                    <div className="text-sm text-gray-500">
                      Total: $
                      {checkout?.product?.length > 0
                        ? (
                            checkout.service.reduce(
                              (totalPrice, s) => totalPrice + s.price,
                              0
                            ) +
                            checkout.product.reduce(
                              (totalPrice, p) => totalPrice + p.price,
                              0
                            )
                          ).toFixed(2)
                        : checkout.service
                            .reduce((totalPrice, s) => totalPrice + s.price, 0)
                            .toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCheckout(checkout)}
                  className="flex items-center text-blue-500"
                >
                  <MdAttachMoney size={24} className="mr-2" />
                  Checkout
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={pendingAppointments.length}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default BillsSection;

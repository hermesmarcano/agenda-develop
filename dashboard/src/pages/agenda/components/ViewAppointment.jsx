import React, { useContext, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import instance from "../../../axiosConfig/axiosConfig";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const ViewAppointment = ({ setModelState, appointmentId }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("ag_app_shop_token");
  const [dateTime, setDateTime] = useState(new Date());
  const [appointmentData, setAppointmentData] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  useEffect(() => {
    instance
      .get(`appointments/${appointmentId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setAppointmentData(response.data.appointment);
        setDateTime(new Date(response.data.appointment.dateTime));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">
        {t("Appointment Details")}
      </h2>
      {appointmentData ? (
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg p-6 mb-4 overflow-y-auto min-w-[350px] sm:min-w-[500px] mx-auto`}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {t("Customer")}:
            </label>
            <p>{appointmentData.customer.name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {t("Professional")}:
            </label>
            <p>{appointmentData.professional.name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {t("Services")}:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {appointmentData.service.map((service) => (
                <div key={service._id} className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm">{service.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500 font-semibold">
              {new Intl.DateTimeFormat(getCurrentLanguage(), {
                timeStyle: "short",
              }).format(dateTime)}
            </p>
            <p className="text-sm text-gray-500 font-semibold">
              {new Intl.DateTimeFormat(["ban", "id"]).format(dateTime)}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[368px]">
          <div className="flex flex-col items-center space-y-2">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <span className="text-gray-700">{t("Loading...")}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAppointment;

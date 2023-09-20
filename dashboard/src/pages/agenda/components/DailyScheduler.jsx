import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./style.css";
import ProcessAppointment from "./ProcessAppointment";
import Popup from "../../../components/Popup";
import ViewAppointment from "./ViewAppointment";
import UpdateAppointment from "./UpdateAppointment";
import { DateTimeContext } from "../../../context/DateTimeContext";
import { ProfessionalIdContext } from "../../../context/ProfessionalIdContext";
const DailyScheduler = ({
  date,
  onTimeSlotSelect,
  selectedProfessionals,
  workingHours,
  appointmentsList,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { dateTime, setDateTime } = useContext(DateTimeContext);
  const { setProfessionalId } = useContext(ProfessionalIdContext);
  const [modelState, setModelState] = useState(false);
  const [updateModelState, setUpdateModelState] = useState(false);
  const [viewModelState, setViewModelState] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");

  const timeSlotDuration = 15;
  const timeSlotsArray = workingHours.map((item) => {
    const startHour = item.startHour;
    const endHour = item.endHour;

    const startTime = new Date(date);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, 0, 0, 0);

    const timeSlots = [];

    while (startTime < endTime) {
      const currentTime = new Date(startTime);
      timeSlots.push(currentTime);
      startTime.setMinutes(startTime.getMinutes() + timeSlotDuration);
    }

    return timeSlots;
  });

  const startTime = new Date();
  startTime.setHours(8, 0, 0, 0);
  const timeSlots = [];
  for (let i = 0; i < 9; i++) {
    const currentTime = new Date(startTime);
    currentTime.setMinutes(startTime.getMinutes() + i * 15);
    timeSlots.push(currentTime);
  }

  const timeFormat = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleBooking = (time, professionalId, appointment) => {
    const reservationDate = new Date(time);
    setDateTime(reservationDate);
    setProfessionalId(professionalId);

    setSelectedAppointmentId(appointment ? appointment._id : ""); // Store the appointment ID

    !appointment && setModelState(true);
    appointment && setViewModelState(true);
  };

  return (
    <>
      <ProcessAppointment
        isOpen={modelState}
        onClose={() => setModelState(!modelState)}
        setModelState={setModelState}
      />

      <Popup
        isOpen={viewModelState}
        onClose={() => setViewModelState(!viewModelState)}
        children={
          <ViewAppointment
            setModelState={setViewModelState}
            appointmentId={selectedAppointmentId}
          />
        }
      />
      <Popup
        isOpen={updateModelState}
        onClose={() => setUpdateModelState(!updateModelState)}
        children={
          <UpdateAppointment
            setModelState={setUpdateModelState}
            appointmentId={selectedAppointmentId}
          />
        }
      />
      <div
        className={`p-4 overflow-x-auto mt-2 rounded-md shadow ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="text-gray-700">
              <th className="w-16 border-teal-600"></th>
              {selectedProfessionals.map((professional) => (
                <th key={professional._id} className="text-center">
                  {professional.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlotsArray.map((timeSlots, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <tr>
                    <td
                      colSpan={selectedProfessionals.length + 1}
                      className="h-4 border-t border-teal-600 bg-[repeating-linear-gradient(45deg,_var(--tw-gradient-from)_0,_var(--tw-gradient-from)_20px,_var(--tw-gradient-to)_20px,_var(--tw-gradient-to)_40px)] from-gray-400 to-gray-600"
                    ></td>
                  </tr>
                )}
                {timeSlots.map((time) => (
                  <tr key={time.toISOString()}>
                    <td
                      className={`w-16 text-center ${
                        time.getMinutes() === 0 ? "border-t" : ""
                      } border-gray-300 h-7 min-w-135`}
                    >
                      {time.getMinutes() === 0 && timeFormat.format(time)}
                    </td>
                    {selectedProfessionals.map((professional, proIndex) => {
                      let appointmentIndex = 0;

                      const matchingAppointmentsFirstSlot =
                        appointmentsList.filter((appt, apptIndex) => {
                          const isDateTimeMatch =
                            new Date(appt.dateTime).toString() ===
                            time.toString();
                          const isProfessionalIdMatch =
                            appt.professional._id === professional._id;
                          return isDateTimeMatch && isProfessionalIdMatch;
                        });

                      const matchingAppointments = appointmentsList.filter(
                        (appt, apptIndex) => {
                          const apptTime = new Date(appt.dateTime);
                          const apptEndTime = new Date(
                            apptTime.getTime() + appt.duration * 60000
                          );

                          if (
                            apptTime <= time &&
                            apptEndTime >= time &&
                            appt.professional._id === professional._id
                          )
                            appointmentIndex = apptIndex;

                          return (
                            apptTime <= time &&
                            apptEndTime >= time &&
                            appt.professional._id === professional._id
                          );
                        }
                      );

                      return (
                        <td
                          key={`${professional._id}-${time.toISOString()}`}
                          className={`p-0 text-center border ${
                            time.getMinutes() === 0
                              ? "border-t-gray-500 border"
                              : "border-gray-300 "
                          } min-w-[135px]
        ${time <= new Date() ? "stripe-bg" : "hover:bg-gray-100"}
      `}
                          onClick={() =>
                            handleBooking(
                              time,
                              professional._id,
                              matchingAppointments[0]
                            )
                          } // Pass the appointment to the handler
                          disabled={time <= new Date()}
                        >
                          {matchingAppointments.length > 0 && (
                            <div
                              key={index}
                              className={`m-0 ${
                                proIndex % 2 === 0
                                  ? appointmentIndex % 2 === 0
                                    ? "bg-teal-600"
                                    : "bg-slate-700"
                                  : appointmentIndex % 2 === 0
                                  ? "bg-cyan-700"
                                  : "bg-sky-800"
                              } z-10 h-7 px-2 cursor-pointer text-white font-medium text-xs flex items-center justify-start hover:text-gray-500`}
                            >
                              {matchingAppointmentsFirstSlot[0] ? (
                                <>
                                  {matchingAppointmentsFirstSlot[0].blocking &&
                                    matchingAppointmentsFirstSlot[0]
                                      .blockingDuration && (
                                      // Check if blocking is true and blockingDuration is provided
                                      <div className="bg-red-400 text-white p-2 rounded-md">
                                        Blocking Reason:{" "}
                                        {
                                          matchingAppointmentsFirstSlot[0]
                                            .blockingReason
                                        }
                                      </div>
                                    )}
                                  {!matchingAppointmentsFirstSlot[0]
                                    .blocking && (
                                    <>
                                      <span className="font-bold text-white mr-1 whitespace-nowrap">
                                        {matchingAppointments[0].customer.name}
                                      </span>
                                      <span className="text-gray-300">
                                        Services:
                                      </span>
                                      <span className="italic text-white ml-1 truncate">
                                        {matchingAppointments[0]?.service
                                          ?.map((s) => s.name)
                                          .join(", ") || ""}
                                      </span>
                                    </>
                                  )}
                                </>
                              ) : (
                                <div>...</div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DailyScheduler;

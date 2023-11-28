import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./style.css";
import ProcessAppointment from "./ProcessAppointment";
import Popup from "../../../components/Popup";
import ViewAppointment from "./ViewAppointment";
import UpdateAppointment from "./UpdateAppointment";
import { DateTimeContext } from "../../../context/DateTimeContext";
import { ProfessionalIdContext } from "../../../context/ProfessionalIdContext";
import { FaUserCircle } from "react-icons/fa";
import BlockCard from "./BlockCard";
import { useTranslation } from "react-i18next";
const DailyScheduler = ({
  date,
  onTimeSlotSelect,
  selectedProfessionals,
  workingHours,
  workingDays,
  appointmentsList,
  modelState,
  updateModelState,
  viewModelState,
  viewBlockingModelState,
  setModelState,
  setUpdateModelState,
  setViewModelState,
  setViewBlockingModelState,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { dateTime, setDateTime } = useContext(DateTimeContext);
  const { setProfessionalId } = useContext(ProfessionalIdContext);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [blockingPeriod, setBlockingPeriod] = useState(null);

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

  const timeFormat = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleBooking = (
    workingHours,
    time,
    professionalId,
    appointment,
    blockedPeriod
  ) => {
    if (!workingHours) return;

    const currentDay = time.toLocaleString("en-US", { weekday: "long" });
    const isWorkingDay = workingDays.includes(currentDay);

    if(!isWorkingDay) return;

    if (blockedPeriod?.blocking > 0) {
      setBlockingPeriod(blockedPeriod);
      setViewBlockingModelState(true);
      return;
    }
    const reservationDate = new Date(time);
    setDateTime(reservationDate);
    setProfessionalId(professionalId);

    setSelectedAppointmentId(appointment ? appointment._id : "");

    !appointment && setModelState(true);
    if (appointment && time < new Date()) {
      appointment && setViewModelState(true);
    }
    if (appointment && time >= new Date()) {
      appointment && setUpdateModelState(true);
    }
  };

  return (
    <>
      <Popup
        isOpen={viewBlockingModelState}
        onClose={() => setViewBlockingModelState(!viewBlockingModelState)}
        children={<BlockCard blockingPeriod={blockingPeriod} />}
      />
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

      <UpdateAppointment
        isOpen={updateModelState}
        onClose={() => setUpdateModelState(!updateModelState)}
        setModelState={setUpdateModelState}
        appointmentId={selectedAppointmentId}
      />

      <div
        className={`p-4 overflow-x-auto mt-2 rounded-md shadow ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full ">
          <thead>
            <tr>
              <th className="w-16"></th>
              {selectedProfessionals.map((professional) => (
                <th key={professional._id} className="text-center">
                  <div className="flex flex-col justify-center items-center py-2">
                    <FaUserCircle size={30} />
                    <span>{professional.name}</span>
                  </div>
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
                      } border-gray-300 h-7`}
                    >
                      {time.getMinutes() === 0 && timeFormat.format(time)}
                    </td>
                    {selectedProfessionals.map((professional, proIndex) => {
                      let appointmentIndex = 0;

                      const workingHours = professional?.officeHours.filter(
                        (officeHour) => {
                          const professionalStartTime = new Date(time);
                          professionalStartTime.setHours(officeHour.startHour);
                          professionalStartTime.setMinutes(0);
                          const professionalEndTime = new Date(time);
                          professionalEndTime.setHours(officeHour.endHour);
                          professionalEndTime.setMinutes(0);

                          return (
                            professionalStartTime <= time &&
                            professionalEndTime > time
                          );
                        }
                      );

                      const currentDay = time.toLocaleString('en-US', { weekday: 'long' });
                      const isWorkingDay = workingDays.includes(currentDay)

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
                            apptEndTime > time &&
                            appt.professional._id === professional._id
                          );
                        }
                      );

                      const matchingBlockedPeriod = appointmentsList.filter(
                        (appt, apptIndex) => {
                          const apptTime = new Date(appt.dateTime);
                          const apptEndTime = new Date(
                            apptTime.getTime() + appt.blockingDuration * 60000
                          );

                          if (
                            apptTime <= time &&
                            apptEndTime >= time &&
                            appt.professional._id === professional._id
                          )
                            appointmentIndex = apptIndex;

                          return (
                            apptTime <= time &&
                            apptEndTime > time &&
                            appt.professional._id === professional._id
                          );
                        }
                      );

                      return (
                        <td
                          key={`${professional._id}-${time.toISOString()}`}
                          className={`p-0 text-center ${
                            matchingAppointments.length === 0
                              ? "border"
                              : "border-none"
                          } hover:cursor-crosshair ${
                            time.getMinutes() === 0
                              ? "border-t-gray-500 border"
                              : "border-gray-300 "
                          } min-w-[135px] ${
                            time <= new Date() || !workingHours[0] || !isWorkingDay
                              ? "stripe-bg"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            handleBooking(
                              workingHours[0],
                              time,
                              professional._id,
                              matchingAppointments[0],
                              matchingBlockedPeriod[0]
                            )
                          }
                        >
                          {matchingAppointments.length > 0 && (
                            <div
                              key={index}
                              className={`m-0 ${
                                time < new Date() && "opacity-50"
                              } ${
                                matchingBlockedPeriod.length === 0
                                  ? proIndex % 2 === 0
                                    ? appointmentIndex % 2 === 0
                                      ? "bg-teal-600"
                                      : "bg-slate-700"
                                    : appointmentIndex % 2 === 0
                                    ? "bg-cyan-700"
                                    : "bg-sky-800"
                                  : "bg-orange-700"
                              } z-30 h-7 px-2 cursor-pointer text-white font-medium text-xs flex items-center justify-start hover:text-gray-500`}
                            >
                              {matchingAppointmentsFirstSlot[0] ? (
                                <>
                                  {matchingAppointmentsFirstSlot[0].blocking &&
                                    matchingAppointmentsFirstSlot[0]
                                      .blockingDuration && (
                                      <div>
                                        Blocking Reason:{" "}
                                        {matchingAppointmentsFirstSlot[0]
                                          .blockingReason.length > 7
                                          ? matchingAppointmentsFirstSlot[0].blockingReason.slice(
                                              0,
                                              7
                                            ) + "..."
                                          : matchingAppointmentsFirstSlot[0]
                                              .blockingReason}
                                      </div>
                                    )}
                                  {!matchingAppointmentsFirstSlot[0]
                                    .blocking && (
                                    <>
                                      <span className="font-bold text-white mr-1 whitespace-nowrap">
                                        {matchingAppointments[0].customer.name}
                                      </span>
                                      <span className="text-gray-300">
                                        {t("Services")}:
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
                                <div></div>
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

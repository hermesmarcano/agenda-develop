import React, { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./style.css";
import ProcessAppointment from "./ProcessAppointment";
import Popup from "../../../components/Popup";
import ViewAppointment from "./ViewAppointment";
import UpdateAppointment from "./UpdateAppointment";
import { DateTimeContext } from "../../../context/DateTimeContext";
import { ProfessionalIdContext } from "../../../context/ProfessionalIdContext";
import BlockCard from "./BlockCard";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const WeeklyScheduler = ({
  selectedWeekDate,
  onTimeSlotSelect,
  startWeekDate,
  selectedProfessional,
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
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState("");
  const { setDateTime } = useContext(DateTimeContext);
  const { setProfessionalId } = useContext(ProfessionalIdContext);
  const [blockingPeriod, setBlockingPeriod] = React.useState(null);

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const diff =
      startOfWeek.getDate() -
      startOfWeek.getDay() +
      (startOfWeek.getDay() === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const weekDays = Array.from({length: 7}, (_, i) => {
    const day = new Date(getStartOfWeek(selectedWeekDate));
    day.setDate(day.getDate() + i);
    return day;
  });
  console.log(weekDays);

  const timeSlotDuration = 15;
  let options = { weekday: 'long' };
  const today = new Intl.DateTimeFormat('en-US', options).format(selectedWeekDate); 
  const timeSlotsArray = workingHours[today].map((item) => {
    const startHour = item.startHour;
    const endHour = item.endHour;

    const startTime = new Date(selectedWeekDate);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(selectedWeekDate);
    endTime.setHours(endHour, 0, 0, 0);

    const timeSlots = [];

    while (startTime < endTime) {
      const currentTime = new Date(startTime);
      timeSlots.push(currentTime);
      startTime.setMinutes(startTime.getMinutes() + timeSlotDuration);
    }

    return timeSlots;
  });

let professionalWeekTimeSlots = {};

for (let day in selectedProfessional.workingHours) {
  professionalWeekTimeSlots[day] = day !== '_id' && selectedProfessional.workingHours[day].map((item) => {
    const startHour = item.startHour;
    const endHour = item.endHour;

    const startTime = new Date(selectedWeekDate);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(selectedWeekDate);
    endTime.setHours(endHour, 0, 0, 0);

    const timeSlots = [];

    while (startTime < endTime) {
      const currentTime = new Date(startTime);
      timeSlots.push(currentTime);
      startTime.setMinutes(startTime.getMinutes() + timeSlotDuration);
    }

    return timeSlots;
  }).reduce((acc, val) => acc.concat(val), []);
}

  console.log(professionalWeekTimeSlots);

  const timeFormat = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const startDate = new Date(startWeekDate);
  startDate.setHours(0, 0, 0, 0);
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    daysOfWeek.push(currentDate);
  }

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  const handleBooking = (
    workingHours,
    day,
    time,
    appointment,
    blockedPeriod
  ) => {
    if (!workingHours) return;

    if (blockedPeriod?.blocking > 0) {
      setBlockingPeriod(blockedPeriod);
      setViewBlockingModelState(true);
      return;
    }
    if (time < new Date()) return;
    const reservationDate = new Date(day);
    reservationDate.setHours(time.getHours());
    reservationDate.setMinutes(time.getMinutes());
    setDateTime(reservationDate);
    setProfessionalId(selectedProfessional._id);
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
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr>
              <th className="w-16 border-teal-600"></th>
              {daysOfWeek.map((day) => (
                <th key={day.toISOString()} className="text-center px-2 py-2">
                  {day.toLocaleDateString(getCurrentLanguage(), {
                    weekday: "long",
                  })}
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
                      colSpan={daysOfWeek.length + 1}
                      className="h-4 border-t border-teal-600 bg-[repeating-linear-gradient(45deg,_var(--tw-gradient-from)_0,_var(--tw-gradient-from)_20px,_var(--tw-gradient-to)_20px,_var(--tw-gradient-to)_40px)] from-gray-400 to-gray-600"
                    ></td>
                  </tr>
                )}
                {timeSlots.map((time) => (
                  <tr key={time.toISOString()}>
                    <td
                      className={`w-16 text-center ${
                        time.getMinutes() === 0 ? "border-t-2" : ""
                      } border-gray-300 h-7 px-2 min-w-135`}
                    >
                      {time.getMinutes() === 0 && timeFormat.format(time)}
                    </td>
                    {daysOfWeek.map((day, dayIndex) => {
                      let appointmentIndex = 0;
                      const currentTime = new Date(day);
                      currentTime.setHours(time.getHours());
                      currentTime.setMinutes(time.getMinutes());

                      // const workingHours =
                      //   selectedProfessional?.workingHours[today].filter(
                      //     (officeHour) => {
                      //       const professionalStartTime = new Date(currentTime);
                      //       professionalStartTime.setHours(
                      //         officeHour.startHour
                      //       );
                      //       professionalStartTime.setMinutes(0);
                      //       const professionalEndTime = new Date(currentTime);
                      //       professionalEndTime.setHours(officeHour.endHour);
                      //       professionalEndTime.setMinutes(0);

                      //       return (
                      //         professionalStartTime <= currentTime &&
                      //         professionalEndTime > currentTime
                      //       );
                      //     }
                      //   );

                        const currentWeekDay =  new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentTime)

                        const workingHours = professionalWeekTimeSlots[currentWeekDay].find(period => {
                          return period.getTime() === time.getTime();
                        })

                      const matchingAppointmentsFirstSlot =
                        appointmentsList.filter((appt, apptIndex) => {
                          const isDateTimeMatch =
                            new Date(appt.dateTime).toString() ===
                            currentTime.toString();
                          const isProfessionalIdMatch =
                            appt.professional._id === selectedProfessional._id;
                          return isDateTimeMatch && isProfessionalIdMatch;
                        });

                      const matchingAppointments = appointmentsList.filter(
                        (appt, apptIndex) => {
                          const apptTime = new Date(appt.dateTime);
                          const apptEndTime = new Date(
                            apptTime.getTime() + appt.duration * 60000
                          );

                          if (
                            apptTime <= currentTime &&
                            apptEndTime >= currentTime &&
                            appt.professional._id === selectedProfessional._id
                          )
                            appointmentIndex = apptIndex;

                          return (
                            apptTime <= currentTime &&
                            apptEndTime > currentTime &&
                            appt.professional._id === selectedProfessional._id
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
                            apptTime <= currentTime &&
                            apptEndTime > currentTime &&
                            appt.professional._id === selectedProfessional._id
                          )
                            appointmentIndex = apptIndex;

                          return (
                            apptTime <= currentTime &&
                            apptEndTime > currentTime &&
                            appt.professional._id === selectedProfessional._id
                          );
                        }
                      );

                      return (
                        <td
                          key={`${day.toISOString()}-${currentTime.toISOString()}`}
                          className={`p-0 text-center ${
                            matchingAppointments.length === 0
                              ? "border"
                              : "border-none"
                          } hover:cursor-crosshair ${
                            currentTime.getMinutes() === 0
                              ? "border-t-gray-500 border"
                              : "border-gray-300 "
                          } min-w-[135px] ${
                            currentTime <= new Date() ||
                            !workingHours
                              ? "stripe-bg"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            handleBooking(
                              workingHours,
                              day,
                              currentTime,
                              matchingAppointments[0],
                              matchingBlockedPeriod[0]
                            )
                          }
                        >
                          {matchingAppointments.length > 0 && (
                            <div
                              key={index}
                              className={`m-0 ${
                                currentTime < new Date() && "opacity-50"
                              } ${
                                matchingBlockedPeriod.length === 0
                                  ? dayIndex % 2 === 0
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
                                        {t("Blocking Reason")}:{" "}
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

export default WeeklyScheduler;

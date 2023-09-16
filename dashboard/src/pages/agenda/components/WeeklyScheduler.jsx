import React, { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./style.css";
import ProcessAppointment from "./ProcessAppointment";
import Popup from "../../../components/Popup";
import ViewAppointment from "./ViewAppointment";
import UpdateAppointment from "./UpdateAppointment";
import { DateTimeContext } from "../../../context/DateTimeContext";
import { ProfessionalIdContext } from "../../../context/ProfessionalIdContext";

const WeeklyScheduler = ({
  selectedWeekDate,
  onTimeSlotSelect,
  startWeekDate,
  selectedProfessional,
  workingHours,
  appointmentsList
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [modelState, setModelState] = React.useState(false);
  const [updateModelState, setUpdateModelState] = React.useState(false);
  const [viewModelState, setViewModelState] = React.useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState("");
  const { dateTime, setDateTime } = useContext(DateTimeContext);
  const { setProfessionalId } = useContext(ProfessionalIdContext);

  const timeSlotDuration = 15;

  const timeSlotsArray = workingHours.map((item) => {
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

  const handleBooking = (day, time, selectedProfessional) => {
    const reservationDate = new Date(day);
    reservationDate.setHours(time.getHours());
    reservationDate.setMinutes(time.getMinutes());
    setDateTime(reservationDate);
    setProfessionalId(selectedProfessional._id);
    setModelState(true);
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
              {daysOfWeek.map((day) => (
                <th key={day.toISOString()} className="text-center px-2 py-2">
                  {day.toLocaleDateString(undefined, { weekday: "long" })}
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
                    {daysOfWeek.map((day) => (
                      <td
                        key={`${day.toISOString()}-${time.toISOString()}`}
                        className={`text-center ${
                          time.getMinutes() === 0
                            ? "border-t-2 border"
                            : "border"
                        } border-gray-300 px-2 min-w-[135px] ${
                          time <= new Date() ? "stripe-bg" : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          handleBooking(day, time, selectedProfessional)
                        }
                        disabled={time <= new Date()}
                      ></td>
                    ))}
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

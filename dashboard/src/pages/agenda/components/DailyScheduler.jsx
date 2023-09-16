import React, { useContext } from "react";
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
  appointmentsList
}) => {
  console.log(appointmentsList);
  const { isDarkMode } = useContext(DarkModeContext);
  const { dateTime, setDateTime } = useContext(DateTimeContext);
  const { setProfessionalId } = useContext(ProfessionalIdContext);
  const [modelState, setModelState] = React.useState(false);
  const [updateModelState, setUpdateModelState] = React.useState(false);
  const [viewModelState, setViewModelState] = React.useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState("");

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
    appointment && alert(appointment.status)
    setProfessionalId(professionalId)
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
              {selectedProfessionals.map((professional) => (
                <th key={professional._id} className="text-center px-2 py-2">
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
                        time.getMinutes() === 0 ? "border-t-2" : ""
                      } border-gray-300 h-7 px-2 min-w-135`}
                    >
                      {time.getMinutes() === 0 && timeFormat.format(time)}
                    </td>
                    {selectedProfessionals.map((professional) => 
                    {
                      const startDateTime = new Date(time);
                      startDateTime.setMinutes(index * 15);

                      const appointment = appointmentsList.find((appt) => {
                        const isDateTimeMatch =
                          new Date(appt.dateTime).toString() ===
                          startDateTime.toString();
                        const isProfessionalIdMatch =
                          appt.professional._id === professional._id;
                        return isDateTimeMatch && isProfessionalIdMatch;
                      });
                      console.log(appointment);
                      return(
                      <td
                        key={`${professional._id}-${time.toISOString()}`}
                        className={`text-center ${
                          time.getMinutes() === 0
                            ? "border-t-2 border"
                            : "border"
                        } border-gray-300 px-2 min-w-[135px]
                        ${
                          time <= new Date() ? "stripe-bg" : "hover:bg-gray-100"
                        }
                      `}
                        onClick={() => handleBooking(time, professional._id, appointment)}
                        disabled={time <= new Date()}
                      >
                        
                      </td>
                    )
                      }
                    )}
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

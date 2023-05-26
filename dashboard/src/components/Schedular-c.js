import React, { useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SidebarContext from "../context/SidebarContext";
import Popup from "./Popup";
import RegisterAppointment from "./RegisterAppointment";
import ViewAppointment from "./ViewAppointment";
import DateTimeContext from "../context/DateTimeContext";

const schedulerData = [];

const SchedulerC = ({
  date,
  startWeekDate,
  onSelectedDateChange,
  onSelectedWeekDateChange,
  selectedProfessional,
}) => {
  const { shopName } = React.useContext(SidebarContext);
  const { setDateTime } = React.useContext(DateTimeContext);
  const [selectedDate, setSelectedDate] = React.useState(date);
  const [selectedWeekDate, setSelectedWeekDate] = React.useState(startWeekDate);
  const [viewMode, setViewMode] = React.useState("daily");
  const [appointmentsList, setAppointmentsList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [modelState, setModelState] = React.useState(false);
  const [registerModelState, setRegisterModelState] = React.useState(false);
  const [updateModelState, setUpdateModelState] = React.useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState("");
  const token = localStorage.getItem("ag_app_shop_token");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4040/appointments?shopName=${shopName}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      setAppointmentsList(data.appointments);
      console.log(appointmentsList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, [shopName]);

  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  function handleAppointment(hour) {
    const now = new Date();
    const nextAppointment = new Date(hour.getTime() + 30 * 60000);

    if (hour.getTime() < now.getTime()) {
      alert("Sorry, this appointment has passed. Please choose another time.");
    } else if (nextAppointment.getTime() <= now.getTime()) {
      alert(
        "Sorry, you cannot choose this appointment as it is less than 30 minutes from the next appointment."
      );
    } else {
      setDateTime(hour);
      setModelState(true);
    }
  }

  const hoursArr = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      let d = i + 7;
      let d1 = new Date(date);
      d1.setHours(d);
      d1.setMinutes(0);
      d1.setSeconds(0);

      arr.push(d1);
    }
    return arr;
  }, [date]);

  const hoursArrWeek = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      let d = i + 7;
      let d1 = new Date(startWeekDate);
      d1.setHours(d);
      d1.setMinutes(0);
      d1.setSeconds(0);

      arr.push(d1);
    }
    return arr;
  }, [startWeekDate]);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatDateShort = (date) => {
    const options = {
      month: "numeric",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const getDateWithOffset = (startDate, offset) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + offset);
    return date;
  };

  const renderTabs = () => {
    return (
      <div className="flex items-center">
        <div className="w-16">
          <button
            className={`px-2 py-1 text-sm rounded-md ${
              viewMode === "daily" ? "bg-gray-800 text-white" : "text-gray-700"
            }`}
            onClick={() => setViewMode("daily")}
          >
            Daily
          </button>
        </div>
        <div className="w-16">
          <button
            className={`px-2 py-1 text-sm rounded-md ${
              viewMode === "weekly" ? "bg-gray-800 text-white" : "text-gray-700"
            }`}
            onClick={() => setViewMode("weekly")}
          >
            Weekly
          </button>
        </div>
      </div>
    );
  };

  const handlePreviousDate = () => {
    const prevDate = getDateWithOffset(selectedDate, -1);
    setSelectedDate(prevDate);
    onSelectedDateChange(prevDate); // Call the callback function to update the date in the Agenda component
  };

  const handleNextDate = () => {
    const nextDate = getDateWithOffset(selectedDate, 1);
    setSelectedDate(nextDate);
    onSelectedDateChange(nextDate); // Call the callback function to update the date in the Agenda component
  };

  const handlePreviousWeekDate = () => {
    const prevWeekDate = getDateWithOffset(selectedWeekDate, -7);
    setSelectedWeekDate(prevWeekDate);
    onSelectedWeekDateChange(prevWeekDate); // Call the callback function to update the date in the Agenda component
  };

  const handleNextWeekDate = () => {
    const nextWeekDate = getDateWithOffset(selectedWeekDate, 7);
    setSelectedWeekDate(nextWeekDate);
    onSelectedWeekDateChange(nextWeekDate); // Call the callback function to update the date in the Agenda component
  };

  const renderDailyView = () => {
    // Daily view rendering logic
    // You can use the existing renderTimeSlots() function for this
    return renderTimeSlots();
  };

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

  const renderWeeklyView = () => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const startDate = getDateWithOffset(selectedDate, -selectedDate.getDay());

    const weekdaysWithDate = weekdays.map((weekday, index) => {
      const date = getDateWithOffset(startDate, index);
      const formattedDate = formatDateShort(date);
      return {
        day: weekday,
        date: formattedDate,
      };
    });

    const timeSlots = [];

    timeSlots.push(
      <div key="title" className="flex items-center">
        <div className="w-10"></div> {/* Empty space for alignment */}
        {weekdaysWithDate.map(({ day, date }, index) => (
          <div
            className="w-[calc(100%/7)] border-b border-gray-400"
            key={index}
          >
            <h5 className="text-center">{`${day} ${date}`}</h5>
          </div>
        ))}
      </div>
    );

    hoursArr.map((hour, hourIndex) => {
      timeSlots.push(
        <div key={hour} className="flex items-center">
          <div className="w-11 text-center">
            <span className="text-sm">
              {hour.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {weekdaysWithDate.map(({ day, date }, dayIndex) => {
            const startDateTime = new Date(date);
            startDateTime.setHours(hour.getHours());
            startDateTime.setMinutes(hour.getMinutes());

            const appointment = appointmentsList.find(
              (appt) =>
                new Date(appt.dateTime).toString() === startDateTime.toString()
            );

            const isDisabled =
              startDateTime < new Date() ||
              (appointment !== undefined &&
                appointment.dateTime - startDateTime.getTime() < 1800000);

            const customerName = appointment?.customer?.name;
            const professionalName = appointment?.professional?.name;
            const serviceNames =
              appointment?.services
                ?.map((service) => service.name)
                .join(", ") || "";

            return (
              <div className="w-[calc(100%/7)]" key={dayIndex}>
                <div className="flex-grow">
                  <div
                    className={`flex flex-col ${
                      dayIndex !== 6
                        ? "border-l border-gray-400"
                        : "border-x border-gray-400"
                    }`}
                  >
                    {Array.from({ length: 4 }).map((_, index) => {
                      const duration = appointment?.services?.reduce(
                        (totalDuration, service) =>
                          totalDuration + service.duration,
                        0
                      );
                      const endDateTime = new Date(startDateTime);
                      endDateTime.setMinutes(
                        startDateTime.getMinutes() + index * 15 + duration
                      );

                      const overlappingAppointment = appointmentsList.find(
                        (appt) =>
                          new Date(appt.dateTime).getTime() <
                            endDateTime.getTime() &&
                          new Date(appt.dateTime).getTime() +
                            appt.services.reduce(
                              (totalDuration, service) =>
                                totalDuration + service.duration,
                              0
                            ) *
                              60000 >
                            startDateTime.getTime()
                      );

                      if (overlappingAppointment) {
                        return (
                          <div
                            key={index}
                            className={`h-6 bg-red-500 rounded-md p-1 ${
                              index !== 3 &&
                              "border-b border-dotted border-gray-600"
                            } cursor-pointer hover:opacity-80 text-white font-medium text-xs flex items-center justify-center`}
                            onClick={() => {
                              setSelectedAppointmentId(
                                overlappingAppointment._id
                              );
                              setUpdateModelState(true);
                            }}
                            disabled={isDisabled}
                          >
                            <span>Overlapping Appointment</span>
                          </div>
                        );
                      }

                      if (appointment) {
                        return (
                          <div
                            key={index}
                            className={`h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md p-1 ${
                              index !== 3 &&
                              "border-b border-dotted border-gray-600"
                            } cursor-pointer hover:opacity-80 text-white font-medium text-xs flex items-center justify-center`}
                            onClick={() => {
                              setSelectedAppointmentId(appointment._id);
                              setUpdateModelState(true);
                            }}
                            disabled={isDisabled}
                          >
                            <span>{`Reserved for `}</span>
                            <span className="font-bold">{`${customerName}`}</span>
                            <span>{` with `}</span>
                            <span className="font-semibold">
                              {professionalName}
                            </span>
                            <span>{`, Services: `}</span>
                            <span className="italic">{serviceNames}</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={index}
                          className={`h-6 bg-gray-200 p-1 ${
                            index !== 3 &&
                            "border-b border-dotted border-gray-400"
                          } cursor-crosshair hover:bg-gray-300`}
                          onClick={() =>
                            !isDisabled &&
                            !appointment &&
                            handleAppointment(startDateTime)
                          }
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );

      // Add separator between hours
      if (hour.getHours() !== 17) {
        timeSlots.push(
          <div key={`separator-${hour}`} className="h-px bg-gray-400"></div>
        );
      }
    });

    return timeSlots;
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    let prevEndDateTime = null;

    hoursArr.map((hour, hourIndex) => {
      timeSlots.push(
        <div key={hour} className="flex items-center">
          <div className="w-11 text-center">
            <span className="text-sm">
              {hour.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex-grow border-l border-gray-400">
            <div className="flex flex-col">
              {Array.from({ length: 4 }).map((_, index) => {
                const startDateTime = new Date(hour);
                startDateTime.setMinutes(index * 15);

                const appointment = appointmentsList.find(
                  (appt) =>
                    new Date(appt.dateTime).toString() ===
                    startDateTime.toString()
                );

                const isDisabled =
                  startDateTime < new Date() ||
                  (appointment !== undefined &&
                    appointment.dateTime - startDateTime.getTime() < 1800000);

                const customerName = appointment?.customer?.name;
                const professionalName = appointment?.professional?.name;
                const serviceNames =
                  appointment?.service?.map((s) => s.name).join(", ") || "";

                const duration = appointment?.service?.reduce(
                  (totalDuration, s) => totalDuration + s.duration,
                  0
                );

                const endDateTime = new Date(startDateTime);
                endDateTime.setMinutes(startDateTime.getMinutes() + duration);

                // Check if previous endDateTime is greater than the current startTime
                const isPrevEndGreater =
                  prevEndDateTime && prevEndDateTime > startDateTime;

                // Update prevEndDateTime if necessary
                if (endDateTime > prevEndDateTime) {
                  prevEndDateTime = endDateTime;
                }

                // Add condition to set gray background and disable slot
                if (isPrevEndGreater) {
                  return (
                    <div
                      key={index}
                      className={`h-6 bg-gray-800 p-1 
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      cursor-pointer  text-white font-medium text-xs flex items-center justify-center`}
                      disabled={isDisabled}
                    ></div>
                  );
                }

                if (appointment) {
                  return (
                    <div
                      key={index}
                      className={`h-6 bg-gray-800 p-1 cursor-pointer text-white font-medium text-xs flex items-center justify-center hover:text-gray-500 ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        setSelectedAppointmentId(appointment._id);
                        setUpdateModelState(true);
                      }}
                      disabled={isDisabled}
                    >
                      <span className="text-gray-300">Reserved for</span>
                      <span className="font-bold text-white mx-1">
                        {customerName}
                      </span>
                      <span className="text-gray-300">with</span>
                      <span className="font-semibold text-white mx-1">
                        {professionalName}
                      </span>
                      <span className="text-gray-300">Services:</span>
                      <span className="italic text-white ml-1">
                        {serviceNames}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`h-6 bg-gray-200 p-1 ${
                      index !== 3 && "border-b border-dotted border-gray-400"
                    } cursor-crosshair hover:bg-gray-300`}
                    onClick={() =>
                      !isDisabled &&
                      !appointment &&
                      handleAppointment(startDateTime)
                    }
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      );

      // Add separator between hours
      if (hourIndex < hoursArr.length - 1) {
        timeSlots.push(
          <div key={`separator-${hour}`} className="h-px bg-gray-400"></div>
        );
      }
    });

    return timeSlots;
  };

  const renderScheduler = () => {
    return (
      <div className="border  border-gray-400 p-4">
        <div className="flex items-center justify-between">
          {renderTabs()}
          {viewMode === "daily" && (
            <div className="flex items-center">
              <button
                className="px-2 py-1 rounded-md text-sm"
                onClick={handlePreviousDate}
              >
                <IoIosArrowBack />
              </button>
              <h2 className="font-semibold text-sm">
                {formatDate(selectedDate)}
              </h2>
              <button
                className="px-2 py-1 rounded-md text-sm"
                onClick={handleNextDate}
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
          {viewMode === "weekly" && (
            <div className="flex items-center">
              <button
                className="px-2 py-1 rounded-md text-sm"
                onClick={handlePreviousWeekDate}
              >
                <IoIosArrowBack className="inline-block" />
                <IoIosArrowBack className="inline-block" />
              </button>
              <h2 className="font-semibold text-sm">
                {formatDate(selectedWeekDate)}
              </h2>
              <button
                className="px-2 py-1 rounded-md text-sm"
                onClick={handleNextWeekDate}
              >
                <IoIosArrowForward className="inline-block" />
                <IoIosArrowForward className="inline-block" />
              </button>
            </div>
          )}
        </div>

        {viewMode === "daily" && (
          <>
            <div className="h-px bg-gray-500 mt-3 mb-1"></div>
            <div className="grid grid-cols-4 pt-2">
              <div>
                <p className=" text-gray-500">
                  {formatDateShort(selectedDate)}
                </p>
              </div>
              <div className="flex items-center justify-center text-gray-500 col-span-3">
                <FaUserCircle size={30} className="text-gray-400 mr-1" />
                <h1>
                  {selectedProfessional ? selectedProfessional.name : "All"}
                </h1>
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-gray-500 mt-3"></div>

        {viewMode === "daily" ? renderDailyView() : renderWeeklyView()}
        <Popup
          isOpen={modelState}
          onClose={() => setModelState(!modelState)}
          children={<RegisterAppointment setModelState={setModelState} />}
        />

        <Popup
          isOpen={updateModelState}
          onClose={() => setUpdateModelState(!updateModelState)}
          children={
            <ViewAppointment
              setModelState={setUpdateModelState}
              appointmentId={selectedAppointmentId}
            />
          }
        />
      </div>
    );
  };

  return <div>{renderScheduler()}</div>;
};

export default SchedulerC;

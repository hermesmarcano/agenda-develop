import React, { useContext, useState } from "react";
import { FaCalendarDay, FaCalendarWeek } from "react-icons/fa";
import DailyScheduler from "./DailyScheduler";
import WeeklyScheduler from "./WeeklyScheduler";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ViewModeContext } from "../../../context/ViewModeContext";
import { SidebarContext } from "../../../context/SidebarContext";
import instance from "../../../axiosConfig/axiosConfig";

const SchedulerC = ({
  date,
  startWeekDate,
  workingHours,
  onSelectedDateChange,
  onSelectedWeekDateChange,
  selectedProfessional,
  selectedProfessionals,
}) => {
  const { viewMode, setViewMode } = useContext(ViewModeContext);
  const [selectedTime, setSelectedTime] = useState(null);

  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedWeekDate, setSelectedWeekDate] = useState(startWeekDate);

  const [appointmentsList, setAppointmentsList] = useState([]);
  const [appointmentsObject, setAppointmentsObject] = useState(null);

  const [modelState, setModelState] = useState(false);
  const [updateModelState, setUpdateModelState] = useState(false);
  const [viewModelState, setViewModelState] = useState(false);
  const [viewBlockingModelState, setViewBlockingModelState] = useState(false);

  const { shopId } = useContext(SidebarContext);
  const token = localStorage.getItem("ag_app_shop_token");

  const fetchAppointments = async () => {
    try {
      const response = await instance.get(`appointments?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.data;
      setAppointmentsList(data.appointments);
      const appointmentsObject = data.appointments.reduce(
        (acc, appointment) => {
          const professionalId = appointment.professional._id;

          if (!acc[professionalId]) {
            acc[professionalId] = [];
          }

          acc[professionalId].push(appointment);

          return acc;
        },
        {}
      );
      setAppointmentsObject(appointmentsObject);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, [shopId, modelState, updateModelState, viewModelState]);

  const handleViewChange = (view) => {
    setViewMode(view);
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTime(time);
  };

  const getDateWithOffset = (startDate, offset) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + offset);
    return date;
  };

  const handlePreviousDate = () => {
    const prevDate = getDateWithOffset(selectedDate, -1);
    setSelectedDate(prevDate);
    onSelectedDateChange(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = getDateWithOffset(selectedDate, 1);
    setSelectedDate(nextDate);
    onSelectedDateChange(nextDate);
  };

  const handlePreviousWeekDate = () => {
    const prevWeekDate = getDateWithOffset(selectedWeekDate, -7);
    setSelectedWeekDate(prevWeekDate);
    onSelectedWeekDateChange(prevWeekDate);
  };

  const handleNextWeekDate = () => {
    const nextWeekDate = getDateWithOffset(selectedWeekDate, 7);
    setSelectedWeekDate(nextWeekDate);
    onSelectedWeekDateChange(nextWeekDate);
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          {viewMode === "daily" && (
            <div className="flex items-center">
              <button
                className="px-2 py-1 rounded-md text-sm"
                onClick={handlePreviousDate}
              >
                <IoIosArrowBack />
              </button>
              <h2 className="font-semibold text-sm">{formatDate(date)}</h2>
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
                <IoIosArrowBack className="inline-block -mr-2" />
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
                <IoIosArrowForward className="inline-block -ml-2" />
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleViewChange("daily")}
            className={`p-2 rounded ${
              viewMode === "daily"
                ? "bg-teal-600 text-white"
                : ""
            }`}
          >
            <FaCalendarDay className="inline-block mr-2" />
            Daily View
          </button>
          <button
            onClick={() => handleViewChange("weekly")}
            className={`p-2 rounded ${
              viewMode === "weekly"
                ? "bg-teal-600 text-white"
                : ""
            }`}
          >
            <FaCalendarWeek className="inline-block mr-2" />
            Weekly View
          </button>
        </div>
      </div>

      {viewMode === "daily" && (
        <DailyScheduler
          date={date}
          onTimeSlotSelect={handleTimeSlotSelect}
          selectedProfessionals={selectedProfessionals}
          workingHours={workingHours}
          appointmentsList={appointmentsList}
          modelState={modelState}
          updateModelState={updateModelState}
          viewModelState={viewModelState}
          viewBlockingModelState={viewBlockingModelState}
          setModelState={setModelState}
          setUpdateModelState={setUpdateModelState}
          setViewModelState={setViewModelState}
          setViewBlockingModelState={setViewBlockingModelState}
        />
      )}

      {viewMode === "weekly" && (
        <WeeklyScheduler
          selectedWeekDate={selectedWeekDate}
          selectedTime={selectedTime}
          onTimeSlotSelect={handleTimeSlotSelect}
          selectedProfessional={selectedProfessional}
          startWeekDate={startWeekDate}
          workingHours={workingHours}
          appointmentsList={appointmentsList}
          modelState={modelState}
          updateModelState={updateModelState}
          viewModelState={viewModelState}
          viewBlockingModelState={viewBlockingModelState}
          setModelState={setModelState}
          setUpdateModelState={setUpdateModelState}
          setViewModelState={setViewModelState}
          setViewBlockingModelState={setViewBlockingModelState}
        />
      )}
    </>
  );
};
export default SchedulerC;

import i18next from "i18next";
import { useState } from "react";

const DateRangePicker = ({ isDisabled, onDateChange }) => {
  function getCurrentLanguage() {
    return i18next.language || "en"; // Default to English if language is not set
  }
  const dateInputLocale = getCurrentLanguage() === "es" ? "es" : "en";
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateChange({ startDate: date, startTime, endDate, endTime });
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    onDateChange({ startDate, startTime: time, endDate, endTime });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange({ startDate, startTime, endDate: date, endTime });
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    onDateChange({ startDate, startTime, endDate, endTime: time });
  };

  return (
    <div className="flex space-x-4">
      <div className="flex items-center justify-center flex-wrap w-full gap-2">
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="date"
              className="appearance-none block w-36 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              onChange={(e) => handleStartDateChange(e.target.value)}
              disabled={isDisabled}
              locale={dateInputLocale}
            />
          </div>

          <div className="relative">
            <input
              type="time"
              className="appearance-none block w-28 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              onChange={(e) => handleStartTimeChange(e.target.value)}
              disabled={isDisabled}
              locale={dateInputLocale}
            />
          </div>
        </div>
        <span className="font-bold">-</span>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="date"
              className="appearance-none block w-36 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              onChange={(e) => handleEndDateChange(e.target.value)}
              disabled={isDisabled}
              locale={dateInputLocale}
            />
          </div>

          <div className="relative">
            <input
              type="time"
              className="appearance-none block w-28 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              onChange={(e) => handleEndTimeChange(e.target.value)}
              disabled={isDisabled}
              locale={dateInputLocale}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;

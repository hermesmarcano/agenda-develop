import React, { useState, useEffect } from "react";
import CalendarBox from "../../../components/CalendarBox";

const DateSelection = ({ paramsId }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    localStorage.setItem(`dateTime_${paramsId}`, selectedDate);
  }, [selectedDate]);

  const handleDateClick = (day) => {
    const selected = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      day
    );
    setSelectedDate(selected);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <div className="flex justify-center">
        <div className="p-8 flex justify-center">
          <CalendarBox
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleDateClick={handleDateClick}
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelection;

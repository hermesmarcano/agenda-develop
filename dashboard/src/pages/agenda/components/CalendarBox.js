import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const CalendarBox = ({ selectedDate, setSelectedDate, handleDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getMonthName = () => {
    return currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && selectedDate.getDate() === day;
      days.push(
        <div
          key={`day-${day}`}
          className={`flex items-center justify-center h-7 px-3 rounded cursor-pointer text-sm ${
            isSelected ? "bg-teal-100 text-gray-800 font-bold" : "hover:bg-gray-200 text-white hover:text-gray-800"
          }`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full min-w-[210px] min-h-[275px] px-2 py-3 md:w-auto mb-3 md:mb-0 flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center space-x-4">
        <button className="hover:text-gray-700" onClick={handlePrevMonth}>
          <IoChevronBack size={20} />
        </button>
        <h2 className="font-semibold" style={{fontSize: "15px"}}>{getMonthName()}</h2>
        <button className="hover:text-gray-700" onClick={handleNextMonth}>
          <IoChevronForward size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        <div
          className="flex justify-center underline font-bold text-white"
          style={{ fontSize: "0.65rem" }}
        >
          Sun
        </div>
        <div
          className="flex justify-center underline font-bold text-white"
          style={{ fontSize: "0.65rem" }}
        >
          Mon
        </div>
        <div
          className="flex justify-center underline font-bold text-white"
          style={{ fontSize: "0.65rem" }}
        >
          Tue
        </div>
        <div
          className="flex justify-center underline font-bold text-white"
          style={{ fontSize: "0.65rem" }}
        >
          Wed
        </div>
        <div
          className="flex justify-center underline font-bold text-white"
          style={{ fontSize: "0.65rem" }}
        >
          Thu
        </div>
        <div
          className="flex justify-center underline font-bold text-white"
          style={{ fontSize: "0.65rem" }}
        >
          Fri
        </div>
        <div
          className="flex justify-center underline font-bold text-white"
          style={{ fontSize: "0.65rem" }}
        >
          Sat
        </div>
        {renderCalendar()}
      </div>
    </div>
  );
};

export default CalendarBox;

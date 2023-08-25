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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7"></div>);
    }

    // Add day cells for the entire month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && selectedDate.getDate() === day;
      days.push(
        <div
          key={`day-${day}`}
          className={`flex items-center justify-center h-9 px-5 rounded-md cursor-pointer text-lg ${
            isSelected ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
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
    <div className="w-full min-w-[210px] min-h-[275px] px-2 py-3 md:w-auto mb-3 md:mb-0 flex flex-col items-center justify-center space-y-2 rounded-lg shadow-inner bg-gray-100">
      <div className="flex items-center space-x-4">
        <button className="hover:text-gray-700" onClick={handlePrevMonth}>
          <IoChevronBack size={20} />
        </button>
        <h2 className="text-sm font-semibold">{getMonthName()}</h2>
        <button className="hover:text-gray-700" onClick={handleNextMonth}>
          <IoChevronForward size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={`day-${index}`}
            className="flex justify-center font-semibold text-gray-600 text-xs"
          >
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default CalendarBox;

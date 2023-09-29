import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useTranslation } from 'react-i18next'

const CalendarBox = ({ selectedDate, setSelectedDate, handleDateClick }) => {
  const { t } = useTranslation()
  console.log(selectedDate);
  const handlePrevMonth = () => {
    setSelectedDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const getMonthName = () => {
    return selectedDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
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
          className={`flex items-center justify-center m-4 p-2 rounded-full cursor-pointer text-md ${
            isSelected ? "bg-teal-600 text-white" : "hover:bg-gray-100"
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
    <div className="w-full min-w-[210px] min-h-[275px] px-2 py-3 md:w-auto mb-3 md:mb-0 flex flex-col items-center justify-center space-y-2 rounded-lg shadow-inner-lg bg-trasparent">
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
      {[t("Sun"), t("Mon"), t("Tue"), t("Wed"), t("Thu"), t("Fri"), t("Sat")].map((day, index) => (
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

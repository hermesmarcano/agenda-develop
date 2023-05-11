import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const BookingDate = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  console.log(navigate);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected date:", selectedDate);
    localStorage.setItem("selectedDate", selectedDate);
    navigate(`/shops/${params.id}/booking-hour`);
    // Implement logic to check if the selected date has any reserved appointments
    // If there are reserved appointments, handle them accordingly
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-3">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
        Select a Date
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="flex justify-center">
          <div className="p-8 flex justify-center">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              calendarClassName="rounded-lg shadow-md p-4"
              dateFormat="MMMM d, yyyy"
              placeholderText="Select a date"
              isClearable
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={10}
              // fixedHeight
            />
          </div>
        </div>
        {selectedDate && (
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue
          </button>
        )}
      </form>
    </div>
  );
};

export default BookingDate;

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import CalendarBox from "../components/CalendarBox";

const BookingDate = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`selectedDate_${params.id}`, selectedDate);
    navigate(`/shops/${params.id}/booking-hour`);
    // Implement logic to check if the selected date has any reserved appointments
    // If there are reserved appointments, handle them accordingly
  };

  const handleDateClick = (day) => {
    const selected = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      day
    );
    setSelectedDate(selected);
    console.log(selected);
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
            <CalendarBox
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              handleDateClick={handleDateClick}
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
      <div className="mt-4 flex justify-center">
        <Link to={`/shops/${params.id}/booking-professional`}>
          <button className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <BsArrowLeft className="inline-block mr-2" />
            Back to Professional Selection
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BookingDate;

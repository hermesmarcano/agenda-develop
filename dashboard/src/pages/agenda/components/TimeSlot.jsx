import React from 'react';

const TimeSlot = ({ day, time, selectedTime, onTimeSlotSelect }) => {
  const isSelected = selectedTime === time;

  const handleTimeSlotClick = () => {
    onTimeSlotSelect(time);
  };

  return (
    <div
      className={`time-slot p-2 border rounded cursor-pointer ${
        isSelected ? 'bg-teal-600 text-white' : 'bg-white text-gray-800'
      }`}
      onClick={handleTimeSlotClick}
    >
      <p className="mb-2">{time}</p>
      {/* Add more professional-specific information here */}
    </div>
  );
};

export default TimeSlot;

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";
import { FaSpinner } from "react-icons/fa";

const BookingHour = () => {
  const [selectedHour, setSelectedHour] = useState(null);
  const [isHourSelected, setIsHourSelected] = useState(false);
  const [reservedAppt, setReservedAppt] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const params = useParams();
  const navigate = useNavigate();

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
    setIsHourSelected(true);
  };

  useEffect(() => {
    instance
      .get(`/managers/shopname?urlSlug=${params.id}`)
      .then((response) => {
        console.log(response.data);
        instance
          .get(`/appointments?shopName=${response.data.shopName}`)
          .then((response) => {
            const professionalId = JSON.parse(
              localStorage.getItem("professional")
            );
            let apptPro = response.data.appointments.filter((appt) => {
              return appt.professional._id === professionalId._id;
            });

            console.log(apptPro);
            // let apptDates = [];
            // apptPro.map((appt) => {
            //   apptDates.push(new Date(appt.dateTime).toString());
            // });
            setReservedAppt(apptPro);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const date = localStorage.getItem("selectedDate");
  const hours = useMemo(() => {
    const arr = [];
    let startHour = 8; // Starting hour
    let startMinute = 0; // Starting minute

    while (startHour < 17 || (startHour === 17 && startMinute === 0)) {
      let d1 = new Date(date);
      d1.setHours(startHour);
      d1.setMinutes(startMinute);
      arr.push(d1);

      startMinute += 15; // Increase the minute by 15

      if (startMinute === 60) {
        // If the minute reaches 60, reset it to 0 and increase the hour
        startMinute = 0;
        startHour++;
      }
    }

    return arr;
  }, [date]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Hour selected: ${selectedHour}`);
    const selectedDate = localStorage.getItem("selectedDate");
    const d = new Date(selectedDate);

    localStorage.setItem("dateTime", selectedHour);
    navigate(`/shops/${params.id}/buy-product`);
  };

  const isHourDisabled = (hour) => {
    if (reservedAppt.length === 0) return false;
    const selectedDate = new Date(hour);

    for (let i = 0; i < reservedAppt.length; i++) {
      const apptStart = new Date(reservedAppt[i].dateTime);
      const apptEnd = new Date(apptStart);
      apptEnd.setMinutes(
        apptEnd.getMinutes() +
          (reservedAppt[i].blocking
            ? reservedAppt[i].blockingDuration
            : reservedAppt[i].service.reduce(
                (sum, service) => sum + service.duration,
                0
              ))
      );
      // duration is in minutes
      if (selectedDate >= apptStart && selectedDate <= apptEnd) {
        // if (new Date(hour) >= apptStart && new Date(hour) <= apptEnd) {
        return true;
        // }
      }
    }

    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="mt-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6 overflow-y-auto">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
        Select an Hour
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {hours.map((hour, index) => {
            const today = new Date();

            return (
              <button
                key={index}
                type="button"
                className={`${
                  selectedHour === hour ? "ring-2 ring-indigo-500" : ""
                } bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 border rounded-lg text-center text-xl ${
                  isHourDisabled(hour) || hour < new Date()
                    ? "line-through"
                    : ""
                }`}
                onClick={() => {
                  handleHourChange({ target: { value: hour } });
                }}
                disabled={isHourDisabled(hour) || hour < new Date()}
              >
                {hour.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            );
          })}
        </div>
        {isHourSelected && (
          <div className="flex flex-col items-center justify-center mt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Book Now!
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingHour;

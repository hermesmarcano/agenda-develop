import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";
import { FaSpinner } from "react-icons/fa";

const BookingHour = () => {
  const [selectedHour, setSelectedHour] = useState(null);
  const [isHourSelected, setIsHourSelected] = useState(false);
  const [reservedAppts, setReservedAppts] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const params = useParams();
  const navigate = useNavigate();

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
    setIsHourSelected(true);
  };

  useEffect(() => {
    instance
      .get(`/managers/shop?urlSlug=${params.id}`)
      .then((response) => {
        instance
          .get(`/appointments?shop=${response.data._id}`)
          .then((response) => {
            const professionalId = JSON.parse(
              localStorage.getItem("professional")
            );
            let apptPro = response.data.appointments.filter((appt) => {
              return appt.professional._id === professionalId._id;
            });

            // let apptDates = [];
            // apptPro.map((appt) => {
            //   apptDates.push(new Date(appt.dateTime).toString());
            // });

            const today = new Date().toISOString().slice(0, 10);
            const filteredAppts = apptPro.filter(
              (appt) =>
                new Date(appt.dateTime).toISOString().slice(0, 10) === today
            );
            console.log(filteredAppts);
            setReservedAppts(filteredAppts);
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
    // console.log(`Hour selected: ${selectedHour}`);
    const selectedDate = localStorage.getItem("selectedDate");
    const d = new Date(selectedDate);

    localStorage.setItem("dateTime", selectedHour);
    navigate(`/shops/${params.id}/buy-product`);
  };

  const isHourDisabled = (hour) => {
    for (let i = 0; i < reservedAppts.length; i++) {
      const appointment = reservedAppts[i];
      const appointmentTime = new Date(appointment.dateTime);
      const appointmentEndTime = new Date(appointment.dateTime);
      let minutes;
      if (appointment.duration) {
        minutes = appointmentEndTime.getMinutes() + appointment.duration;
      } else {
        minutes = appointment?.service?.reduce(
          (totalDuration, s) => totalDuration + s.duration,
          0
        );
      }

      appointmentEndTime.setMinutes(minutes);

      if (
        hour.toLocaleTimeString() >= appointmentTime.toLocaleTimeString() &&
        hour.toLocaleTimeString() <= appointmentEndTime.toLocaleTimeString()
      ) {
        return true;
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

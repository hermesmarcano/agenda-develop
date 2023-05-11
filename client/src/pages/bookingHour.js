import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";

const BookingHour = () => {
  const [selectedHour, setSelectedHour] = useState(null);
  const [isHourSelected, setIsHourSelected] = useState(false);
  const [reservedAppt, setReservedAppt] = useState([]);
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
        // setShopName(response.data.shopName);
        instance
          .get(`/appointments?shopName=${response.data.shopName}`)
          .then((response) => {
            let apptDates = [];
            response.data.appointments.map((appt) => {
              apptDates.push(new Date(appt.dateTime));
            });
            setReservedAppt(apptDates);
            console.log(apptDates);
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
    for (let i = 1; i <= 9; i++) {
      let d = i + 8;
      let d1 = new Date(date);
      d1.setHours(d);
      d1.setMinutes(0);
      d1.setSeconds(0);
      let d2 = new Date(d1);
      d2.setMinutes(30);

      if (i === 9) {
        arr.push(d1);
      } else {
        arr.push(d1, d2);
      }
    }
    return arr;
  }, [date]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Hour selected: ${selectedHour}`);
    const selectedDate = localStorage.getItem("selectedDate");
    const d = new Date(selectedDate);

    // const timeArr = selectedHour.split(":");
    // d.setHours(+timeArr[0]);
    // d.setMinutes(+timeArr[1]);
    localStorage.setItem("dateTime", selectedHour);
    navigate(`/shops/${params.id}/buy-product`);
    // Implement booking logic here
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
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
                } bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 border rounded-lg text-center text-xl`}
                onClick={() => handleHourChange({ target: { value: hour } })}
                disabled={hour < today || reservedAppt.includes(hour)}
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

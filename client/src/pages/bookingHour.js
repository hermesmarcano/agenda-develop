import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";
import { FaSpinner } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";

const BookingHour = () => {
  const [selectedHour, setSelectedHour] = useState(null);
  const [isHourSelected, setIsHourSelected] = useState(false);
  const [reservedAppts, setReservedAppts] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
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
        console.log(response.data.workingHours);
        setWorkingHours(response.data.workingHours);
        instance
          .get(`/appointments?shop=${response.data._id}`)
          .then((response) => {
            const professionalId = JSON.parse(
              localStorage.getItem(`professional_${params.id}`)
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
            // console.log(filteredAppts);
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

  const date = localStorage.getItem(`selectedDate_${params.id}`);

  const hoursArrs = useMemo(() => {
    const arr = [];
    if (workingHours && workingHours.length > 0) {
      for (let i = 0; i < workingHours.length; i++) {
        const range = [];
        const { startHour, endHour } = workingHours[i];
        for (let hour = startHour; hour <= endHour; hour++) {
          const maxMinute = hour === endHour ? 0 : 45; // Maximum minutes allowed for the last hour
          for (let minute = 0; minute <= maxMinute; minute += 15) {
            let d = hour;
            let d1 = new Date(date);
            d1.setHours(d);
            d1.setMinutes(minute);
            d1.setSeconds(0);

            range.push(d1);
          }
        }
        arr.push(range);
      }
    } else {
      const range = [];
      for (let i = 1; i <= 10; i++) {
        for (let minute = 0; minute < 60; minute += 15) {
          let d = i + 7;
          let d1 = new Date(date);
          d1.setHours(d);
          d1.setMinutes(minute);
          d1.setSeconds(0);

          range.push(d1);
        }
      }
      arr.push(range);
    }
    return arr;
  }, [date, workingHours]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(`Hour selected: ${selectedHour}`);
    const selectedDate = localStorage.getItem(`selectedDate_${params.id}`);
    const d = new Date(selectedDate);

    localStorage.setItem(`dateTime_${params.id}`, selectedHour);
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

  const renderHoursBlocks = (hoursRange) => {
    return hoursRange.map((hour, index) => {
      return (
        <button
          key={index}
          type="button"
          className={`${
            selectedHour === hour ? "ring-2 ring-indigo-500" : ""
          } bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 border rounded-lg text-center text-xl ${
            isHourDisabled(hour) || hour < new Date() ? "line-through" : ""
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
    });
  };

  const renderDivider = () => {
    return (
      <div className="flex items-center justify-center my-4">
        <hr className="border-gray-300 flex-grow" />
        {/* <span className="mx-4 text-gray-300">OR</span>
        <hr className="border-gray-300 flex-grow" /> */}
      </div>
    );
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
        {hoursArrs.map((hoursRange, i) => (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              <React.Fragment key={i}>
                {renderHoursBlocks(hoursRange)}
              </React.Fragment>
            </div>
            {i !== hoursArrs.length - 1 && renderDivider()}
          </>
        ))}
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
      <div className="mt-4 flex justify-center">
        <Link to={`/shops/${params.id}/booking-date`}>
          <button className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <BsArrowLeft className="inline-block mr-2" />
            Back to Date Selection
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BookingHour;

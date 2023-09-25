import React, { useEffect, useMemo, useState } from "react";
import instance from "../../../axiosConfig/axiosConfig";
import { FaSpinner } from "react-icons/fa";
import { Transition } from "@headlessui/react";

const HourSelection = ({ paramsId }) => {
  const [selectedHour, setSelectedHour] = useState(
    new Date(localStorage.getItem(`dateTime_${paramsId}`))
  );
  const [reservedAppts, setReservedAppts] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem(`dateTime_${paramsId}`, selectedHour);
  }, [selectedHour]);

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  useEffect(() => {
    instance
      .get(`/managers/shop?urlSlug=${paramsId}`)
      .then((response) => {
        console.log(response.data.workingHours);
        setWorkingHours(response.data.workingHours);
        instance
          .get(`/appointments?shop=${response.data._id}`)
          .then((response) => {
            const professionalId = JSON.parse(
              localStorage.getItem(`professional_${paramsId}`)
            );
            let apptPro = response.data.appointments.filter((appt) => {
              return appt.professional._id === professionalId._id;
            });

            const today = new Date().toISOString().slice(0, 10);
            const filteredAppts = apptPro.filter(
              (appt) =>
                new Date(appt.dateTime).toISOString().slice(0, 10) === today
            );
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

  const date = localStorage.getItem(`dateTime_${paramsId}`);

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

  const renderHoursBlocks = (hoursRange, i) => {
    const workingStartingHours = new Date();
    workingStartingHours.setHours(workingHours[i].startHour);
    workingStartingHours.setMinutes(0);
    const workingStartingHoursFormated =
      workingStartingHours.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    const workingEndingHours = new Date();
    workingEndingHours.setHours(workingHours[i].endHour);
    workingEndingHours.setMinutes(0);
    const workingEndingHoursFormated = workingEndingHours.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    return (
      <>
        <Transition
          show={isOpen}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Accordion>
            <AccordionItem>
              <div>
                {workingStartingHoursFormated} - {workingEndingHoursFormated}
              </div>
              {hoursRange.map((hour, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    className={`px-2 py-3 gap-2 w-[100px] font-semibold text-center cursor-pointer ${
                      selectedHour === hour
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 shadow-inner hover:bg-gray-200"
                    } ${
                      isHourDisabled(hour) || hour < new Date()
                        ? "line-through"
                        : ""
                    }`}
                    onClick={() => {
                      handleHourChange({ target: { value: hour } });
                      setIsOpen(false);
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
            </AccordionItem>
          </Accordion>
        </Transition>
      </>
    );
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
    <div className="flex flex-col items-center justify-center">
      {hoursArrs.map((hoursRange, i) => (
        <div className="w-full">
          <React.Fragment key={i}>
            {renderHoursBlocks(hoursRange, i)}
          </React.Fragment>
        </div>
      ))}
      <Transition
        show={!isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mt-4 flex justify-center">
          <p className="border-2 border-teal-600 rounded-md text-center px-2 py-3">
            <span className="font-semibold text-4xl">
              {new Intl.DateTimeFormat("en", {
                timeStyle: "short",
                hour12: true,
              }).format(selectedHour)}
            </span>
          </p>
        </div>
      </Transition>
    </div>
  );
};

export default HourSelection;

const Accordion = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

const AccordionItem = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full rounded-lg shadow-md bg-gray-100 mb-4">
      <div className="p-4">
        <button
          onClick={toggleExpansion}
          className="w-full p-0 border-none outline-none text-left cursor-pointer flex items-center"
        >
          {expanded ? (
            <span className="mr-2">▼</span>
          ) : (
            <span className="mr-2">►</span>
          )}
          {children[0]}
        </button>
      </div>
      <div className={`p-4 ${expanded ? "block" : "hidden"}`}>
        {children[1]}
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from "react";
import instance from "../../../axiosConfig/axiosConfig";
import { FaSpinner, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FiClock, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const HourSelection = ({ paramsId, setHasSelectedHour }) => {
  const { t } = useTranslation();
  const [selectedHour, setSelectedHour] = useState(
    new Date(localStorage.getItem(`dateTime_${paramsId}`))
  );
  const [reservedAppts, setReservedAppts] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(true);
  const selectedProfessional = JSON.parse(
    localStorage.getItem(`professional_${paramsId}`)
  );

  console.log(selectedProfessional.officeHours);

  useEffect(() => {
    localStorage.setItem(`dateTime_${paramsId}`, selectedHour);
  }, [selectedHour]);

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
    setHasSelectedHour(event.target.value !== null);
    setShowCard(true);
  };

  useEffect(() => {
    instance
      .get(`/managers/shop?urlSlug=${paramsId}`)
      .then((response) => {
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
          const maxMinute = hour === endHour ? 0 : 45;
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

  const selectedProfessionalWorkingHours = (hour) => {
    const professionalStartTime = new Date(hour);
    const professionalEndTime = new Date(hour);
    selectedProfessional?.officeHours.find((officeHour) => {
      professionalStartTime.setHours(officeHour.startHour);
      professionalStartTime.setMinutes(0);
      professionalEndTime.setHours(officeHour.endHour);
      professionalEndTime.setMinutes(0);
    });
    return professionalStartTime <= hour && professionalEndTime > hour;
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
          <span className="mt-2">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!showCard ? (
        <div className="h-[540px] flex">
          {hoursArrs.map((hoursRange, index) => (
            <div key={index} className="mr-1 h-full">
              <AccordionItem
                hoursRange={hoursRange}
                isHourDisabled={isHourDisabled}
                selectedHour={selectedHour}
                handleHourChange={handleHourChange}
                selectedProfessionalWorkingHours={
                  selectedProfessionalWorkingHours
                }
                index={index}
              />
            </div>
          ))}
        </div>
      ) : (
        <DateTimeCard date={selectedHour} setShowCard={setShowCard} />
      )}
    </>
  );
};

const AccordionItem = ({
  hoursRange,
  isHourDisabled,
  selectedHour,
  handleHourChange,
  selectedProfessionalWorkingHours,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 flex h-full">
      <div
        onClick={toggleAccordion}
        className={`cursor-pointer h-full w-[80px] flex justify-center items-center rounded-lg ${
          isOpen
            ? "bg-gray-100 shadow-md"
            : "bg-teal-600 text-gray-100 shadow-sm"
        }`}
      >
        <span className="transform -rotate-90">Working Hours {index + 1}</span>
        {isOpen ? (
          <FaChevronRight className="mr-2" />
        ) : (
          <FaChevronLeft className="mr-2" />
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 max-h-[540px] overflow-auto no-scrollbar flex justify-center flex-wrap">
              {hoursRange.map((hour, index) => {
                const proNonBlokedHours =
                  selectedProfessionalWorkingHours(hour);
                return (
                  <button
                    key={index}
                    type="button"
                    className={`px-2 py-3 gap-2 w-[100px] font-semibold text-center cursor-pointer ${
                      selectedHour === hour
                        ? "bg-teal-600 text-white"
                        : "bg-white shadow-inner hover:bg-gray-200"
                    } ${
                      isHourDisabled(hour) || hour < new Date() || !proNonBlokedHours
                        ? "line-through"
                        : ""
                    }`}
                    onClick={() => {
                      handleHourChange({ target: { value: hour } });
                    }}
                    disabled={isHourDisabled(hour) || hour < new Date() || !proNonBlokedHours}
                  >
                    {hour.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DateTimeCard = ({ date, setShowCard }) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  return (
    <div className="bg-teal-600 rounded-lg shadow-md p-4 relative">
      <button
        className="absolute top-0 right-0 p-2 text-gray-300 hover:text-red-500"
        onClick={() => setShowCard(false)}
      >
        <FiX />
      </button>
      <div className="text-3xl font-semibold mb-4">
        <FiClock className="inline-block mr-2" />
        {formattedTime}
      </div>
      <div className="text-gray-300">{formattedDate}</div>
    </div>
  );
};

export default HourSelection;

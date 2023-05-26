import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import Schedular from "../components/Schedular";
import SchedularC from "../components/Schedular-c";
import "react-calendar/dist/Calendar.css";
import ArrowLeftSrc from "../images/arrow-left.svg";
import ArrowRightSrc from "../images/arrow-right.svg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FcPrevious, FcNext } from "react-icons/fc";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SidebarContext from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Agenda = () => {
  const { isSidebarOpen, toggleSidebar, shopName } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const diff =
      startOfWeek.getDate() -
      startOfWeek.getDay() +
      (startOfWeek.getDay() === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };
  const [startWeekDate, setStartWeekDate] = useState(getStartOfWeek(date));
  const token = localStorage.getItem("ag_app_shop_token");
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [myShopImg, setMyShopImg] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4040/appointments?shopName=${shopName}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => response.json())

      .then((data) => {
        setAppointments(data.appointments);
        console.log(data.appointments);
      });
  }, [shopName]);

  useEffect(() => {
    axios
      .get("http://localhost:4040/managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setMyShopImg(response.data.profileImg);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:4040/professionals/shopname?shopName=${shopName}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => setProfessionals([...response.data.data].reverse()))
      .catch((error) => console.error(error.message));
  }, []);

  const handleProfessionalChange = (event) => {
    const selectedProfessionalId = event.target.value;
    const selectedProfessionalObject = professionals.find(
      (professional) => professional._id === selectedProfessionalId
    );
    setSelectedProfessional(selectedProfessionalObject);
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  function handleDateClick(date) {
    // console.log(date);
    setDate(date);
  }

  const handleSelectedDateChange = (date) => {
    setDate(date);
  };

  const handleSelectedWeekDateChange = (date) => {
    setStartWeekDate(date);
  };

  const [modelState, setModelState] = useState(false);

  return (
    <div className="flex mx-auto px-2 mt-2 pb-2">
      <div className="flex flex-col flex-wrap md:flex-nowrap mr-2 mb-4 w-52">
        <div className="md:hidden bg-gray-100 p-4 flex items-center mb-3 md:ml-3 mt-2">
          <img
            className="h-11 w-11 rounded-full object-cover mr-2 mb-2 md:mb-0 md:mr-3 md:w-20 md:h-20"
            src={`http://localhost:4040/uploads/profile/${myShopImg}`}
            alt="Shop logo"
          />
          <h1 className="text-lg font-bold">{`${shopName}`}</h1>
        </div>
        <div className="w-full md:w-auto mb-3 md:mb-0 ">
          <Calendar
            value={date}
            onChange={handleDateClick}
            className="border-none text-xs p-2"
            locale="en"
            next2Label={null}
            prev2Label={null}
            prevLabel={<ArrowLeft />}
            nextLabel={<ArrowRight />}
          />
        </div>
        <div className="hidden md:flex justify-center items-center border border-gray-400 p-4 mt-3">
          <img
            className="h-11 w-11 rounded-full object-cover mr-2 mb-2 md:mb-0 md:mr-3 md:w-20 md:h-20"
            src={`http://localhost:4040/uploads/profile/${myShopImg}`}
            alt="Shop logo"
          />
          {/* <h1 className="text-base font-bold">{`Welcome to ${shopName}`}</h1> */}
        </div>
        <div className="hidden md:flex md:flex-col md:jsutify-center md:items-start border border-gray-400 p-4 mt-3">
          <label className="mb-1">Select Professional</label>
          <select
            className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            value={selectedProfessional ? selectedProfessional._id : ""}
            onChange={handleProfessionalChange}
          >
            <option disabled value="">
              Select professional
            </option>
            {professionals.map((professional) => (
              <option key={professional._id} value={professional._id}>
                {professional.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full pb-3">
        <SchedularC
          startWeekDate={startWeekDate}
          date={date}
          onSelectedDateChange={handleSelectedDateChange}
          onSelectedWeekDateChange={handleSelectedWeekDateChange}
          selectedProfessional={selectedProfessional}
        />
      </div>
    </div>
  );
};

export default Agenda;

const ArrowLeft = () => {
  return (
    <div className="flex justify-center items-center">
      <img src={ArrowLeftSrc} />
    </div>
  );
};

const ArrowRight = () => {
  return (
    <div className="flex justify-center items-center">
      <img src={ArrowRightSrc} />
    </div>
  );
};

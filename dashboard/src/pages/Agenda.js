import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import Schedular from "../components/Schedular";
import "react-calendar/dist/Calendar.css";
import ArrowLeftSrc from "../images/arrow-left.svg";
import ArrowRightSrc from "../images/arrow-right.svg";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SidebarContext from "../context/SidebarContext";

const Agenda = () => {
  const { isSidebarOpen, toggleSidebar, shopName } = useContext(SidebarContext);
  const [date, setDate] = useState(new Date());
  const token = localStorage.getItem("ag_app_shop_token");
  const [appointments, setAppointments] = useState([]);
  const [myShopImg, setMyShopImg] = useState("");
  useEffect(() => {
    fetch(`http://localhost:4040/appointments?shopName=${shopName}`, {
      method: "GET",
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
    fetch(`http://localhost:4040/managers/shopImg?shopName=${shopName}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())

      .then((data) => {
        setMyShopImg(data);
        console.log(data);
      });
  }, [shopName]);

  // const appointments = [
  //   { id: 1, title: "Appointment 1", date: new Date(2023, 3, 2, 14, 0) },
  //   { id: 2, title: "Appointment 2", date: new Date(2023, 3, 4, 10, 0) },
  //   { id: 3, title: "Appointment 3", date: new Date(2023, 3, 7, 15, 30) },
  // ];

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

  const [modelState, setModelState] = useState(false);

  return (
    <div className="container mx-auto px-2 mt-2 pb-2">
      <div className="flex flex-wrap md:flex-nowrap justify-center items-center mb-4">
        <div className="flex md:hidden bg-gray-100 p-4 rounded-lg mb-3 md:ml-3 md:flex-grow-0 md:w-1/3 w-full">
          <img
            className="h-12 w-12 rounded-full object-cover mr-2 mb-2 md:mb-0 md:mr-3 md:w-20 md:h-20"
            src={`http://localhost:4040/uploads/profile/${myShopImg}`}
            alt="Shop logo"
          />
          <h1 className="text-lg font-bold">{`Welcome to ${shopName}`}</h1>
        </div>
        <div className="w-full md:w-auto mb-3 md:mb-0 md:pr-3 md:border-r md:border-gray-300">
          <Calendar
            value={date}
            onChange={handleDateClick}
            className="border-none shadow-lg rounded-lg p-4 text-xs"
            locale="en"
            next2Label={null}
            prev2Label={null}
            prevLabel={<ArrowLeft />}
            nextLabel={<ArrowRight />}
          />
        </div>
        <div className="hidden md:flex bg-gray-100 p-4 rounded-lg md:ml-3 md:flex-grow-0 md:w-1/3 w-full">
          <img
            className="h-12 w-12 rounded-full object-cover mr-2 mb-2 md:mb-0 md:mr-3 md:w-20 md:h-20"
            src={`http://localhost:4040/uploads/profile/${myShopImg}`}
            alt="Shop logo"
          />
          <h1 className="text-lg font-bold">{`Welcome to ${shopName}`}</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className="col-span-1 lg:col-span-2">
          <Schedular date={date} />
        </div>
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

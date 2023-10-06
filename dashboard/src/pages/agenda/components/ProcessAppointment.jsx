import React, { useContext, useEffect, useState } from "react";
import BlockSchedule from "./BlockSchedule";
import RegisterAppointment from "./RegisterAppointment";
import instance from "../../../axiosConfig/axiosConfig";
import { SidebarContext } from "../../../context/SidebarContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useTranslation } from "react-i18next";

const ProcessAppointment = ({ isOpen, onClose, setModelState }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState("appointment");
  const [bookingInfo, setBookingInfo] = useState({});
  const [amount, setAmount] = useState(0);
  const [clients, setClients] = useState([]);
  const [addCustomerClicked, setAddCustomerClicked] = useState(false);
  const { shopId } = useContext(SidebarContext);
  const token = localStorage.getItem("ag_app_shop_token");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    instance
      .get(`customers/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [shopId]);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed z-10 inset-0 overflow-y-auto max-w-[950px] mx-auto`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 opacity-75"
              onClick={onClose}
            ></div>
            <div
              className={`rounded-lg overflow-hidden shadow-xl relative w-11/12 md:w-1/2 lg:w-2/3  ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <button
                className="absolute top-0 right-0 m-3 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={onClose}
              >
                <svg
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="heroicon-ui"
                    d="M6.7 6.7a1 1 0 011.4 0L12 10.6l3.9-3.9a1 1 0 111.4 1.4L13.4 12l3.9 3.9a1 1 0 01-1.4 1.4L12 13.4l-3.9 3.9a1 1 0 01-1.4-1.4L10.6 12 6.7 8.1a1 1 0 010-1.4z"
                  />
                </svg>
              </button>
              <div>
                <>
                  {amount === 0 && (
                    <>
                      <div>
                        <div className="flex">
                          <div
                            className={`px-4 py-2 cursor-pointer ${
                              activeTab === "appointment"
                                ? "bg-teal-600 text-white shadow-inner"
                                : ""
                            }`}
                            onClick={() => handleTabChange("appointment")}
                          >
                            {t("New Appointment")}
                          </div>
                          <div
                            className={`px-4 py-2 cursor-pointer ${
                              activeTab === "blockSchedule"
                                ? "bg-teal-600 text-white shadow-inner"
                                : ""
                            }`}
                            onClick={() => handleTabChange("blockSchedule")}
                          >
                            {t("Block Schedule")}
                          </div>
                        </div>
                        {activeTab === "appointment" ? (
                          <>
                            <RegisterAppointment
                              amount={amount}
                              clients={clients}
                              bookingInfo={bookingInfo}
                              setClients={setClients}
                              setAmount={setAmount}
                              setBookingInfo={setBookingInfo}
                              addCustomerClicked={addCustomerClicked}
                              setAddCustomerClicked={setAddCustomerClicked}
                              setModelState={setModelState}
                            />
                          </>
                        ) : (
                          <>
                            <BlockSchedule setModelState={setModelState} />
                          </>
                        )}
                      </div>
                    </>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessAppointment;

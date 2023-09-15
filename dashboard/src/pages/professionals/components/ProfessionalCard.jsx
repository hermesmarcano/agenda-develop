import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { FaEdit, FaUser } from "react-icons/fa";

const ProfessionalCard = ({
    professional,
    selectedIds,
    setUpdateModelState,
    setSelectiedProfessionalId,
  }) => {
    const { isDarkMode } = useContext(DarkModeContext);
    return (
      <div
        className={`w-64 h-64 border-b-4 border-teal-500 ${
          selectedIds.includes(professional._id) 
          ? 
          isDarkMode ? "bg-teal-600" : "bg-teal-100" 
          : 
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-md text-center rounded-lg p-4 mb-4 hover:shadow-lg`}
      >
        <div className="flex justify-end items-center">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              setUpdateModelState(true);
              setSelectiedProfessionalId(professional._id);
            }}
          >
            <FaEdit />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="rounded-full bg-gray-100 p-2">
            <FaUser className="text-gray-500" size={30} />
          </div>
          <h2 className="text-lg ml-2 font-semibold text-center">
            {professional.name}
          </h2>
        </div>
        <div className="mt-2">
          <div className="mb-2">
            <strong>Office Hours:</strong>
            {professional.officeHours &&
              professional.officeHours?.length > 0 &&
              professional.officeHours?.map((officeHour) => {
                return (
                  <p key={officeHour._id}>
                    {new Intl.DateTimeFormat("en", {
                      timeStyle: "short",
                    }).format(new Date().setHours(officeHour?.startHour, 0)) +
                      " - " +
                      new Intl.DateTimeFormat("en", {
                        timeStyle: "short",
                      }).format(new Date().setHours(officeHour?.endHour, 0))}
                  </p>
                );
              })}
          </div>
          <div className="mb-2">
            <strong>Description:</strong>
            <p className="text-xs">{professional.description}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfessionalCard
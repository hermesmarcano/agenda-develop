import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { FaEdit, FaUser } from "react-icons/fa";

const CustomerCard = ({
    customer,
    selectedIds,
    setUpdateModelState,
    setSelectiedCustomerId,
  }) => {
    const { isDarkMode } = useContext(DarkModeContext);
    return (
      <div
        className={`w-64 h-64 border-b-4 border-teal-500 ${
          selectedIds.includes(customer._id) 
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
              setSelectiedCustomerId(customer._id);
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
            {customer.name}
          </h2>
        </div>
        <div className="mt-2">
          <div className="mb-2">
            <strong><p>{customer.phone}</p></strong>
          </div>
           <div className="mb-2">
            {customer?.email && <span className="text-xs">{customer.email}</span>}
          {customer.birthday && <> - <span className="text-xs">{new Intl.DateTimeFormat('en-US').format(new Date(customer.birthday))}</span></>}
          {customer.address && <> - <span className="text-xs">{customer.address}</span></>}
          </div>
           
 
        </div>
      </div>
    );
  };
  
  export default CustomerCard
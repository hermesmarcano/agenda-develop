import React, { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";

const NotificationItem = ({ notification, onDelete }) => {
  const { _id, content, date } = notification;
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-700" : "bg-white"
      } p-4 shadow-md rounded-md mb-4`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold">{content}</p>
        {/* <p className="text-gray-500 text-sm">{date}</p> */}

        <button
          onClick={onDelete}
          className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;

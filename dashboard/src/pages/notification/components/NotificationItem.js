import React, { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./NotificationItem.css";

const NotificationItem = ({ notification, onDelete }) => {
  const { _id, content, date } = notification;
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-4 shadow-md rounded-md mb-4`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold">{content}</p>
        {/* <p className="text-gray-500 text-sm">{date}</p> */}

        <button
          onClick={onDelete}
          className={`${
            isDarkMode ? "icon-trash icon-trash-white" : "icon-trash"
          }`}
        >
          <span class="icon-trash"></span>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;

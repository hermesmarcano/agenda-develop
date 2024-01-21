import React, { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext";
import "./NotificationItem.css";
import i18next from "i18next";

const NotificationItem = ({ notification, onDelete }) => {
  const { content, _id } = notification;
  console.log(notification);
  const notificationTime = new Date(notification.createdAt) || new Date();
  const { isDarkMode } = useContext(DarkModeContext);

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  const formatDate = (date, language) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const locale = language === "es" ? "es-ES" : "en-US";

    return date.toLocaleDateString(locale, options);
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-4 shadow-md rounded-md mb-4`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold">{content}</p>
        <p className="font-semibold">
          {formatDate(notificationTime, getCurrentLanguage())}
        </p>
        {/* <p className="text-gray-500 text-sm">{date}</p> */}

        <button
          onClick={() => onDelete(_id)}
          className={`${
            isDarkMode ? "icon-trash icon-trash-white" : "icon-trash"
          } lower-z-index`}
        >
          <span class="icon-trash lower-z-index"></span>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;

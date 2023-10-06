import React, { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import NotificationList from "./components/NotificationList";
import { NotificationContext } from "../../context/NotificationContext";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useTranslation } from "react-i18next";

const Notification = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const {
    notifications,
    unreadCount,
    updateNotificationsSeen,
    deleteNotification,
  } = useContext(NotificationContext);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredNotifications = notifications.filter((notification) =>
    notification.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8 p-4 pr-8">
      <h1 className="text-2xl font-semibold mb-4">{t("Notifications")}</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder={t("Search...")}
          className={`px-4 py-2 w-full border rounded-md mr-2 ${
            isDarkMode ? "bg-gray-700" : "bg-white"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="text-gray-500" />
      </div>
      <NotificationList
        notifications={filteredNotifications}
        onDelete={deleteNotification}
      />
    </div>
  );
};

export default Notification;

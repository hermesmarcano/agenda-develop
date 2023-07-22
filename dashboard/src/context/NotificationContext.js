import axios from "axios";
import { createContext, useEffect, useState } from "react";

const NotificationContext = createContext();

const NotificationContextWrapper = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationData = () => {
    axios
      .get("http://localhost:4040/managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.notifications) {
          setNotifications(response.data.notifications);
          let count = 0;
          response.data.notifications.map((notification) => {
            if (!notification.isRead) {
              count++;
            }
          });
          setUnreadCount(count);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const sendNotification = (newNotification) => {
    let patchData = {
      notifications: [
        ...notifications,
        { content: newNotification, isRead: false },
      ],
    };
    axios
      .patch("http://localhost:4040/managers", patchData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        fetchNotificationData();
      })
      .catch((error) => console.log(error));
  };

  const updateNotificationsSeen = () => {
    let patchData = {
      notifications: notifications,
    };
    patchData.notifications.map((notification) => {
      notification.isRead = true;
    });
    axios
      .patch("http://localhost:4040/managers", patchData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUnreadCount(0);
        fetchNotificationData();
      })
      .catch((error) => console.log(error));
  };

  const contextValue = {
    notifications,
    unreadCount,
    sendNotification,
    updateNotificationsSeen,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextWrapper };

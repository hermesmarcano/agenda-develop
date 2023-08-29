import { createContext, useEffect, useState } from "react";
import apiProvider from "../axiosConfig/axiosConfig";

const NotificationContext = createContext();

const NotificationContextWrapper = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const token = `${localStorage.getItem("ag_app_shop_token")}`;
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationData = () => {
    apiProvider
      .get("managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.notifications) {
          console.log(token);
          setNotifications(response.data.notifications.reverse());
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

    apiProvider
      .patch("managers", patchData, {
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
    apiProvider
      .patch("managers", patchData, {
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

  const deleteNotification = () => {
    console.log("notification deleted");
  };

  const contextValue = {
    notifications,
    unreadCount,
    sendNotification,
    updateNotificationsSeen,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextWrapper };

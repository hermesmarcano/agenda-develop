import { createContext, useEffect, useState } from "react";
import instance from "../axiosConfig/axiosConfig";
import { Store } from "react-notifications-component";
import { useTranslation } from "react-i18next";

const NotificationContext = createContext();

const NotificationContextWrapper = ({ children }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [unreadCount, setUnreadCount] = useState(0);

  const notify = (title, message, type) => {
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "bottom-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
      onNotificationRemoval: () => this.remove(),
    });
  };

  const remove = () => {
    Store.removeNotification({});
  };

  const fetchNotificationData = () => {
    instance
      .get("managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.notifications) {

          let orderedNotifications = response.data.notifications.reverse();
          setNotifications(orderedNotifications);
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
    console.log('sendingNotification...');
    let patchData = {
      notifications: [
        ...notifications,
        { content: newNotification, isRead: false },
      ],
    };

    instance
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
    instance
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

  const deleteNotification = (id) => {
    const filteredNotifications = notifications.filter(notification => notification._id !== id)
    let patchData = {
      notifications: filteredNotifications,
    };
    console.log(filteredNotifications);
    instance
      .patch("managers", patchData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        notify(
          t("Notifications Update"),
          t("Notification has been deleted"),
          "success"
        );
        fetchNotificationData();
      })
      .catch((error) => console.log(error));
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

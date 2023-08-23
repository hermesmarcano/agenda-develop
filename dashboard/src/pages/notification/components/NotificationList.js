import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications, onDelete }) => {
  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList;

import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const NotificationCenter = (title, message, type) => {
  const createNotification = (title, message, type) => {
    return () => {
      // eslint-disable-next-line default-case
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success(message, title);
          break;
        case 'warning':
          NotificationManager.warning(message, 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error(message, title, 5000, () => {
            alert('callback');
          });
          break;
      }
    };
  };

    return (
      <div>
        {createNotification(title, message, type)}

        <NotificationContainer/>
      </div>
    );
}

export default NotificationCenter;
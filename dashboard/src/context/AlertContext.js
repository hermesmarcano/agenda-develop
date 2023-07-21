import React, { createContext, useState } from "react";

const AlertContext = createContext();

const AlertContextWrapper = ({ children }) => {
  const [alertOn, setAlertOn] = useState(true);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertMsgType, setAlertMsgType] = useState("");

  const contextValue = {
    alertOn,
    setAlertOn,
    alertMsg,
    setAlertMsg,
    alertMsgType,
    setAlertMsgType,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
    </AlertContext.Provider>
  );
};

export { AlertContext, AlertContextWrapper };

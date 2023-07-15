import { createContext, useState } from "react";

const AlertContext = createContext();

export default AlertContext;

const AlertContextModel = () => {
  const [alertOn, setAlertOn] = useState(true);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertMsgType, setAlertMsgType] = useState("");
};

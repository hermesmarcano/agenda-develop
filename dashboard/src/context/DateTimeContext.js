import { createContext, useState } from "react";

const DateTimeContext = createContext();

const DateTimeContextWrapper = ({ children }) => {
  const [dateTime, setDateTime] = useState(new Date());

  const contextValue = {
    dateTime,
    setDateTime,
  };

  return (
    <DateTimeContext.Provider value={contextValue}>
      {children}
    </DateTimeContext.Provider>
  );
};

export { DateTimeContext, DateTimeContextWrapper };

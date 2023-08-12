import React, { createContext, useState } from "react";

const DarkModeContext = createContext();

const DarkModeContextWrapper = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const contextValue = {
    isDarkMode,
    setIsDarkMode,
  };

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
};

export { DarkModeContext, DarkModeContextWrapper };

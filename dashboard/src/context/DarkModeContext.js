import React, { createContext, useState } from "react";

const DarkModeContext = createContext();

const DarkModeContextWrapper = ({ children }) => {
  const storedDarkMode = localStorage.getItem("dark_mode");
  const [isDarkMode, setDarkMode] = useState(
    storedDarkMode === "dark" ? true : false
  );

  const setIsDarkMode = (isDark) => {
    if (isDark) {
      localStorage.setItem("dark_mode", "dark");
      setDarkMode(true);
    } else {
      localStorage.setItem("dark_mode", "light");
      setDarkMode(false);
    }
  };

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

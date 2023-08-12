import { createContext, useState } from "react";

const ViewModeContext = createContext();

const ViewModeContextWrapper = ({ children }) => {
  const [viewMode, setViewMode] = useState("daily");

  const contextValue = {
    viewMode,
    setViewMode,
  };

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  );
};

export { ViewModeContext, ViewModeContextWrapper };

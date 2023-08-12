import React, { useState } from "react";

const SidebarContext = React.createContext();

const SidebarContextWrapper = ({ children }) => {
  const [isSidebarOpen, toggleSidebar] = useState(true);
  const [shopId, setShopId] = useState("");
  const [shopName, setShopName] = useState("");

  const contextValue = {
    isSidebarOpen,
    toggleSidebar,
    shopId,
    setShopId,
    shopName,
    setShopName,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarContextWrapper };

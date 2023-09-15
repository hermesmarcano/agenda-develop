import React, { useEffect, useState } from "react";
import instance from "../axiosConfig/axiosConfig";

const SidebarContext = React.createContext();

const SidebarContextWrapper = ({ children }) => {
  const [isSidebarOpen, toggleSidebar] = useState(true);
  const [shopId, setShopId] = useState("");
  const [shopName, setShopName] = useState("");
  const token = localStorage.getItem("ag_app_shop_token");

  useEffect(() => {
    instance
      .get("managers/", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          localStorage.removeItem("ag_app_shop_token");
          window.location.replace(`${process.env.REACT_APP_URL}login`);
        }

        return response.data;
      })
      .then((data) => {
        setShopName(data.shopName);
        setShopId(data._id);
      })

      .catch((errors) => console.log(errors));
  }, [shopId]);

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

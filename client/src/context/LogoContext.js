import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";

const LogoContext = createContext();

const LogoContextWrapper = ({ children }) => {
  const [logo, setLogo] = useState("https://via.placeholder.com/50x50");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");

      if (response.data.admin.logo) {
        setLogo((prev) => (response.data.admin.logo))
        if(response.data.admin.logo === null || response.data.admin.logo === ""){
          setLogo((prev) => ({...prev, image: "https://via.placeholder.com/50"}))
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    logo,
    setLogo,
  };

  return (
    <LogoContext.Provider value={contextValue}>{children}</LogoContext.Provider>
  );
};

export { LogoContext, LogoContextWrapper };

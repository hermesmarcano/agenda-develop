import { createContext, useState, useEffect } from "react";
import axios from "axios";

const LogoContext = createContext();

const LogoContextWrapper = ({ children }) => {
  const [logo, setLogo] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get("http://localhost:4040/admin");
      console.log(response.data.admin);

      if (response.data.admin.logo) {
        setLogo(response.data.admin.logo);
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

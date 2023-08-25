import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";

const WebsiteTitleContext = createContext();

const WebsiteTitleContextWrapper = ({ children }) => {
  const [websiteTitle, setWebsiteTitle] = useState("My Website");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      console.log(response.data.admin);

      if (response.data.admin.websiteTitle) {
        setWebsiteTitle(response.data.admin.websiteTitle);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    websiteTitle,
    setWebsiteTitle,
  };

  return (
    <WebsiteTitleContext.Provider value={contextValue}>
      {children}
    </WebsiteTitleContext.Provider>
  );
};

export { WebsiteTitleContext, WebsiteTitleContextWrapper };

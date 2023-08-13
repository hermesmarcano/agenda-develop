import { createContext, useState, useEffect } from "react";
import axios from "axios";

const WebsiteTitleContext = createContext();

const WebsiteTitleContextWrapper = ({ children }) => {
  const [websiteTitle, setWebsiteTitle] = useState("My Website");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get("http://localhost:4040/admin");
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

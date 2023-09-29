import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const WebsiteTitleContext = createContext();

const WebsiteTitleContextWrapper = ({ children }) => {
  const { t } = useTranslation();
  const [websiteTitle, setWebsiteTitle] = useState(t("My Website"));

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      if (response.data.admin.websiteTitle) {
        setWebsiteTitle(response.data.admin.websiteTitle)
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

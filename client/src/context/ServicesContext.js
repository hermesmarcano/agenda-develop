import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const ServicesContext = createContext();

const ServicesContextWrapper = ({ children }) => {
  const { t } = useTranslation();
  const [servicesData, setServicesData] = useState([
    {
      _id: 1,
      title: t("Service 1"),
      image: "https://via.placeholder.com/500x300",
    },
    {
      _id: 2,
      title: t("Service 1"),
      image: "https://via.placeholder.com/500x300",
    },
    {
      _id: 3,
      title: t("Service 1"),
      image: "https://via.placeholder.com/500x300",
    },
  ]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");

      if (response.data.admin.servicesData.length !== 0) {
        let servicesDataArr = response.data.admin.servicesData
        servicesDataArr?.map((service, index) => {
          if(!service.image){
            service.image = "https://via.placeholder.com/500x300";
          }
        })
        setServicesData((prev) => servicesDataArr);
      }
  } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    servicesData,
    setServicesData,
  };

  return (
    <ServicesContext.Provider value={contextValue}>
      {children}
    </ServicesContext.Provider>
  );
};

export { ServicesContext, ServicesContextWrapper };

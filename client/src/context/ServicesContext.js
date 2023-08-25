import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";

const ServicesContext = createContext();

const ServicesContextWrapper = ({ children }) => {
  const [servicesData, setServicesData] = useState([
    {
      _id: 1,
      title: "Service 1",
      image: "https://via.placeholder.com/500x300",
    },
    {
      _id: 2,
      title: "Service 1",
      image: "https://via.placeholder.com/500x300",
    },
    {
      _id: 3,
      title: "Service 1",
      image: "https://via.placeholder.com/500x300",
    },
  ]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      console.log(response.data.admin);

      if (response.data.admin.servicesData) {
        setServicesData(response.data.admin.servicesData);
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

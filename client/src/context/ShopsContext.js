import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";

const ShopsContext = createContext();

const ShopsContextWrapper = ({ children }) => {
  const [shopsData, setShopsData] = useState([
    {
      _id: 1,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 2,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 3,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 4,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 5,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 6,
      title: "Shop 1",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
  ]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      console.log(response.data.admin);
      if (response.data.admin.shopsData) {
        setShopsData(response.data.admin.shopsData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    shopsData,
    setShopsData,
  };

  return (
    <ShopsContext.Provider value={contextValue}>
      {children}
    </ShopsContext.Provider>
  );
};

export { ShopsContext, ShopsContextWrapper };

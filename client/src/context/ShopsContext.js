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
      title: "Shop 2",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 3,
      title: "Shop 3",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 4,
      title: "Shop 4",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 5,
      title: "Shop 5",
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 6,
      title: "Shop 6",
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
      if (response.data.admin.shopsData.length !== 0) {
        let shosDataArr = response.data.admin.shopsData;
        shosDataArr?.map((shop, index) => {
          if (!shop.image) {
            shop.image = "https://via.placeholder.com/150";
          }
        });
        setShopsData((prev) => shosDataArr);
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

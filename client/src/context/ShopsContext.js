import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const ShopsContext = createContext();

const ShopsContextWrapper = ({ children }) => {
  const { t } = useTranslation();
  const [shopsData, setShopsData] = useState([
    {
      _id: 1,
      title: t("Shop 1"),
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 2,
      title: t("Shop 2"),
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 3,
      title: t("Shop 3"),
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 4,
      title: t("Shop 4"),
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 5,
      title: t("Shop 5"),
      image: "https://via.placeholder.com/150",
      urlSlug: "#",
    },
    {
      _id: 6,
      title: t("Shop 6"),
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

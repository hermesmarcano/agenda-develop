import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";

const HeroContext = createContext();

const HeroContextWrapper = ({ children }) => {
  const [heroData, setHeroData] = useState({
    heroText: "Find The Right Shop for Your Need",
    heroColor: "white",
    heroBgColor: "gray-800",
    heroStyle: "hero",
    sliderDataImgs: [
      "https://via.placeholder.com/800x300",
      "https://via.placeholder.com/800x300",
      "https://via.placeholder.com/800x300",
    ],
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      console.log(response.data.admin);

      if (response.data.admin.heroData) {
        setHeroData(response.data.admin.heroData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    heroData,
    setHeroData,
  };

  return (
    <HeroContext.Provider value={contextValue}>{children}</HeroContext.Provider>
  );
};

export { HeroContext, HeroContextWrapper };

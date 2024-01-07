import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const HeroContext = createContext();

const HeroContextWrapper = ({ children }) => {
  const { t } = useTranslation();
  const [heroData, setHeroData] = useState(null);
  const heroDemo = {
    heroText: t('Find The Right Shop for Your Need'),
    heroColor: "white",
    heroBgColor: "sky-800",
    heroStyle: "hero",
    sliderDataImgs: [
      "https://via.placeholder.com/800x300",
      "https://via.placeholder.com/800x300",
      "https://via.placeholder.com/800x300",
    ],
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
        console.log(response.data.admin.heroData);
        setHeroData(response.data.admin.heroData)

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

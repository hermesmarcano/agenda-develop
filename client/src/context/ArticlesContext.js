import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const ArticlesContext = createContext();

const ArticlesContextWrapper = ({ children }) => {
  const { t } = useTranslation();
  const [articlesData, setArticlesData] = useState([
    {
      _id: 1,
      title: t("The Benefits of Regular Exercise"),
      image: "https://via.placeholder.com/600x400",
      author: t("John Smith"),
      date: t("January 1, 2022"),
      content: t("Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m"),
    },
    {
      _id: 2,
      title: t("The Benefits of Regular Exercise"),
      image: "https://via.placeholder.com/600x400",
      author: t("John Smith"),
      date: t("January 1, 2022"),
      content: t("Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m"),
    },
    {
      _id: 3,
      title: t("The Benefits of Regular Exercise"),
      image: "https://via.placeholder.com/600x400",
      author: t("John Smith"),
      date: t("January 1, 2022"),
      content: t("Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m"),
    },
    {
      _id: 4,
      title: t("The Benefits of Regular Exercise"),
      image: "https://via.placeholder.com/600x400",
      author: t("John Smith"),
      date: t("January 1, 2022"),
      content: t("Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m"),
    },
  ]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      if (response.data.admin.articlesData.length !== 0) {
        let articlesDataArr = response.data.admin.articlesData;
        articlesDataArr?.map((article, index) => {
          if (!article.image) {
            article.image = "https://via.placeholder.com/600x400";
          }
        });
        console.log(articlesDataArr);
        setArticlesData((prev) => articlesDataArr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue = {
    articlesData,
    setArticlesData,
  };

  return (
    <ArticlesContext.Provider value={contextValue}>
      {children}
    </ArticlesContext.Provider>
  );
};

export { ArticlesContext, ArticlesContextWrapper };

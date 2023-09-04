import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";

const ArticlesContext = createContext();

const ArticlesContextWrapper = ({ children }) => {
  const [articlesData, setArticlesData] = useState([
    {
      _id: 1,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
    },
    {
      _id: 2,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
    },
    {
      _id: 3,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
    },
    {
      _id: 4,
      title: "The Benefits of Regular Exercise",
      image: "https://via.placeholder.com/600x400",
      author: "John Smith",
      date: "January 1, 2022",
      content: "Lorem Ipsum is Lorem Ipsum, Lorem Ipsum is aute m",
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

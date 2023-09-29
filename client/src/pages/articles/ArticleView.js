import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaSpinner } from "react-icons/fa";
import instance from "../../axiosConfig/axiosConfig";
import { useTranslation } from "react-i18next";

const ArticleView = () => {
  const { t } = useTranslation();
  const [article, setArticle] = useState({});
  const param = useParams();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get(`admin/article/${param.id}`);
      console.log(response.data);
      setArticle(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { image, date, title, content, author } = article;

  return (
    <>
      <Navbar />
      {Object.keys(article).length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col justify-center items-center space-x-2">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <span className="mt-2">{t("Loading...")}</span>
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 mb-4 hover:text-gray-900 transition duration-300"
          >
            <FiArrowLeft className="mr-2" />
            {t("Back to Home")}
          </Link>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <img
              src={article.image}
              alt="Article"
              className="w-full mb-4 rounded-lg"
            />

            <div className="text-gray-500 mb-2">{date}</div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-700">{content}</p>
            <p className="text-gray-600 mt-4">{t('By')}{" "}{author}</p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ArticleView;

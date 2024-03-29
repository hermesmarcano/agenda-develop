import { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { ArticlesContext } from "../../../context/ArticlesContext";
import { useTranslation } from "react-i18next";

const ArticlesSlider = () => {
  const { t } = useTranslation();
  const { articlesData } = useContext(ArticlesContext);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-4">{t('Articles')}</h2>
      <Slider {...settings}>
        {articlesData.map((article) => (
          <div key={article._id} className="px-2">
            <Link to={`/article/${article._id}`}>
              <div className="border rounded-lg overflow-hidden">
                <img
                  className="w-full"
                  src={article.image}
                  alt={article.title}
                />
                <div className="px-4 py-2">
                  <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-700">
                    {t('By')} {article.author} {t('on')} {article.date}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ArticlesSlider;

import { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { ArticlesContext } from "../../../context/ArticlesContext";

const ArticlesSlider = () => {
  const { articlesData } = useContext(ArticlesContext);
  console.log(articlesData);

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
      <h2 className="text-2xl font-bold mb-4">Articles</h2>
      <Slider {...settings}>
        {articlesData.map((article) => (
          <div key={article._id} className="px-2">
            <Link to={`/article/${article._id}`}>
              <div className="border rounded-lg overflow-hidden">
                <img
                  className="w-full"
                  src={`http://localhost:4040/uploads/admin/${article.image}`}
                  alt={article.title}
                />
                <div className="px-4 py-2">
                  <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-700">
                    By {article.author} on {article.date}
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

import { useContext, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import shopsContext from "../context/ShopsContext";

const RecommendedShopsSlider = () => {
  const { shopsData } = useContext(shopsContext);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-4">Recommended Shops</h2>
      <Slider {...settings}>
        {shopsData.map((shop) => (
          <div key={shop._id} className="px-2">
            <div className="border rounded-lg overflow-hidden">
              <img
                className="w-full"
                src={`http://localhost:4040/uploads/admin/${shop.image}`}
                alt={shop.title}
              />
              <div className="px-4 py-2">
                <h3 className="font-bold text-lg mb-2">{shop.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecommendedShopsSlider;
